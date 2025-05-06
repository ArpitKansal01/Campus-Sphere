
import { Calendar, Users, Briefcase, MessageSquare, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeatureCard from "@/components/home/FeatureCard";
import EventCard, { EventType } from "@/components/events/EventCard";
import GroupCard, { GroupType } from "@/components/groups/GroupCard";
import JobCard, { JobType } from "@/components/jobs/JobCard";
import { Link } from "react-router-dom";

// Sample data
const featuredEvents: EventType[] = [
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
  }
];

const popularGroups: GroupType[] = [
  {
    id: "1",
    name: "Coding Club",
    description: "Weekly coding sessions, hackathons, and tech talks for programming enthusiasts.",
    members: 87,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1510511233900-1982d92bd835?w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "Environmental Action",
    description: "Students working on campus sustainability initiatives and environmental awareness.",
    members: 62,
    category: "Environment",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "Photography Society",
    description: "Share your photography passion, learn techniques, and participate in photo walks.",
    members: 54,
    category: "Arts",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&auto=format&fit=crop"
  }
];

const recentJobs: JobType[] = [
  {
    id: "1",
    title: "Research Assistant",
    company: "Biology Department",
    description: "Assist faculty with ongoing research projects in the biology lab. Responsibilities include data collection and basic lab work.",
    location: "Science Building",
    type: "Part-time",
    salary: "$15/hour",
    posted: "2 days ago",
    deadline: "May 20, 2023"
  },
  {
    id: "2",
    title: "Campus Tour Guide",
    company: "Admissions Office",
    description: "Lead campus tours for prospective students and their families. Strong communication skills required.",
    location: "Main Campus",
    type: "Part-time",
    salary: "$14/hour",
    posted: "1 week ago",
    deadline: "May 15, 2023"
  }
];

const Index = () => {
  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything You Need in One Place</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              CampusSphere connects you to all aspects of campus life through an integrated platform designed specifically for students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              title="Discover Events" 
              description="Find and join campus events, workshops, and activities based on your interests."
              icon={<Calendar className="h-6 w-6 text-campus-blue" />}
              color="campus-blue"
            />
            <FeatureCard 
              title="Join Groups" 
              description="Connect with clubs, teams, and student organizations that match your passions."
              icon={<Users className="h-6 w-6 text-campus-indigo" />}
              color="campus-indigo"
            />
            <FeatureCard 
              title="Find Opportunities" 
              description="Browse and apply to part-time jobs, internships, and volunteer positions."
              icon={<Briefcase className="h-6 w-6 text-campus-purple" />}
              color="campus-purple"
            />
            <FeatureCard 
              title="Get Academic Help" 
              description="Access AI-powered tutoring for study help and career guidance anytime."
              icon={<Bot className="h-6 w-6 text-campus-pink" />}
              color="campus-pink"
            />
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Events</h2>
            <Link to="/events" className="text-primary hover:text-primary/80 flex items-center">
              View All Events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Groups Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Popular Groups</h2>
            <Link to="/groups" className="text-primary hover:text-primary/80 flex items-center">
              View All Groups <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Jobs Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Job Postings</h2>
            <Link to="/jobs" className="text-primary hover:text-primary/80 flex items-center">
              View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Tutor & Chat Preview Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Connect & Get Help</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Chat with peers or get AI-powered assistance for your academic and career questions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-campus-indigo/10 flex items-center justify-center mb-5">
                <MessageSquare className="h-8 w-8 text-campus-indigo" />
              </div>
              <h3 className="text-xl font-medium mb-3">Peer Chat</h3>
              <p className="text-muted-foreground mb-6">
                Connect with classmates, form study groups, and build your campus network through direct messaging.
              </p>
              <Button asChild>
                <Link to="/chat">Start Chatting</Link>
              </Button>
            </div>
            
            <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-campus-purple/10 flex items-center justify-center mb-5">
                <Bot className="h-8 w-8 text-campus-purple" />
              </div>
              <h3 className="text-xl font-medium mb-3">AI Tutor</h3>
              <p className="text-muted-foreground mb-6">
                Get 24/7 help with coursework, career advice, and campus resources from our AI-powered assistant.
              </p>
              <Button asChild>
                <Link to="/ai-tutor">Ask AI Tutor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
