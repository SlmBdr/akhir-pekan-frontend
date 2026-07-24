import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['contact', 'collab'],
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
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

export const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
