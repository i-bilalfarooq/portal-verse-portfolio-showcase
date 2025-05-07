
import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Gate from '@/components/3d/Gate';
import Lobby from '@/components/3d/Lobby';
import ProjectPortals from '@/components/3d/ProjectPortals';
import Loading from '@/components/Loading';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

// Register GSAP plugins
gsap.registerPlugin();

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gateOpened, setGateOpened] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleOpenGate = () => {
    // Disable controls during transition
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    
    // Animate camera movement through the gate
    if (cameraRef.current) {
      // First stage: move through the gate
      gsap.to(cameraRef.current.position, {
        z: -2,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          setGateOpened(true);
          
          // Second stage: animate camera from far away to the lobby position
          if (cameraRef.current) {
            // Set camera to a position far away but looking at the lobby
            cameraRef.current.position.set(0, 30, 30);
            cameraRef.current.lookAt(0, 0, 0);
            
            // Animate camera moving in towards the lobby - adjust for mobile
            gsap.to(cameraRef.current.position, {
              y: 0,
              // Position camera further back on mobile for better viewing
              z: isMobile ? 8 : 5,
              duration: 2,
              ease: "power2.inOut",
              onComplete: () => {
                // Show navigation bar with a slight delay
                setTimeout(() => {
                  setShowNavigation(true);
                }, 300);
                
                // Re-enable controls after camera is positioned
                if (controlsRef.current) {
                  setTimeout(() => {
                    controlsRef.current.enabled = true;
                  }, 100);
                }
              }
            });
          }
        }
      });
    }
  };
  
  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D0D0D]">
      <Canvas shadows>
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 10, 5]} intensity={1} castShadow />
        {!gateOpened ? (
          <Gate onOpen={handleOpenGate} />
        ) : (
          <>
            <Lobby />
            <ProjectPortals />
            <OrbitControls 
              ref={controlsRef}
              enableZoom={false} 
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
              rotateSpeed={isMobile ? 0.3 : 0.5}  // Reduce rotation speed on mobile
              enableDamping
              dampingFactor={0.1}
            />
          </>
        )}
        <PerspectiveCamera 
          ref={cameraRef} 
          makeDefault 
          position={[0, 0, 5]} 
          fov={isMobile ? 85 : 75} // Wider FOV for mobile
        />
      </Canvas>
      
      {showNavigation && (
        <nav className={`absolute ${isMobile ? 'bottom-8' : 'top-8'} left-1/2 transform -translate-x-1/2 z-10 animate-fade-in`}>
          <div className={`flex ${isMobile ? 'flex-wrap justify-center gap-4' : 'space-x-8'} text-white`}>
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
