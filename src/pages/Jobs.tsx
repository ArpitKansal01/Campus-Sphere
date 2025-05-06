
import { useState } from "react";
import { Search, Filter, Plus, DollarSign, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobCard, { JobType } from "@/components/jobs/JobCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data
const allJobs: JobType[] = [
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
  },
  {
    id: "3",
    title: "Library Assistant",
    company: "University Library",
    description: "Help with shelving books, assisting patrons, and maintaining library resources.",
    location: "Main Library",
    type: "Part-time",
    salary: "$13/hour",
    posted: "3 days ago",
    deadline: "May 25, 2023"
  },
  {
    id: "4",
    title: "Social Media Intern",
    company: "Communications Department",
    description: "Create and schedule content for university social media accounts. Photography and design skills preferred.",
    location: "Remote",
    type: "Internship",
    salary: "$16/hour",
    posted: "1 day ago",
    deadline: "May 18, 2023"
  },
  {
    id: "5",
    title: "Math Tutor",
    company: "Learning Center",
    description: "Tutor undergraduate students in various math courses including calculus and statistics.",
    location: "Learning Center",
    type: "Part-time",
    salary: "$17/hour",
    posted: "5 days ago",
    deadline: "May 22, 2023"
  },
  {
    id: "6",
    title: "IT Help Desk Support",
    company: "IT Services",
    description: "Provide technical support to faculty, staff, and students. Knowledge of common software and hardware troubleshooting required.",
    location: "Tech Building",
    type: "Part-time",
    salary: "$16/hour",
    posted: "1 week ago",
    deadline: "May 19, 2023"
  },
  {
    id: "7",
    title: "Student Coordinator",
    company: "Student Life Office",
    description: "Assist in planning and executing campus events. Help manage student organization registrations.",
    location: "Student Center",
    type: "Part-time",
    posted: "4 days ago",
    deadline: "May 30, 2023"
  },
  {
    id: "8",
    title: "Lab Monitor",
    company: "Computer Science Department",
    description: "Monitor computer labs, assist students with basic technical issues, and ensure equipment is functioning properly.",
    location: "CS Building",
    type: "Part-time",
    salary: "$13/hour",
    posted: "2 weeks ago",
    deadline: "May 17, 2023"
  }
];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredJobs = allJobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || job.type === typeFilter;
      const matchesTab = activeTab === "all" || 
                        (activeTab === "recent" && new Date(job.posted).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000) || 
                        (activeTab === "highestPaid" && job.salary && parseFloat(job.salary.replace(/[^\d.]/g, '')) >= 15);
      
      return matchesSearch && matchesType && matchesTab;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campus Jobs</h1>
          <p className="mt-2 text-muted-foreground">
            Find part-time jobs, internships, and volunteer opportunities
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Post Job
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="recent">Recent Posts</TabsTrigger>
          <TabsTrigger value="highestPaid">Highest Paid</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Search and filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Volunteer">Volunteer</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <DollarSign className="mr-2 h-4 w-4" />
            Salary
          </Button>
          
          <Button variant="outline">
            <MapPin className="mr-2 h-4 w-4" />
            Location
          </Button>
          
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Deadline
          </Button>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredJobs.length} job listings
        </p>
      </div>
      
      {/* Jobs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setTypeFilter("all");
            setActiveTab("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
