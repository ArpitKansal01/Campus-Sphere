import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: String,
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  category: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Group || mongoose.model('Group', groupSchema);
