
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! I will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
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
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Contact Me</h1>
        <p className="text-center text-gray-300 mb-12">Let's discuss how we can work together</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Get In Touch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-300 mb-1">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm text-gray-300 mb-1">Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm text-gray-300 mb-1">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white h-32"
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-[#00FEFE] text-gray-900 hover:bg-[#FF00FF] hover:text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-[#00FEFE] text-sm">Email</h3>
                  <p className="text-white">ibilalfarooq@gmail.com</p>
                </div>
                
                <div>
                  <h3 className="text-[#00FEFE] text-sm">Phone</h3>
                  <p className="text-white">971 52 308 9800</p>
                </div>
                
                <div>
                  <h3 className="text-[#00FEFE] text-sm">Location</h3>
                  <p className="text-white">Muhaisnah 4, Dubai</p>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-4">Connect With Me</h3>
                <div className="flex space-x-4">
                  {/* These would be actual social media icons */}
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-[#00FEFE] hover:bg-[#00FEFE] hover:text-gray-900 transition-colors cursor-pointer">
                    L
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-[#00FEFE] hover:bg-[#00FEFE] hover:text-gray-900 transition-colors cursor-pointer">
                    G
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-[#00FEFE] hover:bg-[#00FEFE] hover:text-gray-900 transition-colors cursor-pointer">
                    I
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-[#00FEFE] hover:bg-[#00FEFE] hover:text-gray-900 transition-colors cursor-pointer">
                    T
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
