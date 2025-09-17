import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Volume2, RotateCcw, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoPlayerProps {
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  category: string;
  ecoPoints: number;
  onComplete?: () => void;
}

const VideoPlayer = ({ 
  title, 
  description, 
  videoUrl, 
  duration, 
  category, 
  ecoPoints,
  onComplete 
}: VideoPlayerProps) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative bg-black aspect-video">
                <iframe
                  src={videoUrl}
                  title={title}
                  className="w-full h-full"
                  allowFullScreen
                  onLoad={() => setIsPlaying(true)}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handlePlayPause}
                      className="bg-black/50 hover:bg-black/70"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm">{duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mb-2">
                    {category}
                  </Badge>
                  {isCompleted && (
                    <Badge className="bg-achievement-gold text-white">
                      Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{description}</p>
                
                {isCompleted && (
                  <div className="bg-achievement-gold/10 border border-achievement-gold/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-achievement-gold">
                      <Award className="h-5 w-5" />
                      <span className="font-medium">Course Completed!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      You've earned {ecoPoints} Eco Points for completing this course.
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button 
                    variant="default" 
                    onClick={handleVideoEnd}
                    disabled={isCompleted}
                  >
                    {isCompleted ? "Completed" : "Mark as Complete"}
                  </Button>
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Replay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Eco Points</span>
                  <span className="font-medium text-achievement-gold">{ecoPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="outline">{category}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium text-sm">Climate Change Basics</h4>
                  <p className="text-xs text-muted-foreground">15 min • 100 points</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium text-sm">Renewable Energy</h4>
                  <p className="text-xs text-muted-foreground">20 min • 150 points</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium text-sm">Ocean Conservation</h4>
                  <p className="text-xs text-muted-foreground">18 min • 120 points</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;