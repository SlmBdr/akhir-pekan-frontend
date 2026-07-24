import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['news', 'show'],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);
