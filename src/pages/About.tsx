
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

const About = () => {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">BILAL FAROOQ</h1>
          <p className="text-xl text-[#00FEFE] tracking-widest">PROGRAMMING ENTHUSIAST</p>
        </div>
        
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
            <p className="text-gray-300">
              I am a qualified and professional web developer with experience in database administration and website design. 
              Strong creative and analytical skills. Team player with an eye for detail.
            </p>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Education</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-[#00FEFE] font-medium">Westford University College</h3>
                  <p className="text-gray-300">2022-Ongoing</p>
                  <p className="text-white">BSC (HONS) IN COMPUTER SCIENCE</p>
                </div>
                <div>
                  <h3 className="text-[#00FEFE] font-medium">Sheikh Khalifa Bin Zayed Arab Pakistani School</h3>
                  <p className="text-gray-300">2017-2019</p>
                  <p className="text-white">SECONDARY SCHOOL</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
              <div className="grid grid-cols-2 gap-2">
                <SkillBadge skill="Communication Skills" />
                <SkillBadge skill="Sales" />
                <SkillBadge skill="Microsoft Office" />
                <SkillBadge skill="Social Media Marketing" />
                <SkillBadge skill="Data Entry" />
                <SkillBadge skill="Customer Service" />
                <SkillBadge skill="Marketing Strategy" />
                <SkillBadge skill="Photography" />
                <SkillBadge skill="Videography" />
                <SkillBadge skill="Coding" />
                <SkillBadge skill="Data Analysis" />
                <SkillBadge skill="Network Simulation" />
                <SkillBadge skill="Database" />
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Work Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[#00FEFE] font-medium">Data Direct Group of Companies (CBD Project)</h3>
                <p className="text-gray-300">2024 - Present</p>
                <p className="text-white font-medium">TELESALES REPRESENTATIVE</p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                  <li>Handling 100 customers each day for more conversion</li>
                  <li>Communicating Credit Card details precisely to the customers to gain their interest</li>
                  <li>Checking eligibility and guiding customers properly through the application journey</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-[#00FEFE] font-medium">Vibes Events, Eventlab, WOW Events, DMG Events</h3>
                <p className="text-gray-300">2019 - 2024</p>
                <p className="text-white font-medium">CUSTOMER SERVICE REPRESENTATIVE</p>
                <p className="text-gray-300 mt-2">Events:</p>
                <ul className="list-disc list-inside text-gray-300 mt-1 space-y-1">
                  <li>Expo 2020</li>
                  <li>Abu Dhabi International Petroleum Exhibition and Conference (ADIPEC)</li>
                  <li>World Future Energy Summit</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Freelance Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[#00FEFE] font-medium">Web Development Service</h3>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                  <li>Designing website using wireframes for a better visual of website</li>
                  <li>Front-end development using HTML and CSS to accurately fulfill clients needs</li>
                  <li>Using back-end development to fully function the website for clients</li>
                  <li>Hosting website and managing database according to requirement</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-[#00FEFE] font-medium">Content Creation Service</h3>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                  <li>Creating engaging YouTube, TikTok, SnapChat and Instagram Videos</li>
                  <li>Using Insights while utilizing latest trends and grossing music</li>
                  <li>Using Meta Business to schedule Reels and Posts</li>
                  <li>Using Photoshop and Lightroom to enhance post quality</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-[#00FEFE] font-medium">Photography and Videography Service</h3>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                  <li>Volunteered as Photographer and Videographer at Islamic Cultural Center, Abu Dhabi</li>
                  <li>Expert in candid photography while capturing important moments</li>
                  <li>Perfectionist in choosing right angles for cinematic approach on videography</li>
                  <li>Product Photography is done in trendy yet classy manner</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="text-center mt-12">
          <p className="text-gray-300">
            <span className="text-[#00FEFE]">Contact:</span> 971 52 308 9800 | ibilalfarooq@gmail.com | Muhaisnah 4, Dubai
          </p>
          <div className="mt-4">
            <span className="text-[#00FEFE] mr-4">Languages:</span>
            <span className="text-white">English</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-white">Urdu</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-white">Hindi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillBadge = ({ skill }: { skill: string }) => (
  <div className="bg-gray-700 rounded px-3 py-1 text-sm text-[#00FEFE]">
    {skill}
  </div>
);

export default About;
