import { NextResponse } from 'next/server';
import { CmsService } from '@/lib/services/cms.service';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const page = await CmsService.getPageBySlug(slug);
    if (!page) {
      return NextResponse.json(
        { success: false, error: `Page with slug ${slug} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
