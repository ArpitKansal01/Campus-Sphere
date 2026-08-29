"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users, BarChart3, PlusCircle } from "lucide-react";
import EventForm from "@/components/events/EventForm";
import Link from "next/link";

export default function PresidentDashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem("userRole");
    if (role !== "president" && role !== "admin") {
      router.push("/");
    }
  }, [router]);

  if (!isClient) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">President Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your events, groups, and view analytics.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events Hosted</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Group Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+18 new members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Event Engagement</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+5% engagement rate</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-6">Quick Actions</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Manage Events
            </CardTitle>
            <CardDescription>Create a new event or manage existing ones.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <EventForm />
              <Button variant="outline" asChild>
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Manage Groups
            </CardTitle>
            <CardDescription>Create a new student group or manage memberships.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Group
              </Button>
              <Button variant="outline" asChild>
                <Link href="/groups">View All Groups</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
