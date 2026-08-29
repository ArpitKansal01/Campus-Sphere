"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, DollarSign, Clock, MapPin, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobCard, { JobType } from "@/components/jobs/JobCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchJobs, QUERY_KEYS } from "@/lib/api";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: QUERY_KEYS.jobs("India", "fresher"),
    queryFn: () => fetchJobs("India", "fresher"),
    staleTime: 5 * 60 * 1000,   // Jobs are fresh for 5 minutes
    gcTime: 15 * 60 * 1000,     // Keep in cache for 15 minutes
  });

  const jobs: JobType[] = (data?.jobs ?? []).map((job: any) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    description: job.description,
    location: job.location,
    type: job.job_type,
    salary: job.salary,
    posted: new Date(job.publication_date).toLocaleDateString(),
    applyUrl: job.url,
  }));

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "recent" && new Date(job.posted).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000) ||
      (activeTab === "highestPaid" && job.salary && job.salary !== "Competitive");
    return matchesSearch && matchesType && matchesTab;
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Live India Fresher Jobs</h1>
          <p className="mt-2 text-muted-foreground">Dynamically aggregated from Naukri, LinkedIn, and Indeed</p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Cached at {lastUpdated} &middot; stays fresh for 5 min
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="mt-4 md:mt-0">
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="recent">Recent Posts</TabsTrigger>
          <TabsTrigger value="highestPaid">With Salary</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search job titles or companies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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
            </SelectContent>
          </Select>
          <Button variant="outline"><DollarSign className="mr-2 h-4 w-4" /> Salary</Button>
          <Button variant="outline"><MapPin className="mr-2 h-4 w-4" /> Location</Button>
          <Button variant="outline"><Clock className="mr-2 h-4 w-4" /> Deadline</Button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        {isLoading ? (
          <p className="text-muted-foreground flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching live jobs...
          </p>
        ) : (
          <p className="text-muted-foreground">Showing {filteredJobs.length} live job listings</p>
        )}
      </div>

      {/* Jobs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-6 h-64 animate-pulse bg-muted/20" />
          ))
          : filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>

      {!isLoading && filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setTypeFilter("all"); setActiveTab("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
