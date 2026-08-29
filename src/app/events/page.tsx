"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import EventForm from "@/components/events/EventForm";
import { useToast } from "@/components/ui/use-toast";
import { fetchEvents, QUERY_KEYS } from "@/lib/api";

const Events = () => {
  const [userRole, setUserRole] = useState("student");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);
  }, []);

  const { data: rawEvents = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.events,
    queryFn: fetchEvents,
    staleTime: 60 * 1000,    // Events are fresh for 1 minute
    gcTime: 5 * 60 * 1000,
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load events. Please try again later.",
      variant: "destructive",
    });
  }

  const events = rawEvents.map((event: any) => ({
    id: event._id,
    title: event.title,
    description: event.description,
    date: new Date(event.startDate).toLocaleDateString(),
    time: new Date(event.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    location: event.location,
    attendees: event.attendees?.length || 0,
    image: event.image,
    isRegistered: event.isRegistered || false,
  }));

  // Callback passed to EventForm so it can invalidate the cache after creating an event
  const onEventCreated = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Campus Events</h1>
        {(userRole === "president" || userRole === "admin") && (
          <EventForm onSuccess={onEventCreated} />
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No events found</p>
          {(userRole === "president" || userRole === "admin") && (
            <EventForm onSuccess={onEventCreated} />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} userRole={userRole.toLowerCase()} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
