import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getBuyers } from '@/lib/actions';
import { exportToCSV } from '@/lib/csv';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = {
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      status: searchParams.get('status') || undefined,
      timeline: searchParams.get('timeline') || undefined,
      sort: searchParams.get('sort') || undefined,
    };

    // Get all buyers matching the current filters (not paginated for export)
    const { buyers } = await getBuyers(queryParams);
    const csvContent = exportToCSV(buyers);

    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', 'attachment; filename="buyer-leads.csv"');

    return new NextResponse(csvContent, { headers });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    );
  }
}