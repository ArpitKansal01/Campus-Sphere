import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/campus-nexus-sphere', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  content: String,
  sender: {
    id: String,
    name: String,
    avatar: String
  },
  receiver: {
    id: String,
    type: String // 'user' or 'group'
  },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Group Schema
const groupSchema = new mongoose.Schema({
  name: String,
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('Group', groupSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  startDate: Date,
  endDate: Date,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // For testing only - remove in production
    if (token === 'test-token-for-development') {
      req.user = { _id: 'test-user-id', firstName: 'Test', lastName: 'User' };
      return next();
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters and include uppercase, lowercase, number, and special character' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    // Send user data along with token
    res.json({ 
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// AI Tutor endpoint with Gemini API
app.post('/api/ai/chat', auth, async (req, res) => {
  try {
    const { message, category, history } = req.body;
    
    // Log the request for debugging
    console.log('AI Chat Request:', { message, category, historyLength: history?.length });
    
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      throw new Error('API configuration error');
    }
    
    // Create a system prompt based on the category
    let systemPrompt = "You are a helpful AI campus tutor. Provide concise responses under 100 words. ";
    
    if (category === 'studies') {``
      systemPrompt += "You specialize in academic assistance, explaining concepts, and study strategies.";
    } else if (category === 'career') {
      systemPrompt += "You specialize in career guidance, resume building, and interview preparation.";
    } else if (category === 'resources') {
      systemPrompt += "You specialize in campus resources, including academic support, mental health services, and financial aid.";
    }
    
    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Add the length constraint to the prompt
    let fullPrompt = `${systemPrompt}\n\nIMPORTANT: Keep your response under 100 words.\n\n`;
    
    // Add simplified conversation context if available
    if (history && history.length > 0) {
      fullPrompt += "Previous conversation:\n";
      for (const msg of history.slice(-3)) { // Reduced from 5 to 3 messages
        const role = msg.role === 'assistant' ? 'AI Tutor' : 'Student';
        fullPrompt += `${role}: ${msg.content}\n`;
      }
      fullPrompt += "\n";
    }
    
    // Add the current query
    fullPrompt += `Student's current question: ${message}\n\n`;
    fullPrompt += "AI Tutor's response (under 100 words):";
    
    // Generate content with a single prompt
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();
    
    res.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.json({ 
      response: "I'm having trouble connecting right now. Please try again in a moment."
    });
  }
});

// Event routes
app.post('/api/events', auth, async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, category, image } = req.body;
    
    const newEvent = new Event({
      title,
      description,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      organizer: req.user._id,
      attendees: [req.user._id], // Organizer automatically attends
      category,
      image
    });
    
    await newEvent.save();
    res.status(201).json({ 
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ startDate: 1 }) // Sort by start date ascending
      .populate('organizer', 'firstName lastName');
    
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});