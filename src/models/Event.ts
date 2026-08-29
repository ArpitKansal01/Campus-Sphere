import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  startDate: Date,
  endDate: Date,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  category: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
