
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
  const targetPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 6));
  const projects = [
    { position: new THREE.Vector3(-4, 0, -2), id: 'htmllab' },
    { position: new THREE.Vector3(0, 0, -6), id: 'datasouk' },
    { position: new THREE.Vector3(4, 0, -10), id: 'waqt' }
  ];
  const activeProjectIndex = useRef<number>(-1);
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
      
      if (!cameraRef.current) return;
      
      // Determine scroll direction
      const direction = Math.sign(e.deltaY);
      
      // Update active project index based on scroll direction
      if (direction > 0) {
        // Scrolling down (further into scene)
        activeProjectIndex.current = Math.min(projects.length - 1, activeProjectIndex.current + 1);
      } else if (direction < 0) {
        // Scrolling up (back towards gate)
        activeProjectIndex.current = Math.max(-1, activeProjectIndex.current - 1);
      }
      
      // Set camera target position
      if (activeProjectIndex.current === -1) {
        // Default position when no project is selected
        targetPositionRef.current = new THREE.Vector3(0, 2, 6);
      } else {
        // Position near the active project
        const projectPos = projects[activeProjectIndex.current].position;
        targetPositionRef.current = new THREE.Vector3(
          projectPos.x * 0.5, // Offset to side
          projectPos.y + 1.5,  // Slightly above
          projectPos.z + 3     // In front of project
        );
      }
      
      // Animate camera to target position
      if (cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: targetPositionRef.current.x,
          y: targetPositionRef.current.y,
          z: targetPositionRef.current.z,
          duration: 1.2,
          ease: "power2.out"
        });
        
        // Make camera look at the project or center
        const lookAtPos = activeProjectIndex.current >= 0 
          ? projects[activeProjectIndex.current].position
          : new THREE.Vector3(0, 0, 0);
        
        gsap.to(cameraRef.current.userData, {
          lookAtX: lookAtPos.x,
          lookAtY: lookAtPos.y,
          lookAtZ: lookAtPos.z,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            cameraRef.current?.lookAt(
              cameraRef.current.userData.lookAtX,
              cameraRef.current.userData.lookAtY,
              cameraRef.current.userData.lookAtZ
            );
          }
        });
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [gateOpened, projects]);
  
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
                    
                    // Initialize camera userData for smooth lookAt animations
                    if (cameraRef.current) {
                      cameraRef.current.userData = {
                        lookAtX: 0,
                        lookAtY: 0,
                        lookAtZ: 0
                      };
                    }
                    
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
            <ProjectPortals activeProjectIndex={activeProjectIndex.current} />
            <OrbitControls 
              ref={controlsRef}
              enableZoom={false} 
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3.5} // Adjust to prevent looking too far down
              rotateSpeed={0.4} // Reduced for smoother rotation
              enableDamping
              dampingFactor={0.12} // Increased for smoother stopping
              enabled={!isLoading && gateOpened}
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
      
      {gateOpened && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
          <p className="text-sm text-[#00FEFE] animate-pulse">Scroll to navigate through projects</p>
        </div>
      )}
    </div>
  );
};

export default Home;
