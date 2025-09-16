import { z } from 'zod';

export const cityEnum = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const propertyTypeEnum = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
export const bhkEnum = z.enum(['1', '2', '3', '4', 'Studio']);
export const purposeEnum = z.enum(['Buy', 'Rent']);
export const timelineEnum = z.enum(['0-3m', '3-6m', '>6m', 'Exploring']);
export const sourceEnum = z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']);
export const statusEnum = z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']);

export const buyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: cityEnum,
  propertyType: propertyTypeEnum,
  bhk: bhkEnum.optional(),
  purpose: purposeEnum,
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: timelineEnum,
  source: sourceEnum,
  status: statusEnum.default('New'),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMax >= data.budgetMin;
  }
  return true;
}, {
  message: 'Budget max must be greater than or equal to budget min',
  path: ['budgetMax'],
}).refine((data) => {
  if (['Apartment', 'Villa'].includes(data.propertyType)) {
    return data.bhk !== undefined;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa',
  path: ['bhk'],
});

export type BuyerFormData = z.infer<typeof buyerSchema>;