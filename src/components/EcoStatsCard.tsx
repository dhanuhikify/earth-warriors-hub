import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Flame } from "lucide-react";

interface EcoStatsCardProps {
  title: string;
  value: string;
  progress: number;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
  badge?: string;
}

const EcoStatsCard = ({ title, value, progress, trend, icon, badge }: EcoStatsCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-nature transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-nature rounded-lg flex items-center justify-center text-white">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{title}</h3>
              <p className="text-2xl font-bold text-primary">{value}</p>
            </div>
          </div>
          {badge && (
            <Badge variant="secondary" className="animate-pulse-glow">
              {badge}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <div className="flex items-center gap-1">
              <TrendingUp className={`h-3 w-3 ${trend === 'up' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="font-medium">{progress}%</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-nature opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    </Card>
  );
};

export default EcoStatsCard;