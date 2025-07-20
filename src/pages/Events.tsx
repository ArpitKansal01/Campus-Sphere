
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import EventForm from "@/components/events/EventForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Transform the data to match EventCard component expectations
        const formattedEvents = data.map(event => ({
          id: event._id,
          title: event.title,
          description: event.description,
          date: new Date(event.startDate).toLocaleDateString(),
          time: new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          location: event.location,
          attendees: event.attendees?.length || 0,
          image: event.image
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Campus Events</h1>
        <EventForm />
      </div>
      
      {loading ? (
        <div className="text-center py-12">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No events found</p>
          <EventForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
