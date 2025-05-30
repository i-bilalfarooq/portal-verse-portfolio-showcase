import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import Gate from '@/components/3d/Gate';
import Lobby from '@/components/3d/Lobby';
import ProjectPortals from '@/components/3d/ProjectPortals';
import Loading from '@/components/Loading';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';

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
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Only reset gate state on page refresh of home route
    if (location.key === 'default' && location.pathname === '/') {
      setGateOpened(false);
      setShowNavigation(false);
    } else {
      // If coming from another route, show the lobby directly
      setGateOpened(true);
      setShowNavigation(true);
      
      if (cameraRef.current) {
        cameraRef.current.position.set(0, isMobile ? 0 : 0, isMobile ? 9 : 5);
        cameraRef.current.lookAt(0, 0, 0);
      }
      
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    }
    
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [location.key, location.pathname, isMobile]);
  
  const handleOpenGate = () => {
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        z: -2,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          setGateOpened(true);
          
          if (cameraRef.current) {
            cameraRef.current.position.set(0, 30, 30);
            cameraRef.current.lookAt(0, 0, 0);
            
            gsap.to(cameraRef.current.position, {
              y: isMobile ? 0 : 0,
              z: isMobile ? 8 : 5,
              duration: 2,
              ease: "power2.inOut",
              onComplete: () => {
                setTimeout(() => {
                  setShowNavigation(true);
                }, 300);
                
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
        <>
          {!isMobile && (
            <nav className="fixed top-10 left-0 w-full z-10 flex justify-center animate-fade-in">
              <div className="flex space-x-10 bg-black/70 backdrop-blur-md px-10 py-5 rounded-full shadow-[0_0_10px_#00FEFE] border border-[#00FEFE]/30">
                <button className="text-[#00FEFE] hover:text-[#FF00FF] transition-all text-base relative group">
                  HOME
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00FEFE] transform scale-x-100 origin-left transition-transform duration-300"></span>
                </button>
                <button 
                  className="text-white hover:text-[#00FEFE] transition-all text-base relative group" 
                  onClick={() => navigate('/work')}
                >
                  PROJECTS
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
            </nav>
          )}

          {isMobile && (
            <button 
              className="fixed top-6 right-6 z-50 bg-black/70 backdrop-blur-md p-3 rounded-full shadow-[0_0_10px_#00FEFE] border border-[#00FEFE]/30 text-[#00FEFE] hover:text-[#FF00FF] transition-all animate-fade-in"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {isMobile && mobileMenuOpen && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-45 flex flex-col items-center justify-center animate-fade-in">
              <div className="flex flex-col space-y-8 text-center">
                <button 
                  className="text-[#00FEFE] hover:text-[#FF00FF] transition-all text-2xl font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                >
                  HOME
                </button>
                <button 
                  className="text-white hover:text-[#00FEFE] transition-all text-2xl font-bold" 
                  onClick={() => {
                    navigate('/work');
                    setMobileMenuOpen(false);
                  }}
                >
                  WORK
                </button>
                <button 
                  className="text-white hover:text-[#00FEFE] transition-all text-2xl font-bold" 
                  onClick={() => {
                    navigate('/about');
                    setMobileMenuOpen(false);
                  }}
                >
                  ABOUT
                </button>
                <button 
                  className="text-white hover:text-[#00FEFE] transition-all text-2xl font-bold" 
                  onClick={() => {
                    navigate('/manifesto');
                    setMobileMenuOpen(false);
                  }}
                >
                  MANIFESTO
                </button>
                <button 
                  className="text-white hover:text-[#00FEFE] transition-all text-2xl font-bold" 
                  onClick={() => {
                    navigate('/contact');
                    setMobileMenuOpen(false);
                  }}
                >
                  CONTACT
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;