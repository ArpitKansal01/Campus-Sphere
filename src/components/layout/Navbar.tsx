
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { cn } from "@/lib/utils";
import { Calendar, Users, Briefcase, MessageSquare, Bot, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUserEmail(null);
    setUserName(null);
  };

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('userEmail');
    const storedUserName = localStorage.getItem('userName');
    
    if (email) {
      setUserEmail(email);
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user initials for avatar
  const getInitials = () => {
    if (userName) {
      const names = userName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      } else if (names.length === 1 && names[0].length > 0) {
        return names[0][0].toUpperCase();
      }
    }
    return userEmail ? userEmail[0].toUpperCase() : 'U';
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-background"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link to="/" className="font-bold text-xl">
          <span className="campus-gradient-text">CampusSphere</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/events">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={location.pathname === "/events"}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Events
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/groups">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={location.pathname === "/groups"}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Groups
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/jobs">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={location.pathname === "/jobs"}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Jobs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/chat">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={location.pathname === "/chat"}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/ai-tutor">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={location.pathname === "/ai-tutor"}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    AI Tutor
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {userEmail ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={userName || userEmail} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link to="/" className="font-bold text-xl mb-4">
                  CampusSphere
                </Link>
                <Link to="/events" className="flex items-center py-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </Link>
                <Link to="/groups" className="flex items-center py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Groups
                </Link>
                <Link to="/jobs" className="flex items-center py-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jobs
                </Link>
                <Link to="/chat" className="flex items-center py-2">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Link>
                <Link to="/ai-tutor" className="flex items-center py-2">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Tutor
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
