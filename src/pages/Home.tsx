
import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { useNavigate } from 'react-router-dom';
import Gate from '@/components/3d/Gate';
import Lobby from '@/components/3d/Lobby';
import ProjectPortals from '@/components/3d/ProjectPortals';
import Loading from '@/components/Loading';
import * as THREE from 'three';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gateOpened, setGateOpened] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const navigate = useNavigate();
  
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
      gsap.to(cameraRef.current.position, {
        z: -2,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          setGateOpened(true);
          
          // Reset camera position for lobby view
          if (cameraRef.current) {
            cameraRef.current.position.set(0, 0, 5);
            
            // Re-enable controls after camera is positioned
            if (controlsRef.current) {
              setTimeout(() => {
                controlsRef.current.enabled = true;
              }, 100);
            }
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
        <Suspense fallback={null}>
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
        </Suspense>
        <PerspectiveCamera 
          ref={cameraRef} 
          makeDefault 
          position={[0, 0, 5]} 
          fov={75} 
        />
      </Canvas>
      
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
