
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

// Register GSAP plugins
gsap.registerPlugin();

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gateOpened, setGateOpened] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const scrollRef = useRef<number>(0);
  const targetScrollRef = useRef<number>(0);
  const navigate = useNavigate();
  
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
      // Adjust scroll sensitivity
      targetScrollRef.current += e.deltaY * 0.005;
      // Clamp scroll values to prevent going too far
      targetScrollRef.current = Math.max(-5, Math.min(5, targetScrollRef.current));
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Animation loop for smooth scrolling
    const animateScroll = () => {
      if (gateOpened && cameraRef.current) {
        // Smooth damping effect for scrolling
        scrollRef.current += (targetScrollRef.current - scrollRef.current) * 0.05;
        
        // Move camera based on scroll position along a path
        if (cameraRef.current) {
          // Create a curved path for camera movement
          const angle = scrollRef.current * 0.3;
          const radius = 5; // Distance from center
          
          cameraRef.current.position.x = Math.sin(angle) * radius;
          cameraRef.current.position.z = Math.cos(angle) * radius;
          
          // Always look at the center
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
      // First stage: move through the gate
      gsap.to(cameraRef.current.position, {
        z: -2,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          setGateOpened(true);
          
          // Second stage: create a more dramatic fly-in to the lobby
          if (cameraRef.current) {
            // Set camera to a high position far away
            cameraRef.current.position.set(0, 30, 50);
            cameraRef.current.lookAt(0, 0, 0);
            
            // Animate camera flying in towards the lobby with a curved path
            gsap.timeline()
              .to(cameraRef.current.position, {
                y: 10,
                z: 25,
                duration: 1.5,
                ease: "power2.inOut"
              })
              .to(cameraRef.current.position, {
                y: 2,
                z: 5,
                duration: 1.5,
                ease: "power3.out",
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
              rotateSpeed={0.5}
              enableDamping
              dampingFactor={0.1}
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
