import { describe, it, expect } from 'vitest';
import { buyerSchema } from '../validations';

describe('Buyer Validation', () => {
  it('should validate budget constraints', () => {
    const validData = {
      fullName: 'John Doe',
      phone: '9876543210',
      city: 'Chandigarh' as const,
      propertyType: 'Apartment' as const,
      bhk: '2' as const,
      purpose: 'Buy' as const,
      budgetMin: 5000000,
      budgetMax: 8000000,
      timeline: '3-6m' as const,
      source: 'Website' as const,
    };

    const result = buyerSchema.safeParse(validData);
    expect(result.success).toBe(true);

    const invalidData = { ...validData, budgetMax: 3000000 };
    const invalidResult = buyerSchema.safeParse(invalidData);
    expect(invalidResult.success).toBe(false);
  });

  it('should require BHK for Apartment/Villa', () => {
    const apartmentData = {
      fullName: 'Jane Doe',
      phone: '9876543210',
      city: 'Mohali' as const,
      propertyType: 'Apartment' as const,
      purpose: 'Buy' as const,
      timeline: '0-3m' as const,
      source: 'Website' as const,
    };

    const result = buyerSchema.safeParse(apartmentData);
    expect(result.success).toBe(false);

    const validResult = buyerSchema.safeParse({ ...apartmentData, bhk: '2' });
    expect(validResult.success).toBe(true);
  });
});