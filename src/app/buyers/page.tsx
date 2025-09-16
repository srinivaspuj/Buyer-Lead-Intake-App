'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Buyer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  propertyType: string;
  bhk?: string;
  budgetMin?: number;
  budgetMax?: number;
  status: string;
  updatedAt: Date;
}

function formatBudget(min?: number, max?: number) {
  if (!min && !max) return '-';
  if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  if (min) return `₹${min.toLocaleString()}+`;
  return `Up to ₹${max?.toLocaleString()}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export default function BuyersPage() {
  const { status } = useSession();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    search: '',
    city: '',
    propertyType: '',
    status: '',
    timeline: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    const fetchBuyers = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          ...Object.fromEntries(Object.entries(searchParams).filter(([, v]) => v))
        });
        const response = await fetch(`/api/buyers?${params}`);
        if (response.ok) {
          const data = await response.json();
          setBuyers(data.buyers);
        }
      } catch (error) {
        console.error('Error fetching buyers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuyers();
  }, [status, currentPage, searchParams]);

  if (status === 'loading' || loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl border border-white/30 p-8 mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📊 Lead Dashboard
            </h1>
            <p className="text-lg text-gray-700">
              Transform prospects into success stories
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 flex flex-wrap gap-3">
            <Link
              href="/buyers/import"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📄 Import
            </Link>
            <button
              onClick={() => {
                const csvContent = 'fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,status\\n' +
                  buyers.map(buyer => 
                    `${buyer.fullName},${buyer.email || ''},${buyer.phone},${buyer.city},${buyer.propertyType},${buyer.bhk || ''},Buy,${buyer.budgetMin || ''},${buyer.budgetMax || ''},3-6m,Website,${buyer.status}`
                  ).join('\\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'buyer-leads.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📥 Export
            </button>
            <Link
              href="/buyers/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ✨ New Lead
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            name="search"
            id="search"
            value={searchParams.search}
            onChange={(e) => setSearchParams({...searchParams, search: e.target.value})}
            placeholder="Name, phone, email..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <select
            name="city"
            id="city"
            value={searchParams.city}
            onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Cities</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Mohali">Mohali</option>
            <option value="Zirakpur">Zirakpur</option>
            <option value="Panchkula">Panchkula</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            id="status"
            value={searchParams.status}
            onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Contacted">Contacted</option>
            <option value="Visited">Visited</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Converted">Converted</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>

        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
            Property Type
          </label>
          <select
            name="propertyType"
            id="propertyType"
            value={searchParams.propertyType}
            onChange={(e) => setSearchParams({...searchParams, propertyType: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Office">Office</option>
            <option value="Retail">Retail</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buyers
                  .filter(buyer => {
                    if (searchParams.search) {
                      const search = searchParams.search.toLowerCase();
                      return buyer.fullName.toLowerCase().includes(search) ||
                             buyer.phone.includes(search) ||
                             buyer.email?.toLowerCase().includes(search);
                    }
                    return true;
                  })
                  .filter(buyer => !searchParams.city || buyer.city === searchParams.city)
                  .filter(buyer => !searchParams.status || buyer.status === searchParams.status)
                  .filter(buyer => !searchParams.propertyType || buyer.propertyType === searchParams.propertyType)
                  .map((buyer) => (
                  <tr key={buyer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {buyer.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {buyer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {buyer.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {buyer.propertyType} {buyer.bhk && `(${buyer.bhk} BHK)`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatBudget(buyer.budgetMin, buyer.budgetMax)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        buyer.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        buyer.status === 'Converted' ? 'bg-green-100 text-green-800' :
                        buyer.status === 'Dropped' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {buyer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(buyer.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/buyers/${buyer.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {buyers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-4">No buyer leads found</p>
            <Link
              href="/buyers/new"
              className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Create your first lead
            </Link>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}