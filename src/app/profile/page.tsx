"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Calendar, Users, Briefcase, Mail, User as UserIcon, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    profilePicture: "",
    phone: "",
    rollNo: "",
    course: "",
    section: "",
    registeredEvents: [] as any[],
  });

  useEffect(() => {
    setIsClient(true);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      const res = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to load profile");
      
      const data = await res.json();
      setUser({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        role: data.role || "",
        profilePicture: data.profilePicture || "",
        phone: data.phone || "",
        rollNo: data.rollNo || "",
        course: data.course || "",
        section: data.section || "",
        registeredEvents: data.registeredEvents || [],
      });
      
      // Update local storage just in case it got out of sync
      localStorage.setItem("userName", `${data.firstName} ${data.lastName}`);
      localStorage.setItem("userEmail", data.email);
      if (data.profilePicture) {
        localStorage.setItem("userProfilePicture", data.profilePicture);
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not load profile data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          phone: user.phone,
          rollNo: user.rollNo,
          course: user.course,
          section: user.section,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      
      toast({ title: "Success", description: "Profile updated successfully." });
      
      // Update local storage to instantly reflect in Navbar
      localStorage.setItem("userName", `${user.firstName} ${user.lastName}`);
      localStorage.setItem("userEmail", user.email);
      if (user.profilePicture) {
        localStorage.setItem("userProfilePicture", user.profilePicture);
      }
      
      // Force a soft refresh to update Navbar state
      window.dispatchEvent(new Event("storage")); 
      router.refresh();
      
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "Error", description: "Image size must be less than 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : 'U';
  };

  if (!isClient) return null;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      {/* Hero Banner - Professional Slate */}
      <div className="h-48 md:h-56 w-full bg-slate-900 dark:bg-black border-b relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card className="shadow-md border-border overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg rounded-full overflow-hidden">
                    <AvatarImage src={user.profilePicture} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute bottom-0 right-0 rounded-full h-9 w-9 shadow-sm bg-background border-border hover:bg-accent"
                    onClick={triggerFileInput}
                  >
                    <Camera className="h-4 w-4 text-foreground" />
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </div>
                
                <h2 className="text-2xl font-semibold tracking-tight">{user.firstName} {user.lastName}</h2>
                <p className="text-muted-foreground text-sm flex items-center justify-center gap-2 mt-1">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </p>
                
                <div className="mt-5">
                  <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
                    {user.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-secondary-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Member Since</p>
                    <p className="text-muted-foreground">August 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-secondary-foreground">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Profile Status</p>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Content Tabs */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-background border shadow-sm h-11">
                <TabsTrigger value="overview" className="text-sm font-medium">Activity Overview</TabsTrigger>
                <TabsTrigger value="settings" className="text-sm font-medium">Profile Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Events Attended</p>
                          <h3 className="text-3xl font-bold mt-2">{user.registeredEvents.length}</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-md">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
                          <h3 className="text-3xl font-bold mt-2">4</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-md">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Registered Events</CardTitle>
                    <CardDescription>Events you have RSVP'd to on CampusSphere.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.registeredEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">You have not registered for any events yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {user.registeredEvents.map((event) => (
                          <div key={event._id} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                            <div className="h-12 w-16 rounded overflow-hidden flex items-center justify-center shrink-0 bg-muted">
                              {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                              ) : (
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{event.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" /> {new Date(event.startDate).toLocaleDateString()} 
                                <span className="mx-1">•</span>
                                {event.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>Update your personal details and public profile picture.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdate}>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={user.firstName}
                            onChange={(e) => setUser({...user, firstName: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={user.lastName}
                            onChange={(e) => setUser({...user, lastName: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            type="tel"
                            value={user.phone}
                            onChange={(e) => setUser({...user, phone: e.target.value})}
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                      
                      {user.role === 'student' && (
                        <>
                          <div className="pt-4 pb-2 border-t mt-4">
                            <h4 className="text-sm font-medium">Academic Details</h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="rollNo">Roll Number</Label>
                              <Input 
                                id="rollNo" 
                                value={user.rollNo}
                                onChange={(e) => setUser({...user, rollNo: e.target.value})}
                                placeholder="e.g. 2026CS101"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="course">Course</Label>
                              <Input 
                                id="course" 
                                value={user.course}
                                onChange={(e) => setUser({...user, course: e.target.value})}
                                placeholder="e.g. B.Tech Computer Science"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="section">Section</Label>
                              <Input 
                                id="section" 
                                value={user.section}
                                onChange={(e) => setUser({...user, section: e.target.value})}
                                placeholder="e.g. A"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="space-y-2 pt-4 border-t mt-4">
                        <Label>Account Role</Label>
                        <Input value={user.role} disabled className="bg-muted capitalize text-muted-foreground" />
                        <p className="text-xs text-muted-foreground mt-1">Your role cannot be changed manually. Contact an administrator for assistance.</p>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-4 mt-6 border-t px-6 flex justify-end">
                      <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
