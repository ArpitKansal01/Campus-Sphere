
import { Briefcase, Building, Clock, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type JobType = {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: "Part-time" | "Full-time" | "Internship" | "Volunteer";
  salary?: string;
  posted: string;
  deadline?: string;
};

type JobCardProps = {
  job: JobType;
};

const JobCard = ({ job }: JobCardProps) => {
  const { title, company, description, location, type, salary, posted, deadline } = job;

  return (
    <div className="campus-card p-6 flex flex-col h-full">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="flex items-center text-muted-foreground mt-1">
            <Building className="h-4 w-4 mr-1" />
            <span className="text-sm">{company}</span>
          </div>
        </div>
        <Badge variant={
          type === "Full-time" ? "default" : 
          type === "Part-time" ? "secondary" :
          type === "Internship" ? "outline" : "destructive"
        }>
          {type}
        </Badge>
      </div>
      
      <div className="mt-4 mb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </div>
      
      <div className="space-y-2 text-sm mb-6">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
          <span>{location}</span>
        </div>
        {salary && (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{salary}</span>
          </div>
        )}
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
          <span>Posted: {posted}</span>
        </div>
        {deadline && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
            <span>Apply by: {deadline}</span>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <Button className="w-full">Apply Now</Button>
      </div>
    </div>
  );
};

export default JobCard;
