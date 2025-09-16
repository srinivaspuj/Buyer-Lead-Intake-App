'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BuyerForm from '@/components/buyer-form';
import type { Buyer } from '@/lib/db/schema';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function BuyerDetailPage() {
  const params = useParams();
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [history, setHistory] = useState<{ id: string; changedAt: Date; diff: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const response = await fetch(`/api/buyers/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setBuyer(data);
          setHistory([{
            id: '1',
            changedAt: data.createdAt,
            diff: JSON.stringify({ action: 'created', data }),
          }]);
        }
      } catch (error) {
        console.error('Error fetching buyer:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuyer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-lg text-red-600">Buyer not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            Edit Lead: {buyer.fullName}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Update buyer information and view change history.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <BuyerForm buyer={buyer} mode="edit" />
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Changes</h3>
              
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No changes recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((change) => {
                    const diff = JSON.parse(change.diff) as { action: string; data?: Record<string, unknown> };
                    return (
                      <div key={change.id} className="border-l-2 border-blue-200 pl-4">
                        <div className="text-sm font-medium text-gray-900">
                          {diff.action === 'created' ? 'Lead Created' : 'Lead Updated'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(change.changedAt)}
                        </div>
                        {diff.action === 'updated' && diff.data && (
                          <div className="mt-2 text-xs text-gray-600">
                            <div className="bg-gray-50 rounded p-2">
                              Updated fields: {Object.keys(diff.data).join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Info</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      buyer.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      buyer.status === 'Converted' ? 'bg-green-100 text-green-800' :
                      buyer.status === 'Dropped' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {buyer.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">{formatDate(buyer.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{formatDate(buyer.updatedAt)}</dd>
                </div>
                {buyer.tags && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tags</dt>
                    <dd className="text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {JSON.parse(buyer.tags).map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}