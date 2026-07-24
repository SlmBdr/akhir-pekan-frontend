import { NextResponse } from 'next/server';
import { CmsService } from '@/lib/services/cms.service';
import { verifyAdmin } from '@/lib/auth-helper';

export async function GET() {
  try {
    const footer = await CmsService.getFooter();
    return NextResponse.json(footer);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const savedFooter = await CmsService.saveFooter(body);
    return NextResponse.json(savedFooter);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
