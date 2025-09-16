'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buyerSchema, type BuyerFormData } from '@/lib/validations';
import { createBuyer, updateBuyer } from '@/lib/actions';
import { useState } from 'react';
import type { Buyer } from '@/lib/db/schema';

interface BuyerFormProps {
  buyer?: Buyer;
  mode: 'create' | 'edit';
}

export default function BuyerForm({ buyer, mode }: BuyerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>(
    buyer?.tags ? JSON.parse(buyer.tags) : []
  );
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: buyer ? {
      fullName: buyer.fullName,
      email: buyer.email || '',
      phone: buyer.phone,
      city: buyer.city as BuyerFormData['city'],
      propertyType: buyer.propertyType as BuyerFormData['propertyType'],
      bhk: buyer.bhk as BuyerFormData['bhk'],
      purpose: buyer.purpose as BuyerFormData['purpose'],
      budgetMin: buyer.budgetMin || undefined,
      budgetMax: buyer.budgetMax || undefined,
      timeline: buyer.timeline as BuyerFormData['timeline'],
      source: buyer.source as BuyerFormData['source'],
      status: buyer.status as BuyerFormData['status'],
      notes: buyer.notes || '',
      tags,
    } : {
      status: 'New',
      tags: [],
    },
  });

  const propertyType = watch('propertyType');
  const showBhk = propertyType === 'Apartment' || propertyType === 'Villa';

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: BuyerFormData) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    formData.append('tags', JSON.stringify(tags));

    try {
      if (mode === 'create') {
        const response = await fetch('/api/buyers', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          window.location.href = '/buyers';
        }
      } else if (buyer) {
        const response = await fetch(`/api/buyers/${buyer.id}`, {
          method: 'PUT',
          body: formData,
        });
        if (response.ok) {
          window.location.href = '/buyers';
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            {...register('fullName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone *
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <select
            {...register('city')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select City</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Mohali">Mohali</option>
            <option value="Zirakpur">Zirakpur</option>
            <option value="Panchkula">Panchkula</option>
            <option value="Other">Other</option>
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
            Property Type *
          </label>
          <select
            {...register('propertyType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Office">Office</option>
            <option value="Retail">Retail</option>
          </select>
          {errors.propertyType && (
            <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
          )}
        </div>

        {showBhk && (
          <div>
            <label htmlFor="bhk" className="block text-sm font-medium text-gray-700">
              BHK *
            </label>
            <select
              {...register('bhk')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select BHK</option>
              <option value="Studio">Studio</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </select>
            {errors.bhk && (
              <p className="mt-1 text-sm text-red-600">{errors.bhk.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Purpose *
          </label>
          <select
            {...register('purpose')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select Purpose</option>
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
          {errors.purpose && (
            <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700">
            Budget Min (₹)
          </label>
          <input
            type="number"
            {...register('budgetMin', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.budgetMin && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetMin.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700">
            Budget Max (₹)
          </label>
          <input
            type="number"
            {...register('budgetMax', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.budgetMax && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetMax.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
            Timeline *
          </label>
          <select
            {...register('timeline')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select Timeline</option>
            <option value="0-3m">0-3 months</option>
            <option value="3-6m">3-6 months</option>
            <option value=">6m">&gt;6 months</option>
            <option value="Exploring">Exploring</option>
          </select>
          {errors.timeline && (
            <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700">
            Source *
          </label>
          <select
            {...register('source')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Call">Call</option>
            <option value="Other">Other</option>
          </select>
          {errors.source && (
            <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
          )}
        </div>

        {mode === 'edit' && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              {...register('status')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Contacted">Contacted</option>
              <option value="Visited">Visited</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Converted">Converted</option>
              <option value="Dropped">Dropped</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Additional notes..."
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Lead' : 'Update Lead'}
        </button>
      </div>
    </form>
  );
}