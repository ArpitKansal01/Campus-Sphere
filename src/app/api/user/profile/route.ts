import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';
import Event from '@/models/Event';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    await connectToDatabase();
    
    // We fetch a fresh copy of the user to ensure data is up to date
    const user = await User.findById(authResult.user._id).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch events the user is attending
    const registeredEvents = await Event.find({ attendees: authResult.user._id })
      .sort({ startDate: 1 })
      .select('title startDate location image');

    return NextResponse.json({
      _id: user._id, id: user._id, firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      phone: user.phone,
      rollNo: user.rollNo,
      course: user.course,
      section: user.section,
      registeredEvents: registeredEvents,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { firstName, lastName, email, profilePicture, phone, rollNo, course, section } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if email is being changed and if it already exists
    if (email !== authResult.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: 'Email is already in use by another account' }, { status: 409 });
      }
    }

    const updateData: any = { firstName, lastName, email };
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (phone !== undefined) updateData.phone = phone;
    if (rollNo !== undefined) updateData.rollNo = rollNo;
    if (course !== undefined) updateData.course = course;
    if (section !== undefined) updateData.section = section;

    const updatedUser = await User.findByIdAndUpdate(
      authResult.user._id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
        phone: updatedUser.phone,
        rollNo: updatedUser.rollNo,
        course: updatedUser.course,
        section: updatedUser.section,
      }
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
