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
  link: string;
}

const projects: ProjectData[] = [
  {
    id: 'htmllab',
    title: 'HTMLLab',
    description: 'AI-Based HTML and CSS Generator',
    color: '#4285F4', // Google blue
    position: [-3, 0.3, 0],
    mobilePosition: [-3, 0.3, 0],
    image: '/HTMLLAB.png',
    link: 'https://htmllab.run.place/'
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'E-Commerce Website for a watch brand',
    color: '#FBBC04', // Google yellow
    position: [-1.2, 0.3, -2],
    mobilePosition: [-1.2, 0.3, -2],
    image: '/WAQT.png',
    link: 'https://waqt.publicvm.com/'
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'Blockchain-Based B2B Data Sharing Platform',
    color: '#34A853', // Google green
    position: [1.2, 0.3, -2],
    mobilePosition: [1.2, 0.3, -2],
    image: '/DATASOUQ.png',
    link: 'https://datasouk.great-site.net/?i=1'
  },
  {
    id: 'mindfulai',
    title: 'MindfulAI',
    description: 'AI-Powered Mental Health Platform',
    color: '#EA4335', // Google red
    position: [3, 0.3, 0],
    mobilePosition: [3, 0.3, 0],
    image: '/MindfulAI.png',
    link: 'https://mindfulai.infy.uk/?i=1'
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
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    setActiveProjectId(isActive ? null : project.id);
  };
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      
      const targetScale = isActive ? 1.3 : 1;
      sphereRef.current.scale.setScalar(THREE.MathUtils.lerp(
        sphereRef.current.scale.x,
        targetScale,
        0.1
      ));
    }
  });
  
  const sphereSize = isMobile ? 0.8 : 0.8;
  const fontSize = isMobile ? 0.25 : 0.2;
  
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
        
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[sphereSize * 1.25, 0.02, 16, 100]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[sphereSize * 1.35, 0.02, 16, 100]} />
          <meshStandardMaterial color="#00FEFE" transparent opacity={0.3} />
        </mesh>
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
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#00FEFE] text-black px-3 py-2 rounded text-xs mt-2 hover:bg-[#FF00FF] hover:text-white transition-colors w-full text-center"
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
  
  const handleBackgroundClick = () => {
    if (activeProjectId) {
      setActiveProjectId(null);
    }
  };
  
  return (
    <group>
      {/* Invisible fullscreen plane behind all portals to catch clicks outside */}
      <mesh
        position={[0, 0, -10]} // place behind portals
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <Text
        position={[0, 3.5, -5]} 
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
