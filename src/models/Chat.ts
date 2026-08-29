import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  chatName: { type: String, trim: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  image: { type: String, default: "" },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);
