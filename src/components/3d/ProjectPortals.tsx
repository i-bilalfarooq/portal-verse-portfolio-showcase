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
    color: '#4285F4', // Google blue
    position: [-2.5, 0, 0],
    mobilePosition: [-1.8, 0, 0],
    image: '/placeholder.svg'
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'E-Commerce Website for a watch brand',
    color: '#FBBC04', // Google yellow
    position: [0, 0, -2.5],
    mobilePosition: [0, 0, -1.8],
    image: '/placeholder.svg'
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'Blockchain-Based B2B Data Sharing Platform',
    color: '#34A853', // Google green
    position: [2.5, 0, 0],
    mobilePosition: [1.8, 0, 0],
    image: '/placeholder.svg'
  }
];

const ProjectPortal = ({ 
  project, 
  animationDelay = 0,
  isMobile 
}: { 
  project: ProjectData, 
  animationDelay?: number,
  isMobile: boolean
}) => {
  const portalRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Use mobile or desktop position based on screen size
  const position = isMobile ? project.mobilePosition : project.position;
  
  useEffect(() => {
    // Entry animation - start from above and animate down
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
  
  useEffect(() => {
    // Cleanup any timeout when component unmounts
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerOver = () => {
    // For desktop: Start hover state
    if (!isMobile) {
      setHovered(true);
      
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      // Show details after a very brief delay to prevent flickering
      setTimeout(() => {
        setDetailsVisible(true);
      }, 50);
    }
  };

  const handlePointerOut = () => {
    // For desktop: Only exit hover after a delay to improve UX
    if (!isMobile) {
      setHovered(false);
      
      // Set a timeout before hiding details
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      hoverTimeoutRef.current = setTimeout(() => {
        setDetailsVisible(false);
      }, 300); // Delay hiding details to give user time to move to the card
    }
  };
  
  // Handle click for mobile
  const handleClick = () => {
    if (isMobile) {
      setDetailsVisible(!detailsVisible);
      setHovered(!hovered);
    }
  };
  
  // Handle when user hovers over the details card itself
  const handleCardHover = (entering: boolean) => {
    if (!isMobile) {
      if (entering) {
        // Keep details visible when hovering over the card
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setHovered(true);
        setDetailsVisible(true);
      } else {
        // Set timeout to hide after leaving the card
        hoverTimeoutRef.current = setTimeout(() => {
          setDetailsVisible(false);
          setHovered(false);
        }, 300);
      }
    }
  };
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      // Continuous rotation
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      
      // Hover effect
      if (hovered) {
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
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Project portal sphere */}
      <mesh ref={sphereRef} castShadow>
        <sphereGeometry args={[sphereSize, 32, 32]} />
        <meshStandardMaterial 
          color={project.color} 
          metalness={0.6} 
          roughness={0.2} 
          emissive={project.color} 
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
        
        {/* Orbit rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[sphereSize * 1.25, 0.02, 16, 100]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[sphereSize * 1.35, 0.02, 16, 100]} />
          <meshStandardMaterial color="#00FEFE" transparent opacity={0.3} />
        </mesh>
      </mesh>
      
      {/* Project name always visible */}
      <Text
        position={[0, sphereSize * 1.6, 0]}
        fontSize={fontSize}
        color="#00FEFE"
        anchorX="center"
        anchorY="middle"
      >
        {project.title}
      </Text>
      
      {/* Project details on hover (desktop) or tap (mobile) */}
      {detailsVisible && (
        <Html
          position={[0, 0, 0]}
          center
          distanceFactor={isMobile ? 6 : 10}
          className="pointer-events-auto"
          style={{ pointerEvents: 'all' }}
          onPointerOver={() => handleCardHover(true)}
          onPointerOut={() => handleCardHover(false)}
        >
          <div 
            className={`${isMobile ? 'w-64' : 'w-96'} bg-gray-900/90 backdrop-blur-md p-3 rounded-md border border-[#00FEFE] text-white`}
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
  
  return (
    <group>
      {projects.map((project, index) => (
        <ProjectPortal 
          key={project.id} 
          project={project} 
          animationDelay={0.2 * index}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
};

export default ProjectPortals;
