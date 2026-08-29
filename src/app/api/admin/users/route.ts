import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    await connectToDatabase();

    // Verify Admin status
    if (authResult.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    const users = await User.find({}, '-password').sort({ createdAt: -1 }); // Exclude passwords, newest first
    return NextResponse.json(users);
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    await connectToDatabase();
    
    if (authResult.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { firstName, lastName, email, password, role } = await req.json();

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    const userResponse = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      isBlocked: newUser.isBlocked
    };

    return NextResponse.json({ message: 'User created successfully', user: userResponse }, { status: 201 });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    await connectToDatabase();
    
    if (authResult.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { userId, isBlocked } = await req.json();
    const userToUpdate = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });
    
    if (!userToUpdate) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully', user: userToUpdate });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    await connectToDatabase();
    
    if (authResult.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    }

    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
