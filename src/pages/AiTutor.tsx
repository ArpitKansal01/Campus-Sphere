
import AiTutor from "@/components/ai/AiTutor";
import { Bot, Bookmark, Brain, FileQuestion, GraduationCap, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const AiTutorPage = () => {
  const suggestedQuestions = [
    {
      category: "Academic Help",
      icon: <Brain className="h-4 w-4" />,
      questions: [
        "Can you explain the difference between mitosis and meiosis?",
        "How do I solve quadratic equations?",
        "What are the key themes in Shakespeare's Macbeth?",
        "Can you help me understand Newton's laws of motion?"
      ]
    },
    {
      category: "Career Advice",
      icon: <GraduationCap className="h-4 w-4" />,
      questions: [
        "How can I make my resume stand out for tech internships?",
        "What skills should I develop for a marketing career?",
        "How do I prepare for a behavioral interview?",
        "Should I include extracurricular activities on my resume?"
      ]
    },
    {
      category: "Campus Resources",
      icon: <Bookmark className="h-4 w-4" />,
      questions: [
        "What mental health resources are available on campus?",
        "How can I access the university's academic journals?",
        "Are there any financial aid workshops this semester?",
        "Where can I find tutoring for calculus?"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main chat area */}
        <div className="flex-1 order-2 md:order-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center">
              <Bot className="mr-2 h-6 w-6 text-primary" />
              AI Campus Tutor
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your 24/7 assistant for academic help, career guidance, and campus resources
            </p>
          </div>
          
          <AiTutor />
        </div>
        
        {/* Sidebar */}
        <div className="w-full md:w-72 order-1 md:order-2">
          <div className="bg-card border rounded-lg overflow-hidden sticky top-20">
            {/* Sidebar header */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Resources</h3>
                <Button variant="ghost" size="sm">
                  <PanelRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Suggested questions */}
            <ScrollArea className="h-[600px] p-4">
              <div className="space-y-6">
                {suggestedQuestions.map((category) => (
                  <div key={category.category}>
                    <h4 className="text-sm font-medium flex items-center mb-3">
                      {category.icon}
                      <span className="ml-2">{category.category}</span>
                    </h4>
                    <div className="space-y-2">
                      {category.questions.map((question) => (
                        <Button
                          key={question}
                          variant="outline"
                          className="w-full justify-start text-sm h-auto py-2 text-left"
                          size="sm"
                        >
                          <FileQuestion className="h-3.5 w-3.5 mr-2 flex-none" />
                          <span className="line-clamp-2">{question}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Additional help */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Need more help?</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-3">
                      For more specialized assistance, don't forget to check these resources:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Academic Advising Center</li>
                      <li>Career Services Office</li>
                      <li>Campus Mental Health Support</li>
                      <li>Learning Resource Center</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTutorPage;
