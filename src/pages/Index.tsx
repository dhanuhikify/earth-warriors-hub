import EcoHeader from "@/components/EcoHeader";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  Award, 
  BookOpen, 
  Gamepad2, 
  Globe,
  ArrowRight,
  CheckCircle,
  Leaf,
  TreePine,
  Recycle,
  Droplets
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: "Gamified Learning",
      description: "Earn eco-points, unlock achievements, and compete with classmates in environmental challenges."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Real-World Impact",
      description: "Complete actual environmental tasks like tree planting, waste segregation, and conservation projects."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "School Competitions",
      description: "Participate in inter-school environmental competitions and showcase your eco-achievements."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Interactive Lessons",
      description: "Learn about climate change, biodiversity, and sustainability through engaging content."
    }
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, value: "50,000+", label: "Active Students" },
    { icon: <TreePine className="h-8 w-8" />, value: "1M+", label: "Trees Planted" },
    { icon: <Recycle className="h-8 w-8" />, value: "500K kg", label: "Waste Recycled" },
    { icon: <Globe className="h-8 w-8" />, value: "2,500+", label: "Schools Joined" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EcoHeader />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              🎯 How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Learn, Act, and Make a 
              <span className="text-primary"> Real Difference</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines education with action, making environmental learning 
              engaging and impactful for students across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-nature transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-nature rounded-lg flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the <span className="text-primary">Environmental Movement</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See the incredible impact our community has made together
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-nature rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:shadow-glow transition-all">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-nature text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Become an Eco Warrior?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students making a real difference. Start your environmental 
            journey today and help save our planet!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Leaf className="h-5 w-5 mr-2" />
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Free for all schools</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>NEP 2020 aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Real-world impact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">EcoWarriors</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-white/80">Building a sustainable future, one student at a time.</p>
              <p className="text-white/60 text-sm mt-2">© 2024 EcoWarriors. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
