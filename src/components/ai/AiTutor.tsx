
import { useState, useEffect } from "react";
import { Send, Bot, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MessageType = {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
};

type TutorCategory = "studies" | "career" | "resources";

type AiTutorProps = {
  selectedQuestion?: string | null;
  onQuestionUsed?: () => void;
};

const AiTutor = ({ selectedQuestion, onQuestionUsed }: AiTutorProps = {}) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TutorCategory>("studies");
  
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Campus Tutor. How can I help you today? I can answer questions about your studies, provide career advice, or point you to useful resources.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  // Effect to handle selected questions from the sidebar
  useEffect(() => {
    if (selectedQuestion) {
      setMessage(selectedQuestion);
      onQuestionUsed?.();
    }
  }, [selectedQuestion, onQuestionUsed]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TutorCategory);
    
    // Add a message based on the selected tab
    const newBotMessage: MessageType = {
      id: Date.now().toString(),
      content: 
        value === "studies" 
          ? "I can help with your coursework, explain difficult concepts, or help you prepare for exams. What subject are you working on?"
          : value === "career"
          ? "I can help with resume reviews, interview preparation, or career path guidance. What career questions do you have?"
          : "I can point you to academic resources, mental health support, or campus services. What resources are you looking for?",
      isBot: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newBotMessage]);
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    // User message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: message,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Make API call to get response
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          category: activeTab,
          history: messages.map(msg => ({
            role: msg.isBot ? 'assistant' : 'user',
            content: msg.content
          }))
        })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      const botResponse: MessageType = {
        id: Date.now().toString(),
        content: data.response || "I'm sorry, I couldn't process your request at this time.",
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // More specific error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unknown error occurred";
      
      const errorResponse: MessageType = {
        id: Date.now().toString(),
        content: `I'm sorry, I encountered an error: ${errorMessage}`,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-card">
      {/* Tutor header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 bg-primary/10">
            <AvatarImage src="https://via.placeholder.com/150" alt="AI Tutor" />
            <AvatarFallback><Bot className="text-primary" /></AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium">Campus AI Tutor</p>
            <p className="text-xs text-muted-foreground">Your 24/7 academic and career assistant</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="studies">Studies</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
            >
              {msg.isBot && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.isBot
                    ? "bg-muted rounded-tl-none"
                    : "bg-primary text-primary-foreground rounded-tr-none"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!msg.isBot && (
                <Avatar className="h-8 w-8 ml-2 mt-1">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted px-4 py-3 rounded-lg rounded-tl-none max-w-[80%] flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
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
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask about ${
              activeTab === "studies" 
                ? "homework, concepts, or exam prep..." 
                : activeTab === "career" 
                ? "resumes, interviews, or career paths..." 
                : "campus resources, support services..."
            }`}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AiTutor;
