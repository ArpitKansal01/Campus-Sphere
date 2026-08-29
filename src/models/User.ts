import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'president', 'admin'],
    default: 'student',
  },
  isBlocked: { type: Boolean, default: false },
  profilePicture: { type: String, default: "" },
  phone: { type: String, default: "" },
  rollNo: { type: String, default: "" },
  course: { type: String, default: "" },
  section: { type: String, default: "" },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
