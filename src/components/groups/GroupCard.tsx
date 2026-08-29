
import { Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type GroupType = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  image: string;
  isJoined?: boolean;
};

type GroupCardProps = {
  group: GroupType;
};

const GroupCard = ({ group }: GroupCardProps) => {
  const { name, description, members, category, image, isJoined } = group;

  return (
    <div className="campus-card overflow-hidden flex flex-col h-full">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-0 left-0 m-3">
          <Badge variant="secondary" className="bg-background/70 backdrop-blur-sm text-foreground">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{members} members</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>Active Chat</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        <Button variant={isJoined ? "outline" : "default"} className="w-full">
          {isJoined ? "View Group" : "Join Group"}
        </Button>
      </div>
    </div>
  );
};

export default GroupCard;
