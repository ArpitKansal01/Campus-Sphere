
import { useState } from "react";
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

const AiTutor = () => {
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

  const sendMessage = () => {
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
    
    // Simulate AI response
    setTimeout(() => {
      let responseContent = "";
      
      if (activeTab === "studies") {
        responseContent = "That's a great question about your studies! In a real implementation, I would connect to an AI service like OpenAI to provide a detailed answer about the academic topic you're asking about.";
      } else if (activeTab === "career") {
        responseContent = "Thanks for your career question! In a real implementation, I would provide personalized career advice, resume feedback, or interview tips based on your specific situation.";
      } else {
        responseContent = "I'd be happy to help you find resources! In a real implementation, I would connect you with relevant campus resources, study materials, or support services based on your needs.";
      }
      
      const botResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
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
