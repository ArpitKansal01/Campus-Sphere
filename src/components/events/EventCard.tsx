
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
};

type EventCardProps = {
  event: EventType;
};

const EventCard = ({ event }: EventCardProps) => {
  const { title, description, date, time, location, attendees, image } = event;

  return (
    <div className="campus-card overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-medium text-lg truncate">{title}</h3>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{attendees} attending</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        <Button className="w-full">RSVP</Button>
      </div>
    </div>
  );
};

export default EventCard;
