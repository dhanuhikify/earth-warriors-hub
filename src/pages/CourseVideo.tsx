import { useParams } from "react-router-dom";
import VideoPlayer from "@/components/VideoPlayer";
import { toast } from "sonner";

const CourseVideo = () => {
  const { courseId } = useParams();

  // Environmental video courses data
  const courses = {
    "forest-ecosystems": {
      title: "Understanding Forest Ecosystems",
      description: "Explore the intricate relationships within forest ecosystems, learn about biodiversity, and understand why forests are crucial for our planet's health.",
      videoUrl: "https://www.youtube.com/embed/39YUXIKrOFk",
      duration: "12:34",
      category: "Biodiversity",
      ecoPoints: 150
    },
    "recycling-basics": {
      title: "Recycling Fundamentals",
      description: "Master the art of recycling with this comprehensive guide covering waste segregation, recycling processes, and how to reduce your environmental footprint.",
      videoUrl: "https://www.youtube.com/embed/6jQ7y_qQYUA",
      duration: "15:22",
      category: "Waste Management",
      ecoPoints: 120
    },
    "water-cycle": {
      title: "The Water Cycle Explained",
      description: "Dive deep into understanding the water cycle, its importance in maintaining Earth's climate, and how human activities impact this crucial system.",
      videoUrl: "https://www.youtube.com/embed/al-do-HGuIk",
      duration: "10:15",
      category: "Conservation",
      ecoPoints: 100
    },
    "carbon-footprint": {
      title: "Calculating Your Carbon Footprint",
      description: "Learn to measure and reduce your carbon footprint through practical strategies and lifestyle changes that make a real environmental impact.",
      videoUrl: "https://www.youtube.com/embed/8q7_aV8eLUE",
      duration: "18:45",
      category: "Climate Change",
      ecoPoints: 200
    },
    "tree-planting": {
      title: "Tree Planting for Beginners",
      description: "Complete guide to tree planting - from selecting the right species to proper planting techniques and long-term care for maximum environmental benefit.",
      videoUrl: "https://www.youtube.com/embed/3-hHmdWWaJY",
      duration: "14:30",
      category: "Forestry",
      ecoPoints: 180
    },
    "waste-sorting": {
      title: "Advanced Waste Sorting Techniques",
      description: "Master professional waste sorting methods, understand different material types, and learn how proper segregation improves recycling efficiency.",
      videoUrl: "https://www.youtube.com/embed/S9ry1M7JlyE",
      duration: "13:12",
      category: "Waste Management",
      ecoPoints: 140
    },
    "water-conservation": {
      title: "Water Conservation Strategies",
      description: "Discover innovative water conservation techniques for home, school, and community use. Learn to save water while maintaining quality of life.",
      videoUrl: "https://www.youtube.com/embed/LP4_iOSAiUg",
      duration: "16:08",
      category: "Conservation",
      ecoPoints: 160
    }
  };

  const course = courseId ? courses[courseId as keyof typeof courses] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <p className="text-muted-foreground">The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  const handleCourseComplete = () => {
    toast.success(`Congratulations! You've earned ${course.ecoPoints} Eco Points!`, {
      description: "Keep learning to earn more points and climb the leaderboard!"
    });
  };

  return (
    <VideoPlayer
      {...course}
      onComplete={handleCourseComplete}
    />
  );
};

export default CourseVideo;