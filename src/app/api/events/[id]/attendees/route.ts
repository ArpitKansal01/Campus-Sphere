import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    if (authResult.user.role !== 'president' && authResult.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden. Only presidents and admins can view attendees.' }, { status: 403 });
    }

    await connectToDatabase();
    
    const { id: eventId } = await params;

    const event = await Event.findById(eventId).populate({
      path: 'attendees',
      select: 'firstName lastName email rollNo course section profilePicture'
    });
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      attendees: event.attendees
    });
  } catch (error) {
    console.error('Fetch attendees error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
