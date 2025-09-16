import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buyers } from '@/lib/db/schema';
import { buyerSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    
    let query = db.select().from(buyers);
    
    // Apply filters
    const filters = [];
    if (searchParams.get('city')) {
      filters.push(`city = '${searchParams.get('city')}'`);
    }
    if (searchParams.get('propertyType')) {
      filters.push(`property_type = '${searchParams.get('propertyType')}'`);
    }
    if (searchParams.get('status')) {
      filters.push(`status = '${searchParams.get('status')}'`);
    }
    if (searchParams.get('timeline')) {
      filters.push(`timeline = '${searchParams.get('timeline')}'`);
    }
    if (searchParams.get('search')) {
      const search = searchParams.get('search');
      filters.push(`(full_name LIKE '%${search}%' OR phone LIKE '%${search}%' OR email LIKE '%${search}%')`);
    }
    
    const allBuyers = await db.select().from(buyers).limit(pageSize).offset(offset);
    const totalCount = await db.select({ count: buyers.id }).from(buyers);
    const totalPages = Math.ceil(totalCount.length / pageSize);
    
    return NextResponse.json({ 
      buyers: allBuyers, 
      totalPages, 
      currentPage: page 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch buyers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    
    const validatedData = buyerSchema.parse(data);
    
    const [newBuyer] = await db.insert(buyers).values({
      ...validatedData,
      budgetMin: validatedData.budgetMin ? Number(validatedData.budgetMin) : undefined,
      budgetMax: validatedData.budgetMax ? Number(validatedData.budgetMax) : undefined,
    }).returning();

    return NextResponse.json(newBuyer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create buyer' }, { status: 500 });
  }
}