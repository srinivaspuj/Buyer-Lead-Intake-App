import CSVImport from '@/components/csv-import';
import Link from 'next/link';

export default function ImportPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">Import Leads</h1>
              <p className="mt-2 text-sm text-gray-700">
                Upload a CSV file to import multiple buyer leads at once.
              </p>
            </div>
            <Link
              href="/buyers"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Leads
            </Link>
          </div>
        </div>

        <CSVImport />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">CSV Format Requirements:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Required fields:</strong> fullName, phone, city, propertyType, purpose, timeline, source</li>
            <li>• <strong>Optional fields:</strong> email, bhk, budgetMin, budgetMax, notes, tags, status</li>
            <li>• <strong>BHK is required</strong> for Apartment and Villa property types</li>
            <li>• <strong>Phone:</strong> 10-15 digits only</li>
            <li>• <strong>Budget:</strong> budgetMax must be ≥ budgetMin if both provided</li>
            <li>• <strong>Tags:</strong> comma-separated values (e.g., "urgent, premium")</li>
            <li>• <strong>Maximum:</strong> 200 rows per import</li>
          </ul>
        </div>
      </div>
    </div>
  );
}