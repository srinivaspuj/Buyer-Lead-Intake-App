'use server';

import { db } from './db';
import { buyers, buyerHistory } from './db/schema';
import { buyerSchema } from './validations';
import { auth } from './auth';
import { eq, and, like, or, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBuyer(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const data = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string || undefined,
    phone: formData.get('phone') as string,
    city: formData.get('city') as string,
    propertyType: formData.get('propertyType') as string,
    bhk: formData.get('bhk') as string || undefined,
    purpose: formData.get('purpose') as string,
    budgetMin: formData.get('budgetMin') ? parseInt(formData.get('budgetMin') as string) : undefined,
    budgetMax: formData.get('budgetMax') ? parseInt(formData.get('budgetMax') as string) : undefined,
    timeline: formData.get('timeline') as string,
    source: formData.get('source') as string,
    notes: formData.get('notes') as string || undefined,
    tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : undefined,
  };

  const validatedData = buyerSchema.parse(data);

  const [buyer] = await db.insert(buyers).values({
    ...validatedData,
    email: validatedData.email || null,
    tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
    ownerId: session.user.id,
  }).returning();

  await db.insert(buyerHistory).values({
    buyerId: buyer.id,
    changedBy: session.user.id,
    diff: JSON.stringify({ action: 'created', data: validatedData }),
  });

  revalidatePath('/buyers');
  redirect('/buyers');
}

export async function updateBuyer(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const currentBuyer = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1);
  if (!currentBuyer.length || currentBuyer[0].ownerId !== session.user.id) {
    throw new Error('Buyer not found or unauthorized');
  }

  const data = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string || undefined,
    phone: formData.get('phone') as string,
    city: formData.get('city') as string,
    propertyType: formData.get('propertyType') as string,
    bhk: formData.get('bhk') as string || undefined,
    purpose: formData.get('purpose') as string,
    budgetMin: formData.get('budgetMin') ? parseInt(formData.get('budgetMin') as string) : undefined,
    budgetMax: formData.get('budgetMax') ? parseInt(formData.get('budgetMax') as string) : undefined,
    timeline: formData.get('timeline') as string,
    source: formData.get('source') as string,
    status: formData.get('status') as string,
    notes: formData.get('notes') as string || undefined,
    tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : undefined,
  };

  const validatedData = buyerSchema.parse(data);

  await db.update(buyers)
    .set({
      ...validatedData,
      email: validatedData.email || null,
      tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
      updatedAt: new Date(),
    })
    .where(eq(buyers.id, id));

  await db.insert(buyerHistory).values({
    buyerId: id,
    changedBy: session.user.id,
    diff: JSON.stringify({ action: 'updated', data: validatedData }),
  });

  revalidatePath('/buyers');
  revalidatePath(`/buyers/${id}`);
  redirect('/buyers');
}

export async function getBuyers(searchParams: {
  page?: string;
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  sort?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const page = parseInt(searchParams.page || '1');
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  let query = db.select().from(buyers);
  
  const conditions = [];
  
  if (searchParams.search) {
    conditions.push(
      or(
        like(buyers.fullName, `%${searchParams.search}%`),
        like(buyers.phone, `%${searchParams.search}%`),
        like(buyers.email, `%${searchParams.search}%`)
      )
    );
  }

  if (searchParams.city) {
    conditions.push(eq(buyers.city, searchParams.city));
  }

  if (searchParams.propertyType) {
    conditions.push(eq(buyers.propertyType, searchParams.propertyType));
  }

  if (searchParams.status) {
    conditions.push(eq(buyers.status, searchParams.status));
  }

  if (searchParams.timeline) {
    conditions.push(eq(buyers.timeline, searchParams.timeline));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const sortField = searchParams.sort || 'updatedAt';
  const sortOrder = desc(buyers[sortField as keyof typeof buyers] || buyers.updatedAt);
  
  const results = await query
    .orderBy(sortOrder)
    .limit(pageSize)
    .offset(offset);

  const totalCount = await db.select({ count: buyers.id }).from(buyers);
  
  return {
    buyers: results,
    totalPages: Math.ceil(totalCount.length / pageSize),
    currentPage: page,
  };
}