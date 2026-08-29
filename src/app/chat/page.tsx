"use client";

import { useState, useEffect, useRef } from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import { MessageSquare, Plus, Search, User, Users, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function Chat() {
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Dialog states
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Group Dialog
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        } else {
          router.push("/signin");
        }
      } catch (err) {
        console.error(err);
        router.push("/signin");
      }
    };
    fetchUser();
  }, []);

  // Initialize Socket
  useEffect(() => {
    if (!currentUser) return;
    
    // Connect to the same origin (handled by custom server.js)
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit("register", currentUser._id);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  // Fetch Chats
  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chat", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser]);

  // Search Users
  useEffect(() => {
    const searchUsers = async () => {
      if (!userSearchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`/api/users/search?search=${userSearchQuery}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearchQuery]);

  // Start 1-on-1 Chat
  const startChat = async (userId: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId, isGroupChat: false }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!chats.find(c => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        setIsNewChatOpen(false);
        setUserSearchQuery("");
      }
    } catch (err) {
      toast.error("Failed to start chat");
    }
  };

  // Create Group
  const createGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      toast.error("Please provide a name and at least 2 members");
      return;
    }
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          chatName: groupName,
          users: selectedUsers.map(u => u._id),
          isGroupChat: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChats([data, ...chats]);
        setSelectedChat(data);
        setIsGroupOpen(false);
        setGroupName("");
        setSelectedUsers([]);
        toast.success("Group created!");
      }
    } catch (err) {
      toast.error("Failed to create group");
    }
  };

  const getChatName = (chat: any) => {
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users.find((u: any) => u._id !== currentUser?._id);
    return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown User";
  };

  const getChatImage = (chat: any) => {
    if (chat.isGroupChat) return null; // Can use a group avatar later
    const otherUser = chat.users.find((u: any) => u._id !== currentUser?._id);
    return otherUser?.profilePicture;
  };

  const filteredChats = chats.filter((chat) => {
    const name = getChatName(chat).toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || (activeTab === "groups" && chat.isGroupChat) || (activeTab === "direct" && !chat.isGroupChat);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 flex-none">
          <div className="bg-card border rounded-lg overflow-hidden flex flex-col h-[600px]">
            {/* Sidebar header */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Messages</h2>
                <div className="flex gap-2">
                  {/* Create Group Dialog */}
                  <Dialog open={isGroupOpen} onOpenChange={setIsGroupOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="New Group">
                        <Users className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Group Chat</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input 
                          placeholder="Group Name" 
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                        />
                        <Input 
                          placeholder="Search users to add..." 
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                        
                        {/* Selected Users Pills */}
                        <div className="flex flex-wrap gap-2">
                          {selectedUsers.map(u => (
                            <div key={u._id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                              {`${u.firstName} ${u.lastName}`}
                              <button className="ml-2 text-primary/70 hover:text-primary" onClick={() => setSelectedUsers(selectedUsers.filter(su => su._id !== u._id))}>&times;</button>
                            </div>
                          ))}
                        </div>

                        {/* Search Results */}
                        <ScrollArea className="h-40 border rounded-md p-2">
                          {searchResults.map(user => (
                            <div 
                              key={user._id}
                              className="p-2 flex items-center hover:bg-muted cursor-pointer rounded-md"
                              onClick={() => {
                                if(!selectedUsers.find(u => u._id === user._id)) {
                                  setSelectedUsers([...selectedUsers, user]);
                                }
                              }}
                            >
                              <Avatar className="h-8 w-8 mr-2"><AvatarFallback><User className="h-4 w-4"/></AvatarFallback></Avatar>
                              <span className="text-sm">{`${user.firstName} ${user.lastName}`}</span>
                            </div>
                          ))}
                        </ScrollArea>
                        
                        <Button className="w-full" onClick={createGroup}>Create Group</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* New Chat Dialog */}
                  <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="New Direct Message">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Start a New Chat</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input 
                          placeholder="Search users by name or email..." 
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                        {isSearching && <Loader2 className="h-4 w-4 animate-spin mx-auto my-4" />}
                        <ScrollArea className="h-64">
                          {searchResults.map(user => (
                            <div 
                              key={user._id}
                              className="p-3 flex items-center hover:bg-muted cursor-pointer rounded-md mb-2 border"
                              onClick={() => startChat(user._id)}
                            >
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={user.profilePicture} />
                                <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          ))}
                          {!isSearching && searchResults.length === 0 && userSearchQuery && (
                            <p className="text-center text-sm text-muted-foreground mt-4">No users found.</p>
                          )}
                        </ScrollArea>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search messages..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Chat filters */}
            <div className="flex p-2 border-b">
              <Button variant="ghost" className={`flex-1 rounded-md ${activeTab === 'all' ? 'bg-muted' : ''}`} size="sm" onClick={() => setActiveTab('all')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                All
              </Button>
              <Button variant="ghost" className={`flex-1 rounded-md ${activeTab === 'groups' ? 'bg-muted' : ''}`} size="sm" onClick={() => setActiveTab('groups')}>
                <Users className="h-4 w-4 mr-2" />
                Groups
              </Button>
              <Button variant="ghost" className={`flex-1 rounded-md ${activeTab === 'direct' ? 'bg-muted' : ''}`} size="sm" onClick={() => setActiveTab('direct')}>
                <User className="h-4 w-4 mr-2" />
                Direct
              </Button>
            </div>
            
            {/* Chat list */}
            <ScrollArea className="flex-1">
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-3 flex items-center hover:bg-muted/50 cursor-pointer border-b ${
                      selectedChat?._id === chat._id ? "bg-primary/10" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10 flex-none">
                      <AvatarImage src={getChatImage(chat)} />
                      <AvatarFallback>
                        {chat.isGroupChat ? <Users className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm truncate">{getChatName(chat)}</p>
                        <span className="text-xs text-muted-foreground">
                          {chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.latestMessage ? chat.latestMessage.content : "Start a conversation!"}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {filteredChats.length === 0 && !isLoading && (
                <div className="p-8 text-center text-muted-foreground text-sm">No chats found.</div>
              )}
            </ScrollArea>
          </div>
        </div>
        
        {/* Chat interface */}
        <div className="flex-1">
          {selectedChat ? (
            <ChatInterface 
              chat={selectedChat} 
              currentUser={currentUser} 
              socket={socket} 
              chatName={getChatName(selectedChat)} 
            />
          ) : (
            <div className="h-[600px] border rounded-lg flex items-center justify-center bg-card text-muted-foreground">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
