
import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GroupCard, { GroupType } from "@/components/groups/GroupCard";

// Sample data
const allGroups: GroupType[] = [
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
  },
  {
    id: "4",
    name: "Business & Entrepreneurship",
    description: "Network with like-minded entrepreneurs and develop your business ideas.",
    members: 76,
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop"
  },
  {
    id: "5",
    name: "Ultimate Frisbee Team",
    description: "Competitive and casual ultimate frisbee games. All skill levels welcome!",
    members: 32,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1591491640784-3571cbe0b9a8?w=800&auto=format&fit=crop",
    isJoined: true
  },
  {
    id: "6",
    name: "Writer's Workshop",
    description: "Improve your creative writing skills through peer feedback and structured exercises.",
    members: 29,
    category: "Arts",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop"
  },
  {
    id: "7",
    name: "Psychology Student Association",
    description: "Connect with other psychology students for study groups, research opportunities, and career networking.",
    members: 43,
    category: "Academic",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&auto=format&fit=crop",
    isJoined: true
  },
  {
    id: "8",
    name: "International Student Club",
    description: "Celebrate cultural diversity and help international students connect on campus.",
    members: 65,
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop"
  }
];

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const filteredGroups = allGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || group.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = [...new Set(allGroups.map(group => group.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Groups</h1>
          <p className="mt-2 text-muted-foreground">
            Connect with student organizations that match your interests
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredGroups.length} groups
        </p>
      </div>
      
      {/* Groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No groups found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setCategoryFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Groups;
