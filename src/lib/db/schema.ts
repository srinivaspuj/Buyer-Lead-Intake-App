import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const buyers = sqliteTable('buyers', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  propertyType: text('property_type').notNull(),
  bhk: text('bhk'),
  purpose: text('purpose').notNull(),
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  timeline: text('timeline').notNull(),
  source: text('source').notNull(),
  status: text('status').notNull().default('New'),
  notes: text('notes'),
  tags: text('tags'),
  ownerId: text('owner_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const buyerHistory = sqliteTable('buyer_history', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  buyerId: text('buyer_id').notNull().references(() => buyers.id),
  changedBy: text('changed_by').notNull().references(() => users.id),
  changedAt: integer('changed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  diff: text('diff').notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Buyer = typeof buyers.$inferSelect;
export type NewBuyer = typeof buyers.$inferInsert;
export type BuyerHistory = typeof buyerHistory.$inferSelect;
export type NewBuyerHistory = typeof buyerHistory.$inferInsert;