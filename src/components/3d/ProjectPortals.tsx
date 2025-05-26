
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  color: string;
  position: [number, number, number];
  mobilePosition: [number, number, number];
  image: string;
}

const projects: ProjectData[] = [
  {
    id: 'htmllab',
    title: 'HTMLLab',
    description: 'AI-Based HTML and CSS Generator',
    color: '#4285F4',
    position: [-2.5, 0, 0],
    mobilePosition: [-1.8, 0, 0],
    image: '/placeholder.svg'
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'E-Commerce Website for a watch brand',
    color: '#FBBC04',
    position: [0, 0, -2.5],
    mobilePosition: [0, 0, -1.8],
    image: '/placeholder.svg'
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'Blockchain-Based B2B Data Sharing Platform',
    color: '#34A853',
    position: [2.5, 0, 0],
    mobilePosition: [1.8, 0, 0],
    image: '/placeholder.svg'
  }
];

const ProjectPortal = ({ 
  project, 
  animationDelay = 0,
  isMobile,
  activeProjectId,
  setActiveProjectId
}: { 
  project: ProjectData, 
  animationDelay?: number,
  isMobile: boolean,
  activeProjectId: string | null,
  setActiveProjectId: (id: string | null) => void
}) => {
  const portalRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const isActive = activeProjectId === project.id;
  
  const position = isMobile ? project.mobilePosition : project.position;
  
  useEffect(() => {
    if (portalRef.current) {
      portalRef.current.position.y = 10;
      gsap.to(portalRef.current.position, {
        y: position[1],
        duration: 1.5,
        delay: animationDelay,
        ease: "elastic.out(1, 0.75)"
      });
    }
  }, [animationDelay, position]);
  
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isActive) {
      setActiveProjectId(null);
    } else {
      setActiveProjectId(project.id);
    }
  };
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      
      if (isActive) {
        sphereRef.current.scale.setScalar(THREE.MathUtils.lerp(
          sphereRef.current.scale.x,
          1.3,
          0.1
        ));
      } else {
        sphereRef.current.scale.setScalar(THREE.MathUtils.lerp(
          sphereRef.current.scale.x,
          1,
          0.1
        ));
      }
    }
  });
  
  const sphereSize = isMobile ? 0.6 : 0.8;
  const fontSize = isMobile ? 0.15 : 0.2;
  
  return (
    <group
      ref={portalRef}
      position={[position[0], position[1], position[2]]}
      onClick={handleClick}
    >
      <mesh ref={sphereRef} castShadow>
        <sphereGeometry args={[sphereSize, 32, 32]} />
        <meshStandardMaterial 
          color={project.color} 
          metalness={0.6} 
          roughness={0.2} 
          emissive={project.color} 
          emissiveIntensity={isActive ? 0.8 : 0.3}
        />
      </mesh>
      
      <Text
        position={[0, sphereSize * 1.6, 0]}
        fontSize={fontSize}
        color="#00FEFE"
        anchorX="center"
        anchorY="middle"
      >
        {project.title}
      </Text>
      
      {isActive && (
        <Html
          position={[0, 0, 0]}
          center
          distanceFactor={isMobile ? 6 : 10}
          className="pointer-events-auto"
          style={{ pointerEvents: 'all' }}
        >
          <div 
            className={`${isMobile ? 'w-64' : 'w-96'} bg-gray-900/90 backdrop-blur-md p-3 rounded-md border border-[#00FEFE] text-white`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#00FEFE]">{project.title}</h2>
            </div>
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-32 object-cover my-2 rounded"
            />
            <p className="text-xs mb-2">{project.description}</p>
            <a 
              href={`/work/${project.id}`} 
              className="inline-block bg-[#00FEFE] text-black px-3 py-2 rounded text-xs mt-2 hover:bg-[#FF00FF] hover:text-white transition-colors w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              View Project
            </a>
          </div>
        </Html>
      )}
    </group>
  );
};

const ProjectPortals = () => {
  const isMobile = useIsMobile();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCloseDetails = () => {
      setActiveProjectId(null);
    };
    
    window.addEventListener('closeProjectDetails', handleCloseDetails);
    
    return () => {
      window.removeEventListener('closeProjectDetails', handleCloseDetails);
    };
  }, []);
  
  return (
    <group>
      <Text
        position={[0, 2.5, -3]} 
        fontSize={isMobile ? 1.0 : 1.4} 
        color="#00FEFE"
        anchorX="center"
        anchorY="middle"
        depthOffset={-10}
        outlineWidth={0.02}
        outlineColor="#005a5a"
      >
        Projects
      </Text>
      
      {projects.map((project, index) => (
        <ProjectPortal 
          key={project.id} 
          project={project} 
          animationDelay={0.2 * index}
          isMobile={isMobile}
          activeProjectId={activeProjectId}
          setActiveProjectId={setActiveProjectId}
        />
      ))}
    </group>
  );
};

export default ProjectPortals;
