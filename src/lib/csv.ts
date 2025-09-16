import Papa from 'papaparse';
import { buyerSchema } from './validations';
import { db } from './db';
import { buyers, buyerHistory } from './db/schema';

export interface CSVError {
  row: number;
  field: string;
  message: string;
}

export interface CSVImportResult {
  success: boolean;
  imported: number;
  errors: CSVError[];
}

export async function importCSV(csvContent: string, userId: string): Promise<CSVImportResult> {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    return {
      success: false,
      imported: 0,
      errors: result.errors.map((error, index) => ({
        row: error.row || index + 1,
        field: 'csv',
        message: error.message,
      })),
    };
  }

  const data = result.data as Record<string, unknown>[];
  if (data.length > 200) {
    return {
      success: false,
      imported: 0,
      errors: [{ row: 0, field: 'csv', message: 'Maximum 200 rows allowed' }],
    };
  }

  const errors: CSVError[] = [];
  const validRows: Record<string, unknown>[] = [];

  // Validate each row
  data.forEach((row, index) => {
    const rowNumber = index + 1;
    
    try {
      const processedRow = {
        fullName: row.fullName?.trim(),
        email: row.email?.trim() || undefined,
        phone: row.phone?.trim(),
        city: row.city?.trim(),
        propertyType: row.propertyType?.trim(),
        bhk: row.bhk?.trim() || undefined,
        purpose: row.purpose?.trim(),
        budgetMin: row.budgetMin ? parseInt(row.budgetMin) : undefined,
        budgetMax: row.budgetMax ? parseInt(row.budgetMax) : undefined,
        timeline: row.timeline?.trim(),
        source: row.source?.trim(),
        status: row.status?.trim() || 'New',
        notes: row.notes?.trim() || undefined,
        tags: row.tags ? (row.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
      };

      const validation = buyerSchema.safeParse(processedRow);
      
      if (!validation.success) {
        validation.error.issues.forEach((issue) => {
          errors.push({
            row: rowNumber,
            field: issue.path.join('.'),
            message: issue.message,
          });
        });
      } else {
        validRows.push({
          ...validation.data,
          ownerId: userId,
        });
      }
    } catch {
      errors.push({
        row: rowNumber,
        field: 'general',
        message: 'Invalid row data',
      });
    }
  });

  // If there are validation errors, return them
  if (errors.length > 0) {
    return {
      success: false,
      imported: 0,
      errors,
    };
  }

  // Import valid rows in a transaction
  try {
    const importedBuyers = await db.transaction(async (tx) => {
      const insertedBuyers = [];
      
      for (const row of validRows) {
        const [buyer] = await tx.insert(buyers).values({
          ...row,
          email: row.email || null,
          tags: row.tags ? JSON.stringify(row.tags) : null,
        }).returning();
        
        await tx.insert(buyerHistory).values({
          buyerId: buyer.id,
          changedBy: userId,
          diff: JSON.stringify({ action: 'imported', data: row }),
        });
        
        insertedBuyers.push(buyer);
      }
      
      return insertedBuyers;
    });

    return {
      success: true,
      imported: importedBuyers.length,
      errors: [],
    };
  } catch {
    return {
      success: false,
      imported: 0,
      errors: [{ row: 0, field: 'database', message: 'Failed to import data' }],
    };
  }
}

export function exportToCSV(buyerData: Record<string, unknown>[]): string {
  const csvData = buyerData.map(buyer => ({
    fullName: buyer.fullName,
    email: buyer.email || '',
    phone: buyer.phone,
    city: buyer.city,
    propertyType: buyer.propertyType,
    bhk: buyer.bhk || '',
    purpose: buyer.purpose,
    budgetMin: buyer.budgetMin || '',
    budgetMax: buyer.budgetMax || '',
    timeline: buyer.timeline,
    source: buyer.source,
    status: buyer.status,
    notes: buyer.notes || '',
    tags: buyer.tags ? JSON.parse(buyer.tags).join(', ') : '',
    createdAt: new Date(buyer.createdAt).toISOString().split('T')[0],
    updatedAt: new Date(buyer.updatedAt).toISOString().split('T')[0],
  }));

  return Papa.unparse(csvData);
}