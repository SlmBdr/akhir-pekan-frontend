import { NextResponse } from 'next/server';
import { CmsService } from '@/lib/services/cms.service';
import { verifyAdmin } from '@/lib/auth-helper';

export async function DELETE(request, { params }) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deletedPage = await CmsService.deletePage(id);
    return NextResponse.json(deletedPage);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
