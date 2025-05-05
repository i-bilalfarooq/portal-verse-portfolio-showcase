
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Linkedin, Github, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Contact = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <Button 
        variant="ghost" 
        className="text-[#00FEFE] hover:text-[#FF00FF] mb-8" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2" /> Back to Lobby
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Contact Me</h1>
        <p className="text-center text-gray-300 mb-12">Let's connect and create something amazing together</p>
        
        <Card className="bg-gray-800 border-gray-700 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Connect With Me</h2>
              
              <div className="space-y-8">
                <a 
                  href="https://www.linkedin.com/in/bilal-farooq-0a40ba1a5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 text-white hover:text-[#00FEFE] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-[#00FEFE] transition-colors">
                    <Linkedin className="w-6 h-6 text-[#00FEFE] group-hover:text-gray-900 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">LinkedIn</h3>
                    <p className="text-gray-300 text-sm">Connect professionally</p>
                  </div>
                </a>
                
                <a 
                  href="https://github.com/i-bilalfarooq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 text-white hover:text-[#00FEFE] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-[#00FEFE] transition-colors">
                    <Github className="w-6 h-6 text-[#00FEFE] group-hover:text-gray-900 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">GitHub</h3>
                    <p className="text-gray-300 text-sm">Check out my code</p>
                  </div>
                </a>
                
                <a 
                  href="https://wa.me/971523089800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 text-white hover:text-[#00FEFE] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-[#00FEFE] transition-colors">
                    <Phone className="w-6 h-6 text-[#00FEFE] group-hover:text-gray-900 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">WhatsApp</h3>
                    <p className="text-gray-300 text-sm">+971 52 308 9800</p>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#00FEFE] text-sm uppercase tracking-wider">Email</h3>
                  <p className="text-white">ibilalfarooq@gmail.com</p>
                </div>
                
                <div>
                  <h3 className="text-[#00FEFE] text-sm uppercase tracking-wider">Phone</h3>
                  <p className="text-white">971 52 308 9800</p>
                </div>
                
                <div>
                  <h3 className="text-[#00FEFE] text-sm uppercase tracking-wider">Location</h3>
                  <p className="text-white">Muhaisnah 4, Dubai</p>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-[#00FEFE] text-sm uppercase tracking-wider mb-2">Availability</h3>
                  <p className="text-white">I'm currently available for freelance work and full-time opportunities. Get in touch and let's create something amazing together!</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
