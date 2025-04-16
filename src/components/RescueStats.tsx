
import React from "react";
import { Users, Home, Truck, HeartPulse } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor }) => (
  <div className={`stat-card ${bgColor}`}>
    <div className="text-3xl font-bold">{value}</div>
    <div className="flex items-center text-sm mt-1">
      <span className="mr-1">{icon}</span>
      <span>{title}</span>
    </div>
  </div>
);

const RescueStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        title="People Rescued"
        value="2,843"
        icon={<Users className="w-3 h-3" />}
        bgColor="bg-success text-success-foreground"
      />
      <StatCard
        title="Shelters Active"
        value="38"
        icon={<Home className="w-3 h-3" />}
        bgColor="bg-info text-info-foreground"
      />
      <StatCard
        title="Relief Supplies"
        value="12.5T"
        icon={<Truck className="w-3 h-3" />}
        bgColor="bg-alert text-alert-foreground"
      />
      <StatCard
        title="Medical Camps"
        value="14"
        icon={<HeartPulse className="w-3 h-3" />}
        bgColor="bg-emergency text-emergency-foreground"
      />
    </div>
  );
};

export default RescueStats;
