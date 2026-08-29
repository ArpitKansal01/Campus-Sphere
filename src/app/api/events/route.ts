import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import { authenticateRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json({ message: auth.error }, { status: 401 });
    }

    const {
      title,
      description,
      location,
      startDate,
      endDate,
      category,
      image,
    } = await req.json();

    await connectToDatabase();

    const newEvent = new Event({
      title,
      description,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      organizer: auth.user._id,
      attendees: [auth.user._id], // Organizer automatically attends
      category,
      image,
    });

    await newEvent.save();

    return NextResponse.json(
      {
        message: 'Event created successfully',
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Optional auth to check registration status
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader !== 'Bearer null') {
       const auth = await authenticateRequest(req);
       if (auth.user) {
         userId = auth.user._id.toString();
       }
    }

    const events = await Event.find()
      .sort({ startDate: 1 }) // Sort by start date ascending
      .populate('organizer', 'firstName lastName');

    const formattedEvents = events.map(event => {
       const eventObj = event.toObject();
       return {
         ...eventObj,
         isRegistered: userId ? event.attendees?.map((id: any) => id.toString()).includes(userId) : false
       };
    });

    const response = NextResponse.json(formattedEvents);
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
