import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Crown, Medal, Award } from "lucide-react";

interface LeaderEntry {
  rank: number;
  name: string;
  school: string;
  ecoPoints: number;
  avatar?: string;
  achievements: number;
}

interface LeaderboardCardProps {
  title: string;
  entries: LeaderEntry[];
  type: "global" | "school" | "class";
}

const LeaderboardCard = ({ title, entries, type }: LeaderboardCardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-achievement-gold" />;
      case 2:
        return <Medal className="h-5 w-5 text-achievement-silver" />;
      case 3:
        return <Award className="h-5 w-5 text-achievement-bronze" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-achievement-gold text-white",
        2: "bg-achievement-silver text-white", 
        3: "bg-achievement-bronze text-white"
      };
      return colors[rank as keyof typeof colors];
    }
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-subtle">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <Badge variant="secondary">
            {type === "global" ? "🌍 Global" : type === "school" ? "🏫 School" : "📚 Class"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-0">
          {entries.map((entry, index) => (
            <div 
              key={index}
              className={`flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors ${
                entry.rank <= 3 ? 'bg-gradient-to-r from-secondary/30 to-transparent' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.avatar} />
                  <AvatarFallback className="bg-gradient-nature text-white">
                    {entry.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-card-foreground truncate">
                      {entry.name}
                    </p>
                    {entry.rank <= 3 && (
                      <Badge className={getRankBadge(entry.rank)} variant="secondary">
                        #{entry.rank}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {entry.school}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="font-bold text-primary">
                  {entry.ecoPoints.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {entry.achievements} achievements
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;