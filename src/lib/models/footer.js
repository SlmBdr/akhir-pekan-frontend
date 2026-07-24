import mongoose from 'mongoose';

const FooterSchema = new mongoose.Schema(
  {
    bigText: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    subtagline: {
      type: String,
      required: true,
    },
    copyrightText: {
      type: String,
      required: true,
    },
    creditText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Footer = mongoose.models.Footer || mongoose.model('Footer', FooterSchema);
