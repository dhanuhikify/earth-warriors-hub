import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-environment.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Students engaged in environmental activities" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4 animate-float">
            🌱 Environmental Education Reimagined
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Learn, Act, and
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Save Our Planet
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
            Join thousands of students across India in our gamified environmental education platform. 
            Complete real-world challenges, earn eco-points, and make a lasting impact on your community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button variant="hero" size="lg" className="group">
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">50,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span className="text-sm">1M+ Eco Actions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span className="text-2xl">🌍</span>
        </div>
      </div>
      
      <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span className="text-xl">♻️</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;