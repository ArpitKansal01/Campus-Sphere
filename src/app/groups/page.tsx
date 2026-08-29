"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, Users, MessageSquare, Loader2, LogIn, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CATEGORIES = ["General", "Technology", "Arts", "Sports", "Academic", "Cultural", "Business", "Environment", "Other"];

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-blue-500/10 text-blue-500",
  Arts: "bg-purple-500/10 text-purple-500",
  Sports: "bg-green-500/10 text-green-500",
  Academic: "bg-yellow-500/10 text-yellow-600",
  Cultural: "bg-orange-500/10 text-orange-500",
  Business: "bg-cyan-500/10 text-cyan-600",
  Environment: "bg-emerald-500/10 text-emerald-600",
  General: "bg-slate-500/10 text-slate-500",
  Other: "bg-pink-500/10 text-pink-500",
};

const CATEGORY_IMAGES: Record<string, string> = {
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&fit=crop",
  Arts: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&fit=crop",
  Sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&fit=crop",
  Academic: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&fit=crop",
  Cultural: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&fit=crop",
  Business: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&fit=crop",
  Environment: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&fit=crop",
  General: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&fit=crop",
  Other: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&fit=crop",
};

export default function Groups() {
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [userRole, setUserRole] = useState("student");
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Create group form state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({ chatName: "", description: "", category: "General" });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/groups", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setGroups(await res.json());
      } else if (res.status === 401) {
        router.push("/signin");
      }
    } catch (err) {
      toast.error("Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (groupId: string, isJoined: boolean) => {
    setJoiningId(groupId);
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: isJoined ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        toast.success(isJoined ? "Left group" : "Joined! Check your Chat page.");
        setGroups(prev =>
          prev.map(g =>
            g._id === groupId
              ? { ...g, isJoined: !isJoined, memberCount: isJoined ? g.memberCount - 1 : g.memberCount + 1 }
              : g
          )
        );
      } else {
        toast.error("Action failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setJoiningId(null);
    }
  };

  const handleCreate = async () => {
    if (!newGroup.chatName.trim()) return toast.error("Group name is required");
    setIsCreating(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newGroup),
      });
      if (res.ok) {
        toast.success("Group created successfully!");
        setIsCreateOpen(false);
        setNewGroup({ chatName: "", description: "", category: "General" });
        fetchGroups();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create group");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch =
      group.chatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || group.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const existingCategories = [...new Set(groups.map(g => g.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Groups</h1>
          <p className="mt-2 text-muted-foreground">
            Connect with student organizations — join a group to chat in real time
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          {(userRole === "president" || userRole === "admin") && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label>Group Name *</Label>
                    <Input
                      placeholder="e.g. Coding Club"
                      value={newGroup.chatName}
                      onChange={e => setNewGroup(p => ({ ...p, chatName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="What is this group about?"
                      value={newGroup.description}
                      onChange={e => setNewGroup(p => ({ ...p, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Category</Label>
                    <Select value={newGroup.category} onValueChange={v => setNewGroup(p => ({ ...p, category: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleCreate} disabled={isCreating}>
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {existingCategories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">Showing {filteredGroups.length} groups</p>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Groups grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => {
              const colorClass = CATEGORY_COLORS[group.category] || CATEGORY_COLORS.Other;
              const imgSrc = group.image || CATEGORY_IMAGES[group.category] || CATEGORY_IMAGES.Other;
              return (
                <div key={group._id} className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={group.chatName}
                      className="w-full h-full object-cover"
                    />
                    {group.isJoined && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                        ✓ Joined
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-base leading-tight">{group.chatName}</h3>
                      <Badge variant="secondary" className={`text-xs shrink-0 ${colorClass}`}>
                        {group.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                      {group.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{group.memberCount} member{group.memberCount !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex gap-2">
                        {group.isJoined && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push("/chat")}
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Chat
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={group.isJoined ? "ghost" : "default"}
                          disabled={joiningId === group._id}
                          onClick={() => handleJoin(group._id, group.isJoined)}
                        >
                          {joiningId === group._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : group.isJoined ? (
                            <><LogOut className="h-3.5 w-3.5 mr-1" /> Leave</>
                          ) : (
                            <><LogIn className="h-3.5 w-3.5 mr-1" /> Join</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredGroups.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No groups found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : userRole === "president" || userRole === "admin"
                  ? "Create the first group to get students chatting!"
                  : "No groups have been created yet. Check back soon!"}
              </p>
              {(searchQuery || categoryFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
