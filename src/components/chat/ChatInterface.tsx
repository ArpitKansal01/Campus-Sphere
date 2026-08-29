import { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Socket } from "socket.io-client";

interface ChatInterfaceProps {
  chat: any;
  currentUser: any;
  socket: Socket | null;
  chatName: string;
}

const ChatInterface = ({ chat, currentUser, socket, chatName }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages when chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/chat/${chat._id}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chat._id]);

  // Socket listener
  useEffect(() => {
    if (!socket) return;
    
    // Join the current chat room
    socket.emit("join-chat", chat._id);

    const messageHandler = (newMessage: any) => {
      if (chat._id === newMessage.chat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receive-message", messageHandler);

    return () => {
      socket.off("receive-message", messageHandler);
    };
  }, [socket, chat._id]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const content = message;
    setMessage(""); // Optimistically clear input
    
    try {
      const res = await fetch(`/api/chat/${chat._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content }),
      });
      
      if (res.ok) {
        const newMessage = await res.json();
        // Emit via socket
        socket?.emit("send-message", { chatId: chat._id, ...newMessage });
        // The sender also receives their own message back from the broadcast, but we can also append it optimistically
        // To avoid duplicates, we rely on the socket emitting to the room (which includes the sender), 
        // OR we just append it and ensure we don't duplicate on socket receive by checking IDs.
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-card">
      {/* Chat header */}
      <div className="p-4 border-b bg-muted/30 flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="font-medium">{chatName}</p>
          <p className="text-xs text-muted-foreground">
            {chat.isGroupChat ? `${chat.users.length} members` : "Direct Message"}
          </p>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.sender._id === currentUser?._id;
              
              // Prevent rendering duplicate messages (simple unique key check)
              if (idx > 0 && messages[idx - 1]._id === msg._id) return null;

              return (
                <div
                  key={msg._id || idx}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    }`}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-medium mb-1 opacity-80">{`${msg.sender.firstName} ${msg.sender.lastName}`}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        )}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="text-muted-foreground">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-auto p-0 border-none bg-transparent">
              <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" />
            </PopoverContent>
          </Popover>
          
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-muted-foreground hidden sm:inline-flex"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
