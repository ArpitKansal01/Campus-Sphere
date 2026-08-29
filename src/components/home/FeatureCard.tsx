
import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
};

const FeatureCard = ({ title, description, icon, color }: FeatureCardProps) => {
  return (
    <div className="campus-card p-6 flex flex-col">
      <div className={`h-12 w-12 rounded-full bg-${color}/10 flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
