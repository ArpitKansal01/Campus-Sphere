import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import { authenticateRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    await connectToDatabase();
    
    const { id: eventId } = await params;
    const userId = authResult.user._id;

    const event = await Event.findById(eventId);
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Check if user is already registered
    if (event.attendees && event.attendees.includes(userId)) {
      return NextResponse.json({ message: 'You are already registered for this event' }, { status: 400 });
    }

    // Add user to attendees
    event.attendees = event.attendees || [];
    event.attendees.push(userId);
    await event.save();

    return NextResponse.json({
      message: 'Successfully registered for event',
      attendeesCount: event.attendees.length
    });
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
