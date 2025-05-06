
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

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gateOpened, setGateOpened] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const scrollRef = useRef<number>(0);
  const targetScrollRef = useRef<number>(0);
  const navigate = useNavigate();
  
  // Fix GSAP plugin issues
  useEffect(() => {
    if (!gsap.globalTimeline.getChildren().length) {
      gsap.registerPlugin();
    }
  }, []);
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle scroll events for project navigation
  useEffect(() => {
    if (!gateOpened) return;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Adjust scroll sensitivity - reduced for smoother movement
      targetScrollRef.current += e.deltaY * 0.003; 
      // Clamp scroll values to prevent going too far
      targetScrollRef.current = Math.max(-5, Math.min(5, targetScrollRef.current));
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Animation loop for smooth scrolling
    const animateScroll = () => {
      if (gateOpened && cameraRef.current) {
        // Smoother damping effect for scrolling (reduced from 0.05 to 0.03)
        scrollRef.current += (targetScrollRef.current - scrollRef.current) * 0.03;
        
        if (cameraRef.current) {
          // Create a more interesting path with a slight vertical movement
          const angle = scrollRef.current * 0.5; // Increased for more pronounced circular movement
          const radius = 6; // Slightly increased distance from center
          
          // Updated camera position calculation for smoother circular path
          cameraRef.current.position.x = Math.sin(angle) * radius;
          cameraRef.current.position.z = Math.cos(angle) * radius;
          cameraRef.current.position.y = 2 + Math.sin(angle * 0.5) * 0.5; // Add gentle up/down motion
          
          // Always look at the center with slight offset
          cameraRef.current.lookAt(0, 0, 0);
        }
      }
      
      requestAnimationFrame(animateScroll);
    };
    
    const animationId = requestAnimationFrame(animateScroll);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationId);
    };
  }, [gateOpened]);
  
  const handleOpenGate = () => {
    // Disable controls during transition
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    
    // Animate camera movement through the gate
    if (cameraRef.current) {
      // Create a much more immersive journey through the gate
      gsap.timeline()
        // First stage: Move forward approaching the gate
        .to(cameraRef.current.position, {
          z: 2,
          duration: 1,
          ease: "power1.inOut"
        })
        // Second stage: Move through the gate with acceleration
        .to(cameraRef.current.position, {
          z: -2,
          duration: 1.5,
          ease: "power2.in"
        })
        .to(cameraRef.current.position, {
          z: -10, // Move further in
          duration: 0.8,
          ease: "power1.in",
          onComplete: () => {
            setGateOpened(true);
            
            // Set camera to high position for dramatic entry to lobby
            if (cameraRef.current) {
              cameraRef.current.position.set(0, 25, 35);
              cameraRef.current.lookAt(0, 0, 0);
              
              // Create multi-stage dramatic fly-in
              gsap.timeline()
                // Initial approach from high altitude
                .to(cameraRef.current.position, {
                  y: 15,
                  z: 20,
                  duration: 2,
                  ease: "power1.inOut"
                })
                // Descend towards the lobby platform
                .to(cameraRef.current.position, {
                  y: 6,
                  z: 10,
                  duration: 1.5,
                  ease: "power2.inOut"
                })
                // Final smooth positioning
                .to(cameraRef.current.position, {
                  y: 2,
                  z: 6,
                  duration: 1,
                  ease: "power3.out",
                  onComplete: () => {
                    // Show navigation bar
                    setShowNavigation(true);
                    
                    // Re-enable controls after camera is positioned
                    if (controlsRef.current) {
                      setTimeout(() => {
                        controlsRef.current.enabled = true;
                      }, 300);
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
              minPolarAngle={Math.PI / 3.5} // Adjust to prevent looking too far down
              rotateSpeed={0.4} // Reduced for smoother rotation
              enableDamping
              dampingFactor={0.12} // Increased for smoother stopping
            />
          </>
        )}
        <PerspectiveCamera 
          ref={cameraRef} 
          makeDefault 
          position={[0, 0, 5]} 
          fov={75} 
        />
      </Canvas>
      
      {showNavigation && (
        <nav className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 animate-fade-in">
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
