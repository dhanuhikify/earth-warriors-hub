import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Award, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ChallengeCardProps {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  ecoPoints: number;
  participants: number;
  timeLeft: string;
  progress: number;
  category: string;
  image?: string;
}

const ChallengeCard = ({ 
  title, 
  description, 
  difficulty, 
  ecoPoints, 
  participants, 
  timeLeft, 
  progress, 
  category,
  image 
}: ChallengeCardProps) => {
  const navigate = useNavigate();
  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800", 
    advanced: "bg-red-100 text-red-800"
  };

  const handleChallengeClick = () => {
    // Map challenge titles to course IDs
    const courseMapping: { [key: string]: string } = {
      "Plant 50 Trees Challenge": "tree-planting",
      "Waste Segregation Master": "waste-sorting",
      "Water Conservation Hero": "water-conservation"
    };

    const courseId = courseMapping[title];
    if (courseId) {
      navigate(`/course/${courseId}`);
    } else {
      toast.info("Challenge video coming soon!", {
        description: "This challenge will have an educational video component soon."
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-nature transition-all duration-300 group cursor-pointer">
      {image && (
        <div className="h-48 bg-gradient-subtle overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>
          <Badge className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-achievement-gold" />
              <span className="font-medium">{ecoPoints} Eco Points</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{participants} joined</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeLeft} left</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Button 
          variant={progress > 0 ? "default" : "hero"} 
          className="w-full"
          onClick={handleChallengeClick}
        >
          {progress > 0 ? "Continue Challenge" : "Join Challenge"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;