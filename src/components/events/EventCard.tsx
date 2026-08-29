import { useState } from "react";
import { CalendarIcon, Clock, MapPin, Users, CheckCircle2, Loader2, List, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
  isRegistered?: boolean;
};

type EventCardProps = {
  event: EventType;
  userRole?: string;
};

const EventCard = ({ event, userRole }: EventCardProps) => {
  const { id, title, description, date, time, location, attendees: initialAttendees, image, isRegistered: initiallyRegistered } = event;
  
  const [isRegistered, setIsRegistered] = useState(initiallyRegistered || false);
  const [attendeesCount, setAttendeesCount] = useState(initialAttendees);
  const [isRegistering, setIsRegistering] = useState(false);
  const [attendeesList, setAttendeesList] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "Authentication Required", description: "Please sign in to register for events.", variant: "destructive" });
      router.push("/signin");
      return;
    }

    setIsRegistering(true);
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }

      setIsRegistered(true);
      setAttendeesCount(data.attendeesCount || attendeesCount + 1);
      toast({ title: "Success!", description: `You have successfully registered for ${title}.` });
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsRegistering(false);
    }
  };

  const fetchAttendees = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingAttendees(true);
    try {
      const res = await fetch(`/api/events/${id}/attendees`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch attendees");
      
      const data = await res.json();
      setAttendeesList(data.attendees || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoadingAttendees(false);
    }
  };

  const getInitials = (firstName: string, lastName: string, email: string) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    return email ? email[0].toUpperCase() : 'U';
  };

  const filteredAttendees = attendeesList.filter(attendee => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (attendee.email && attendee.email.toLowerCase().includes(searchLower)) ||
      (attendee.rollNo && attendee.rollNo.toLowerCase().includes(searchLower)) ||
      (attendee.course && attendee.course.toLowerCase().includes(searchLower))
    );
  });

  const downloadCSV = () => {
    if (filteredAttendees.length === 0) {
      toast({ title: "No data", description: "There are no attendees to download." });
      return;
    }

    const headers = ["First Name", "Last Name", "Email", "Roll No", "Course", "Section"];
    const csvRows = [headers.join(",")];

    for (const attendee of filteredAttendees) {
      const row = [
        `"${attendee.firstName || ''}"`,
        `"${attendee.lastName || ''}"`,
        `"${attendee.email || ''}"`,
        `"${attendee.rollNo || ''}"`,
        `"${attendee.course || ''}"`,
        `"${attendee.section || ''}"`
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="campus-card overflow-hidden flex flex-col h-full bg-card shadow-sm border rounded-xl transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-xl leading-tight line-clamp-1">{title}</h3>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-5 flex-grow">{description}</p>
        
        <div className="space-y-3 text-sm font-medium">
          <div className="flex items-center text-foreground/80">
            <CalendarIcon className="h-4 w-4 text-primary mr-3" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-foreground/80">
            <Clock className="h-4 w-4 text-primary mr-3" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-foreground/80">
            <MapPin className="h-4 w-4 text-primary mr-3" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center text-foreground/80">
            <Users className="h-4 w-4 text-primary mr-3" />
            <span>{attendeesCount} attending</span>
          </div>
        </div>
      </div>
      
      <div className="p-5 pt-0 mt-auto flex flex-col gap-2">
        {isRegistered ? (
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white cursor-default" variant="default">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Registered
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleRegister} 
            disabled={isRegistering}
          >
            {isRegistering ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
            ) : "Register for Event"}
          </Button>
        )}

        {(userRole === 'president' || userRole === 'admin') && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" onClick={fetchAttendees}>
                <List className="mr-2 h-4 w-4" /> View Attendees
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
              <DialogHeader>
                <div className="flex justify-between items-start mr-5">
                  <DialogTitle>Event Attendees ({attendeesCount})</DialogTitle>
                  {attendeesList.length > 0 && (
                    <Button variant="outline" size="sm" onClick={downloadCSV} className="h-8">
                      <Download className="mr-2 h-3.5 w-3.5" /> CSV
                    </Button>
                  )}
                </div>
              </DialogHeader>
              
              {attendeesList.length > 0 && (
                <div className="relative mt-2 mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or roll no..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              {loadingAttendees ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : attendeesList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No one has registered for this event yet.
                </div>
              ) : filteredAttendees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attendees found matching your search.
                </div>
              ) : (
                <ScrollArea className="flex-1 mt-2">
                  <div className="space-y-4 pr-4">
                    {filteredAttendees.map((attendee) => (
                      <div key={attendee._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={attendee.profilePicture} />
                            <AvatarFallback>{getInitials(attendee.firstName, attendee.lastName, attendee.email)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">{attendee.firstName} {attendee.lastName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{attendee.email}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          {attendee.rollNo && <p className="font-medium text-foreground">{attendee.rollNo}</p>}
                          {attendee.course && <p>{attendee.course}</p>}
                          {attendee.section && <p>Sec: {attendee.section}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default EventCard;
