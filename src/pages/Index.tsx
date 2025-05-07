
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <Card className="max-w-2xl w-full p-4 md:p-8 bg-gray-800 border-gray-700 shadow-xl">
        <div className="text-center space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Bilal Farooq's Portfolio</h1>
          <p className="text-lg md:text-xl text-gray-300">Welcome to my digital showcase of projects and skills</p>
          
          <div className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-8">
            <h2 className="text-xl md:text-2xl font-semibold">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <ProjectCard 
                title="HTMLLab" 
                description="AI-Based HTML and CSS Generator" 
              />
              <ProjectCard 
                title="Waqt" 
                description="E-Commerce Website for a watch brand" 
              />
              <ProjectCard 
                title="DataSouk" 
                description="Blockchain-Based B2B Data Sharing Platform" 
              />
            </div>
          </div>
          
          <Button className="mt-4 md:mt-6" size={isMobile ? "sm" : "default"}>
            Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

const ProjectCard = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="bg-gray-700 p-3 md:p-4 rounded-lg hover:bg-gray-600 transition-colors">
      <h3 className="font-bold text-base md:text-lg">{title}</h3>
      <p className="text-gray-300 text-xs md:text-sm mt-1 md:mt-2">{description}</p>
    </div>
  );
};

export default Index;
