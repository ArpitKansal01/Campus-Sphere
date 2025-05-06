
import { useState } from "react";
import { Send, Smile, Paperclip, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export type MessageType = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isCurrentUser: boolean;
};

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  
  // Sample messages
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      content: "Hey there! Welcome to CampusSphere Chat! 👋",
      sender: {
        id: "system",
        name: "CampusSphere",
        avatar: "https://via.placeholder.com/150",
      },
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false,
    },
    {
      id: "2",
      content: "Thanks! Happy to be here. Is this where I can connect with other students?",
      sender: {
        id: "user",
        name: "You",
      },
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: true,
    },
    {
      id: "3",
      content: "Yes! You can chat with classmates, join group discussions, and connect with peers across campus.",
      sender: {
        id: "system",
        name: "CampusSphere",
        avatar: "https://via.placeholder.com/150",
      },
      timestamp: new Date(Date.now() - 900000),
      isCurrentUser: false,
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: MessageType = {
      id: Date.now().toString(),
      content: message,
      sender: {
        id: "user",
        name: "You",
      },
      timestamp: new Date(),
      isCurrentUser: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulate response
    setTimeout(() => {
      const responseMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! This is a demo chat interface.",
        sender: {
          id: "system",
          name: "CampusSphere",
          avatar: "https://via.placeholder.com/150",
        },
        timestamp: new Date(),
        isCurrentUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-card">
      {/* Chat header */}
      <div className="p-4 border-b bg-muted/30 flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://via.placeholder.com/150" alt="Chat" />
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="font-medium">Campus Chat</p>
          <p className="text-xs text-muted-foreground">Connect with your peers</p>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.isCurrentUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted rounded-bl-none"
                }`}
              >
                {!msg.isCurrentUser && (
                  <p className="text-xs font-medium mb-1">{msg.sender.name}</p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Chat input */}
      <div className="p-4 border-t bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-muted-foreground"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-muted-foreground"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
