import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buyers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { buyerSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [buyer] = await db.select().from(buyers).where(eq(buyers.id, params.id));
    
    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch buyer' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    
    const validatedData = buyerSchema.parse(data);
    
    const [updatedBuyer] = await db.update(buyers)
      .set({
        ...validatedData,
        budgetMin: validatedData.budgetMin ? Number(validatedData.budgetMin) : undefined,
        budgetMax: validatedData.budgetMax ? Number(validatedData.budgetMax) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(buyers.id, params.id))
      .returning();

    if (!updatedBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBuyer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update buyer' }, { status: 500 });
  }
}