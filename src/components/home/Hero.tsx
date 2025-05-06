
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Briefcase, MessageSquare, Bot } from "lucide-react";

const Hero = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="campus-gradient-text">Connect</span> with Your Campus Community
          </h1>
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
            Discover events, join groups, find jobs, and connect with peers - all in one place.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="text-md">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-md">
              Learn More
            </Button>
          </div>
          
          {/* Feature icons */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 max-w-4xl mx-auto">
            <Link to="/events" className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span className="mt-2 font-medium">Events</span>
            </Link>
            <Link to="/groups" className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <span className="mt-2 font-medium">Groups</span>
            </Link>
            <Link to="/jobs" className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-campus-blue/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-campus-blue" />
              </div>
              <span className="mt-2 font-medium">Jobs</span>
            </Link>
            <Link to="/chat" className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-campus-indigo/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-campus-indigo" />
              </div>
              <span className="mt-2 font-medium">Chat</span>
            </Link>
            <Link to="/ai-tutor" className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-campus-purple/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-campus-purple" />
              </div>
              <span className="mt-2 font-medium">AI Tutor</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
