import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import connectToDatabase from './db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function authenticateRequest(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Authentication required' };
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    await connectToDatabase();
    
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user, token, error: null };
  } catch (error) {
    return { user: null, error: 'Please authenticate' };
  }
}
