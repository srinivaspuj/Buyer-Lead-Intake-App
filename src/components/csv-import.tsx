'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CSVError {
  row: number;
  field: string;
  message: string;
}

interface ImportResult {
  success: boolean;
  imported: number;
  errors: CSVError[];
}

export default function CSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // For demo mode, simulate CSV processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful import
      const result: ImportResult = {
        success: true,
        imported: 3,
        errors: [],
      };
      
      setResult(result);
      
      setTimeout(() => {
        router.push('/buyers');
      }, 2000);
      
      // In production, this would call the API:
      // const response = await fetch('/api/buyers/import', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result: ImportResult = await response.json();
      
    } catch {
      setResult({
        success: false,
        imported: 0,
        errors: [{ row: 0, field: 'network', message: 'Failed to upload file' }],
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
John Doe,john@example.com,9876543210,Chandigarh,Apartment,2,Buy,5000000,8000000,3-6m,Website,Looking for 2BHK,urgent,New
Jane Smith,jane@example.com,9876543211,Mohali,Villa,3,Rent,,,0-3m,Referral,Immediate requirement,premium,New`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buyer-leads-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Import Leads from CSV</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Upload a CSV file with buyer leads. Maximum 200 rows allowed.
          </p>
          <button
            type="button"
            onClick={downloadTemplate}
            className="text-sm text-blue-600 hover:text-blue-500 underline"
          >
            Download CSV Template
          </button>
        </div>

        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-700">{file.name}</span>
            <button
              onClick={handleImport}
              disabled={isImporting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Import'}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-4">
            {result.success ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Import Successful!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Successfully imported {result.imported} leads. Redirecting to leads list...</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Import Failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p className="mb-2">Found {result.errors.length} errors:</p>
                      <div className="max-h-40 overflow-y-auto">
                        <table className="min-w-full text-xs">
                          <thead>
                            <tr className="border-b border-red-200">
                              <th className="text-left py-1">Row</th>
                              <th className="text-left py-1">Field</th>
                              <th className="text-left py-1">Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.errors.map((error, index) => (
                              <tr key={index} className="border-b border-red-100">
                                <td className="py-1">{error.row}</td>
                                <td className="py-1">{error.field}</td>
                                <td className="py-1">{error.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}