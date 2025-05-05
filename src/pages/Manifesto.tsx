
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ManifestoItem {
  title: string;
  content: string;
}

const manifestoItems: ManifestoItem[] = [
  {
    title: "Innovation First",
    content: "I believe in pushing the boundaries of what's possible through innovative thinking and creative solutions. Every project is an opportunity to explore new technologies and approaches."
  },
  {
    title: "User-Centered Design",
    content: "The best digital products are those that solve real problems for real people. I prioritize understanding user needs and creating experiences that are intuitive, accessible, and delightful."
  },
  {
    title: "Continuous Learning",
    content: "Technology evolves rapidly, and so should we. I commit to continuous learning, exploring new frameworks, methodologies, and best practices to deliver cutting-edge solutions."
  },
  {
    title: "Quality Over Quantity",
    content: "I believe in doing fewer things better. Each project receives my full attention and commitment to excellence, from concept to execution."
  },
  {
    title: "Collaborative Spirit",
    content: "Great ideas emerge from collaboration. I value open communication, diverse perspectives, and collective problem-solving to achieve the best possible outcomes."
  }
];

const Manifesto = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  
  const toggleItem = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <Button 
        variant="ghost" 
        className="text-[#00FEFE] hover:text-[#FF00FF] mb-8" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2" /> Back to Lobby
      </Button>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Manifesto</h1>
        <p className="text-center text-gray-300 mb-12">My guiding principles as a developer and creator</p>
        
        <div className="space-y-6">
          {manifestoItems.map((item, index) => (
            <Card 
              key={index}
              className={`bg-gray-800 border-gray-700 transition-all duration-300 overflow-hidden ${
                expandedItem === index ? 'border-[#00FEFE]' : 'hover:border-gray-500'
              }`}
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleItem(index)}
              >
                <div className="flex justify-between items-center">
                  <h2 className={`text-xl font-bold ${expandedItem === index ? 'text-[#00FEFE]' : 'text-white'}`}>
                    {item.title}
                  </h2>
                  <span className="text-2xl text-gray-400">
                    {expandedItem === index ? '−' : '+'}
                  </span>
                </div>
                
                <div className={`mt-4 text-gray-300 overflow-hidden transition-all duration-300 ${
                  expandedItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p>{item.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-[#FF00FF] text-sm uppercase tracking-wider mb-3">Looking for a like-minded collaborator?</p>
          <Button
            className="bg-[#00FEFE] text-gray-900 hover:bg-[#FF00FF] hover:text-white"
            onClick={() => navigate('/contact')}
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
