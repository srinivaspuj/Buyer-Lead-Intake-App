import BuyerForm from '@/components/buyer-form';

export default function NewBuyerPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Create New Lead</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add a new buyer lead to your database.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <BuyerForm mode="create" />
        </div>
      </div>
    </div>
  );
}