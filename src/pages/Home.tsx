
import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { useNavigate } from 'react-router-dom';
import GateEntrance from '@/components/3d/GateEntrance';
import Lobby from '@/components/3d/Lobby';
import ProjectPortals from '@/components/3d/ProjectPortals';
import Loading from '@/components/Loading';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gateOpened, setGateOpened] = useState(false);
  const cameraRef = useRef();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleOpenGate = () => {
    setGateOpened(true);
    // Gate animation will be handled in the GateEntrance component
  };
  
  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D0D0D]">
      <Canvas shadows>
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 10, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          {!gateOpened ? (
            <GateEntrance onOpen={handleOpenGate} />
          ) : (
            <>
              <Lobby />
              <ProjectPortals />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
              />
            </>
          )}
        </Suspense>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      </Canvas>
      
      {!gateOpened && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            className="bg-transparent border border-[#00FEFE] text-[#00FEFE] hover:bg-[#00FEFE]/10"
            onClick={handleOpenGate}
          >
            Enter Portfolio
          </Button>
        </div>
      )}
      
      {gateOpened && (
        <nav className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-8 text-white">
            <button className="text-[#00FEFE] hover:text-[#FF00FF] transition-colors">HOME</button>
            <button className="hover:text-[#00FEFE] transition-colors" onClick={() => navigate('/work')}>WORK</button>
            <button className="hover:text-[#00FEFE] transition-colors" onClick={() => navigate('/about')}>ABOUT</button>
            <button className="hover:text-[#00FEFE] transition-colors" onClick={() => navigate('/manifesto')}>MANIFESTO</button>
            <button className="hover:text-[#00FEFE] transition-colors" onClick={() => navigate('/contact')}>CONTACT</button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Home;
