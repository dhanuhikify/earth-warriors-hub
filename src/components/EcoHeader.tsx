import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Trophy, Users, Target } from "lucide-react";

const EcoHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-nature bg-clip-text text-transparent">
              EcoWarriors
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#challenges" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Challenges
          </a>
          <a href="#leaderboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Leaderboard
          </a>
          <a href="#achievements" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Achievements
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            1,250 Eco Points
          </Badge>
          <Button variant="hero" size="sm">
            Join Challenge
          </Button>
        </div>
      </div>
    </header>
  );
};

export default EcoHeader;