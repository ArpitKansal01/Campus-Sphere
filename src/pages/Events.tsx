
import { useState } from "react";
import EventCard, { EventType } from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Search, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data
const allEvents: EventType[] = [
  {
    id: "1",
    title: "Tech Career Fair",
    description: "Connect with top tech companies and startups. Bring your resume and be ready to network!",
    date: "May 15, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "University Center, Grand Hall",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Spring Music Festival",
    description: "Annual spring music festival featuring student bands and local artists.",
    date: "April 22, 2023",
    time: "5:00 PM - 10:00 PM",
    location: "Campus Quad",
    attendees: 350,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "AI Ethics Workshop",
    description: "Join faculty experts for a discussion on the ethical implications of AI technology.",
    date: "May 10, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "Computer Science Building, Room 105",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1526378800651-c32d3ce2b826?w=800&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Mental Health Awareness Day",
    description: "A day dedicated to mental health awareness with workshops, resources, and support.",
    date: "May 20, 2023",
    time: "11:00 AM - 3:00 PM",
    location: "Student Union Building",
    attendees: 85,
    image: "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "International Food Festival",
    description: "Celebrate cultural diversity through culinary experiences from around the world.",
    date: "May 25, 2023",
    time: "12:00 PM - 6:00 PM",
    location: "University Plaza",
    attendees: 200,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Research Symposium",
    description: "Undergraduate and graduate students present their research projects.",
    date: "June 5, 2023",
    time: "9:00 AM - 4:00 PM",
    location: "Science Building, Multiple Rooms",
    attendees: 110,
    image: "https://images.unsplash.com/photo-1567168539593-59673ababaae?w=800&auto=format&fit=crop"
  }
];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredEvents = allEvents.filter(event => {
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           event.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campus Events</h1>
          <p className="mt-2 text-muted-foreground">
            Discover and join events happening around your campus
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="career">Career</SelectItem>
              <SelectItem value="arts">Arts & Culture</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date
          </Button>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredEvents.length} events
        </p>
      </div>
      
      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setCategoryFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Events;
