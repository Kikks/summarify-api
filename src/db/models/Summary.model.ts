import mongoose, { Document, Schema } from 'mongoose';

import { OSummary } from '../../api/resources/interfaces/summary.intf';

const SummarySchema = new Schema<OSummary & Document>(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Summary = mongoose.model('Summary', SummarySchema);

export default Summary;
