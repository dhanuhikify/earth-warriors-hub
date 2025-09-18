import EcoStatsCard from "@/components/EcoStatsCard";
import ChallengeCard from "@/components/ChallengeCard";
import LeaderboardCard from "@/components/LeaderboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TreePine, 
  Recycle, 
  Droplets, 
  Users, 
  TrendingUp,
  Award,
  Calendar,
  BookOpen,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import treePlantingImage from "@/assets/challenge-tree-planting.jpg";
import wasteSortingImage from "@/assets/challenge-waste-sorting.jpg";
import waterConservationImage from "@/assets/challenge-water-conservation.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  const challenges = [
    {
      title: "Plant 50 Trees Challenge",
      description: "Join your school in our ambitious tree planting initiative. Each tree planted contributes to carbon offset and biodiversity.",
      difficulty: "intermediate" as const,
      ecoPoints: 500,
      participants: 234,
      timeLeft: "12 days",
      progress: 65,
      category: "Forestry",
      image: treePlantingImage
    },
    {
      title: "Waste Segregation Master",
      description: "Learn and implement proper waste segregation in your school and community. Track your daily segregation efforts.",
      difficulty: "beginner" as const,
      ecoPoints: 200,
      participants: 456,
      timeLeft: "5 days",
      progress: 80,
      category: "Waste Management",
      image: wasteSortingImage
    },
    {
      title: "Water Conservation Hero",
      description: "Implement water-saving techniques and track your water usage reduction over the month.",
      difficulty: "advanced" as const,
      ecoPoints: 750,
      participants: 189,
      timeLeft: "18 days",
      progress: 25,
      category: "Conservation",
      image: waterConservationImage
    }
  ];

  const leaderboardEntries = [
    { rank: 1, name: "Priya Sharma", school: "Delhi Public School", ecoPoints: 2450, achievements: 15 },
    { rank: 2, name: "Arjun Patel", school: "Kendriya Vidyalaya", ecoPoints: 2380, achievements: 12 },
    { rank: 3, name: "Sneha Kumar", school: "Ryan International", ecoPoints: 2250, achievements: 14 },
    { rank: 4, name: "Vikash Singh", school: "DAV Public School", ecoPoints: 2100, achievements: 10 },
    { rank: 5, name: "Maya Gupta", school: "St. Xavier's School", ecoPoints: 1950, achievements: 11 }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Back Button and Logout */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, <span className="text-primary">Eco Warrior!</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Continue your environmental journey and make a positive impact on our planet. 
            Every action counts towards a sustainable future.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EcoStatsCard
            title="Eco Points"
            value="1,250"
            progress={78}
            trend="up"
            icon={<Target className="h-6 w-6" />}
            badge="Level 5"
          />
          <EcoStatsCard
            title="Trees Planted"
            value="23"
            progress={46}
            trend="up"
            icon={<TreePine className="h-6 w-6" />}
          />
          <EcoStatsCard
            title="Waste Recycled"
            value="45kg"
            progress={90}
            trend="up"
            icon={<Recycle className="h-6 w-6" />}
            badge="Goal Reached!"
          />
          <EcoStatsCard
            title="Water Saved"
            value="1,200L"
            progress={60}
            trend="up"
            icon={<Droplets className="h-6 w-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Challenges */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Active Challenges</h2>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="space-y-6">
              {challenges.map((challenge, index) => (
                <ChallengeCard key={index} {...challenge} />
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Quick Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="eco" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/course/forest-ecosystems')}
                  >
                    <TreePine className="h-6 w-6 mb-2" />
                    Forest Ecosystems
                  </Button>
                  <Button 
                    variant="eco" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/course/recycling-basics')}
                  >
                    <Recycle className="h-6 w-6 mb-2" />
                    Recycling Basics
                  </Button>
                  <Button 
                    variant="eco" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/course/water-cycle')}
                  >
                    <Droplets className="h-6 w-6 mb-2" />
                    Water Cycle
                  </Button>
                  <Button 
                    variant="eco" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/course/carbon-footprint')}
                  >
                    <Target className="h-6 w-6 mb-2" />
                    Carbon Footprint
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <LeaderboardCard
              title="School Leaderboard"
              entries={leaderboardEntries}
              type="school"
            />

            {/* Achievement Showcase */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-nature text-white">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-achievement-gold rounded-full flex items-center justify-center">
                    <TreePine className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Tree Planting Champion</p>
                    <p className="text-sm text-muted-foreground">Planted 20+ trees</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-achievement-silver rounded-full flex items-center justify-center">
                    <Recycle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Recycling Expert</p>
                    <p className="text-sm text-muted-foreground">30kg+ waste recycled</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View All Achievements
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">350</div>
                  <div className="text-sm text-muted-foreground">/ 500 Eco Points</div>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div className="bg-gradient-nature h-3 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  You're 70% towards your weekly goal! Keep it up! 🌱
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;