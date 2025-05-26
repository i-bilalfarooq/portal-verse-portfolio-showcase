
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
import { Menu } from 'lucide-react';

// Import the GSAP plugins
import '@/lib/gsap-plugins';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gateOpened, setGateOpened] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if we should skip to lobby (for refresh/back navigation)
    const shouldSkipGate = sessionStorage.getItem('skipGate') === 'true';
    
    if (shouldSkipGate) {
      setGateOpened(true);
      setShowNavigation(true);
    }
    
    // Make sure screen is properly initialized
    document.body.style.overflow = 'hidden';
    
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);
  
  useEffect(() => {
    // Set flag when gate is opened so refresh/back will skip gate
    if (gateOpened) {
      sessionStorage.setItem('skipGate', 'true');
    }
  }, [gateOpened]);
  
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
              // Position camera better for mobile
              z: isMobile ? 6 : 5, // Adjusted for mobile to see all projects
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
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
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
              rotateSpeed={isMobile ? 0.3 : 0.5}
              enableDamping
              dampingFactor={0.1}
            />
          </>
        )}
        <PerspectiveCamera 
          ref={cameraRef} 
          makeDefault 
          position={[0, 0, 5]} 
          fov={isMobile ? 75 : 70}
        />
      </Canvas>
      
      {showNavigation && (
        <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 animate-fade-in">
          {isMobile ? (
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 bg-black/90 backdrop-blur-md px-6 py-3 rounded-full 
                         shadow-[0_0_20px_#00FEFE] border-2 border-[#00FEFE]/50 text-[#00FEFE] 
                         hover:shadow-[0_0_30px_#00FEFE] transition-all duration-300 animate-glow"
              >
                <Menu size={20} />
                <span className="font-semibold">MENU</span>
              </button>
              
              {mobileMenuOpen && (
                <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 
                               bg-black/90 backdrop-blur-md rounded-2xl border-2 border-[#00FEFE]/30 
                               shadow-[0_0_30px_#00FEFE] p-4 min-w-[200px] animate-scale-in">
                  <div className="flex flex-col space-y-3">
                    <button 
                      onClick={() => handleNavigate('/')}
                      className="text-[#00FEFE] hover:text-[#FF00FF] transition-all text-sm relative group py-2"
                    >
                      HOME
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-100 origin-left transition-transform duration-300"></span>
                    </button>
                    <button 
                      onClick={() => handleNavigate('/work')}
                      className="text-white hover:text-[#00FEFE] transition-all text-sm relative group py-2"
                    >
                      WORK
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                    </button>
                    <button 
                      onClick={() => handleNavigate('/about')}
                      className="text-white hover:text-[#00FEFE] transition-all text-sm relative group py-2"
                    >
                      ABOUT
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                    </button>
                    <button 
                      onClick={() => handleNavigate('/manifesto')}
                      className="text-white hover:text-[#00FEFE] transition-all text-sm relative group py-2"
                    >
                      MANIFESTO
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                    </button>
                    <button 
                      onClick={() => handleNavigate('/contact')}
                      className="text-white hover:text-[#00FEFE] transition-all text-sm relative group py-2"
                    >
                      CONTACT
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-8 bg-black/90 backdrop-blur-md px-8 py-4 rounded-full 
                           shadow-[0_0_20px_#00FEFE] border-2 border-[#00FEFE]/50 animate-glow">
              <button className="text-[#00FEFE] hover:text-[#FF00FF] transition-all text-base relative group">
                HOME
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
              <button 
                className="text-white hover:text-[#00FEFE] transition-all text-base relative group" 
                onClick={() => navigate('/work')}
              >
                WORK
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
              <button 
                className="text-white hover:text-[#00FEFE] transition-all text-base relative group" 
                onClick={() => navigate('/about')}
              >
                ABOUT
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
              <button 
                className="text-white hover:text-[#00FEFE] transition-all text-base relative group" 
                onClick={() => navigate('/manifesto')}
              >
                MANIFESTO
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
              <button 
                className="text-white hover:text-[#00FEFE] transition-all text-base relative group" 
                onClick={() => navigate('/contact')}
              >
                CONTACT
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
            </div>
          )}
        </nav>
      )}
      
      {/* Click outside overlay to close project details and mobile menu */}
      {showNavigation && (
        <div 
          className="absolute inset-0 z-0"
          onClick={() => {
            // Close mobile menu if open
            setMobileMenuOpen(false);
            // This will trigger the global click handler in ProjectPortals
            const event = new CustomEvent('closeProjectDetails');
            window.dispatchEvent(event);
          }}
        />
      )}
    </div>
  );
};

export default Home;
