import { NextResponse } from 'next/server';
import { CmsService } from '@/lib/services/cms.service';
import { verifyAdmin } from '@/lib/auth-helper';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const { idOrSlug } = await params;
    let article = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      const articles = await CmsService.getArticles();
      article = articles.find(a => a._id.toString() === idOrSlug) || null;
    } else {
      article = await CmsService.getArticleBySlug(idOrSlug);
    }

    if (!article) {
      return NextResponse.json(
        { success: false, error: `Article ${idOrSlug} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { idOrSlug } = await params;
    const deletedArticle = await CmsService.deleteArticle(idOrSlug);
    return NextResponse.json(deletedArticle);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
