
import ChatInterface from "@/components/chat/ChatInterface";
import { ChevronRight, MessageSquare, Plus, Search, User, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample data for chat list
const chatList = [
  {
    id: "1",
    name: "Campus Chat",
    avatar: "https://via.placeholder.com/150",
    lastMessage: "Welcome to CampusSphere Chat!",
    time: "Just now",
    unread: 2,
    isActive: true,
    type: "group"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://via.placeholder.com/150",
    lastMessage: "Are you going to the study group tonight?",
    time: "10m ago",
    unread: 0,
    isActive: true,
    type: "direct"
  },
  {
    id: "3",
    name: "Michael Chen",
    avatar: "https://via.placeholder.com/150",
    lastMessage: "Thanks for the notes!",
    time: "2h ago",
    unread: 0,
    isActive: false,
    type: "direct"
  },
  {
    id: "4",
    name: "CS 101 Group",
    avatar: "https://via.placeholder.com/150",
    lastMessage: "Professor canceled tomorrow's class",
    time: "Yesterday",
    unread: 5,
    isActive: false,
    type: "group"
  },
  {
    id: "5",
    name: "Roommate Chat",
    avatar: "https://via.placeholder.com/150",
    lastMessage: "I'll pick up groceries on my way back",
    time: "Yesterday",
    unread: 0,
    isActive: true,
    type: "group"
  },
];

const Chat = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-80 flex-none">
          <div className="bg-card border rounded-lg overflow-hidden">
            {/* Sidebar header */}
            <div className="p-4 border-b bg-muted/30">
              <h2 className="text-lg font-medium mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search messages..." className="pl-10" />
              </div>
            </div>
            
            {/* Chat filters */}
            <div className="flex p-2 border-b">
              <Button variant="ghost" className="flex-1 rounded-md" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                All
              </Button>
              <Button variant="ghost" className="flex-1 rounded-md" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Groups
              </Button>
              <Button variant="ghost" className="flex-1 rounded-md" size="sm">
                <User className="h-4 w-4 mr-2" />
                Direct
              </Button>
            </div>
            
            {/* Chat list */}
            <ScrollArea className="h-[500px]">
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 flex items-center hover:bg-muted/50 cursor-pointer ${
                    chat.id === "1" ? "bg-primary/10" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 flex-none">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>
                      {chat.type === "group" ? <Users className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm truncate">{chat.name}</p>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="ml-2 bg-primary text-primary-foreground rounded-full h-5 min-w-[20px] flex items-center justify-center text-xs">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="p-4 mt-2 flex justify-center">
                <Button variant="outline" className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Chat interface */}
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chat;
