"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  const pathname = usePathname();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userProfilePicture');
    setUserEmail(null);
    setUserName(null);
    setUserRole(null);
    setUserProfilePic(null);
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

    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role.charAt(0).toUpperCase() + role.slice(1));
    }

    const pfp = localStorage.getItem('userProfilePicture');
    if (pfp) {
      setUserProfilePic(pfp);
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
  }, [pathname]);

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
          <Link href="/" className="font-bold text-xl">
            <span className="campus-gradient-text">CampusSphere</span>
          </Link>

          {/* Desktop Navigation */}
          {userRole !== 'Admin' && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()} active={pathname === "/events"}>
                    <Link href="/events">
                      <Calendar className="w-4 h-4 mr-2" />
                      Events
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()} active={pathname === "/groups"}>
                    <Link href="/groups">
                      <Users className="w-4 h-4 mr-2" />
                      Groups
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()} active={pathname === "/jobs"}>
                    <Link href="/jobs">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Jobs
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()} active={pathname === "/chat"}>
                    <Link href="/chat">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()} active={pathname === "/ai-tutor"}>
                    <Link href="/ai-tutor">
                      <Bot className="w-4 h-4 mr-2" />
                      AI Tutor
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {userEmail ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfilePic || ""} alt={userName || userEmail || "User"} className="object-cover" />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName || 'User'}
                      {userRole && <span className="ml-2 text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{userRole}</span>}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userRole === 'Admin' && (
                  <DropdownMenuItem>
                    <Link href="/dashboard/admin" className="w-full">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {userRole === 'President' && (
                  <DropdownMenuItem>
                    <Link href="/dashboard/president" className="w-full">President Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">Profile</Link>
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
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
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
                <Link href="/" className="font-bold text-xl mb-4">
                  CampusSphere
                </Link>
                {userRole !== 'Admin' && (
                  <>
                    <Link href="/events" className="flex items-center py-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      Events
                    </Link>
                    <Link href="/groups" className="flex items-center py-2">
                      <Users className="w-4 h-4 mr-2" />
                      Groups
                    </Link>
                    <Link href="/jobs" className="flex items-center py-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Jobs
                    </Link>
                    <Link href="/chat" className="flex items-center py-2">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Link>
                    <Link href="/ai-tutor" className="flex items-center py-2">
                      <Bot className="w-4 h-4 mr-2" />
                      AI Tutor
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
