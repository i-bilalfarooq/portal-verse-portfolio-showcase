import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 'htmllab',
    title: 'HTMLLab',
    description: 'An AI-Based HTML and CSS Generator that reduces development time by 40% through AI-powered code generation.',
    technologies: ['AI', 'React', 'Node.js', 'OpenAI API'],
    image: '/placeholder.svg',
    link: 'https://htmllab.run.place/'
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'An E-Commerce Website built for a watch brand, featuring modern design and seamless shopping experience.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
    image: '/placeholder.svg',
    link: 'https://waqt.publicvm.com/'
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'A Blockchain-Based B2B Data Sharing Platform where data is encrypted using Kyber and Dilithium for post-quantum security.',
    technologies: ['Blockchain', 'React', 'Node.js', 'Kyber', 'Dilithium'],
    image: '/placeholder.svg',
    link: 'https://datasouk.great-site.net/?i=1'
  },
  {
    id: 'mindfulai',
    title: 'MindfulAI',
    description: 'An AI-Powered Mental Health Platform providing personalized support and resources for mental wellbeing.',
    technologies: ['AI', 'React', 'Node.js', 'Machine Learning', 'NLP'],
    image: '/placeholder.svg',
    link: 'https://mindfulai.infy.uk/?i=1'
  }
];

const Work = () => {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <Button 
        variant="ghost" 
        className="text-[#00FEFE] hover:text-[#FF00FF] mb-6 md:mb-8" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2" /> Back to Lobby
      </Button>
      
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8 text-center">My Work</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        {projects.map((project) => (
          <Card 
            key={project.id}
            className="bg-gray-800 border-gray-700 hover:border-[#00FEFE] transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => setActiveProject(project)}
          >
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-36 md:h-48 object-cover"
            />
            <div className="p-3 md:p-4">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{project.title}</h3>
              <p className="text-gray-300 text-xs md:text-sm mb-2 md:mb-4">{project.description.substring(0, 100)}...</p>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="text-[8px] md:text-xs bg-gray-700 px-2 py-1 rounded text-[#00FEFE]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {activeProject && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4"
          onClick={() => setActiveProject(null)}
        >
          <Card 
            className="bg-gray-800 border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white absolute top-2 right-2 z-10"
              onClick={() => setActiveProject(null)}
              size={isMobile ? "sm" : "default"}
            >
              <X />
            </Button>
            
            <div className="p-4 md:p-6 pt-8 md:pt-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">{activeProject.title}</h2>
              
              <img 
                src={activeProject.image} 
                alt={activeProject.title} 
                className="w-full h-48 md:h-64 object-cover bg-gray-700 mb-4 md:mb-6 rounded-lg"
              />
              
              <p className="text-sm md:text-base text-gray-300 mb-4">{activeProject.description}</p>
              
              <h3 className="text-md md:text-lg font-semibold text-[#00FEFE] mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-1 md:gap-2 mb-4 md:mb-6">
                {activeProject.technologies.map((tech) => (
                  <span key={tech} className="text-[10px] md:text-xs bg-gray-700 px-2 py-1 rounded text-[#00FEFE]">
                    {tech}
                  </span>
                ))}
              </div>
              
              <a 
                href={activeProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#00FEFE] text-gray-900 hover:bg-[#FF00FF] hover:text-white transition-colors text-center px-3 py-2 rounded text-sm md:text-base"
              >
                Visit Project
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Work;