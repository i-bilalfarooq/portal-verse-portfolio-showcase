
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  color: string;
  position: [number, number, number];
  image: string;
  url: string;
}

const projects: ProjectData[] = [
  {
    id: 'htmllab',
    title: 'HTMLLab',
    description: 'AI-Based HTML and CSS Generator',
    color: '#4285F4',
    position: [-4, 0, -2],
    image: '/placeholder.svg',
    url: 'https://htmllab.run.place/'
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'Blockchain-Based B2B Data Sharing Platform',
    color: '#34A853',
    position: [0, 0, -6],
    image: '/placeholder.svg',
    url: 'https://datasouk.great-site.net/'
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'E-Commerce Website for a watch brand',
    color: '#FBBC04',
    position: [4, 0, -10],
    image: '/placeholder.svg',
    url: 'https://waqt.publicvm.com/'
  }
];

// Project details component that appears on hover
const ProjectDetails = ({ project, visible, position, onClick }: { 
  project: ProjectData, 
  visible: boolean,
  position: THREE.Vector3,
  onClick: () => void
}) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Mesh>(null);
  const [buttonHovered, setButtonHovered] = useState(false);
  const visibleRef = useRef(visible);
  
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);
  
  useFrame(() => {
    if (groupRef.current) {
      // Make panel face the camera
      groupRef.current.quaternion.copy(camera.quaternion);
      
      // Handle visibility with smoother transitions
      const targetScale = visibleRef.current ? 1 : 0;
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1);
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.1);
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.1);
      
      // Only hide when scale is very small
      groupRef.current.visible = groupRef.current.scale.x > 0.01;
      
      // Button hover effect
      if (buttonRef.current) {
        const targetColor = buttonHovered ? new THREE.Color("#FF00FF") : new THREE.Color("#00FEFE");
        const currentMaterial = buttonRef.current.material as THREE.MeshStandardMaterial;
        currentMaterial.color.lerp(targetColor, 0.1);
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={[position.x, position.y + 1.5, position.z]}
      visible={true}
      scale={[0.01, 0.01, 0.01]}
    >
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.2, 1.5]} />
        <meshStandardMaterial 
          color="#111" 
          transparent 
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <Text
        position={[0, 0.5, 0.01]}
        color="#00FEFE"
        anchorX="center"
        anchorY="middle"
        fontSize={0.18}
        font="/fonts/Inter-Bold.woff"
      >
        {project.title}
      </Text>
      
      <Text
        position={[0, 0.15, 0.01]}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.12}
        maxWidth={1.8}
        textAlign="center"
      >
        {project.description}
      </Text>
      
      {/* View Project Button */}
      <group 
        position={[0, -0.4, 0.01]} 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setButtonHovered(true)}
        onPointerOut={() => setButtonHovered(false)}
      >
        <mesh ref={buttonRef}>
          <planeGeometry args={[1.2, 0.4]} />
          <meshStandardMaterial color="#00FEFE" />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          color="black"
          anchorX="center"
          anchorY="middle"
          fontSize={0.14}
          font="/fonts/Inter-Bold.woff"
        >
          View Project
        </Text>
      </group>
    </group>
  );
};

const ProjectFrame = ({ 
  project, 
  animationDelay = 0, 
  isActive
}: { 
  project: ProjectData, 
  animationDelay?: number,
  isActive: boolean
}) => {
  const frameRef = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState(new THREE.Vector3(...project.position));
  const texture = useTexture(project.image);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const isActiveRef = useRef(isActive);
  const hoveredRef = useRef(hovered);
  
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);
  
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);
  
  // Entry animation
  useEffect(() => {
    if (frameRef.current) {
      // Start from below
      frameRef.current.position.y = -5;
      
      // Use GSAP for animation
      gsap.to(frameRef.current.position, {
        y: project.position[1],
        duration: 1.5,
        delay: animationDelay,
        ease: "power3.out"
      });
    }
  }, [animationDelay, project.position]);
  
  useFrame(() => {
    if (planeRef.current && frameRef.current) {
      // Update position for the details panel
      if (frameRef.current) {
        setPosition(frameRef.current.position.clone());
      }
      
      // Show details when active or hovered
      setDetailsVisible(isActiveRef.current || hoveredRef.current);
      
      // Scale based on active status or hover
      let targetScale = 1;
      if (isActiveRef.current) {
        targetScale = 1.2; // Larger when active
      } else if (hoveredRef.current) {
        targetScale = 1.1; // Medium when hovered
      }
      
      // Apply smooth scaling
      if (planeRef.current) {
        planeRef.current.scale.x = THREE.MathUtils.lerp(planeRef.current.scale.x, targetScale, 0.1);
        planeRef.current.scale.y = THREE.MathUtils.lerp(planeRef.current.scale.y, targetScale, 0.1);
      }
      
      // Gentle floating animation
      if (frameRef.current && !isActiveRef.current && !hoveredRef.current) {
        frameRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.0005;
      }
    }
  });
  
  // Handle project click
  const handleProjectClick = () => {
    window.open(project.url, '_blank');
  };
  
  return (
    <group>
      <group
        ref={frameRef}
        position={[project.position[0], project.position[1], project.position[2]]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Project frame */}
        <mesh ref={planeRef}>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial 
            map={texture}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Frame border */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[3.2, 2.2]} />
          <meshStandardMaterial 
            color={project.color} 
            metalness={0.6}
            emissive={project.color}
            emissiveIntensity={isActiveRef.current ? 0.8 : (hoveredRef.current ? 0.5 : 0.2)}
          />
        </mesh>
        
        {/* Project title */}
        <Text
          position={[0, -1.3, 0]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {project.title}
        </Text>
      </group>
      
      {/* Project details panel */}
      <ProjectDetails 
        project={project} 
        visible={detailsVisible} 
        position={position}
        onClick={handleProjectClick}
      />
    </group>
  );
};

const ProjectPortals = ({ activeProjectIndex = -1 }: { activeProjectIndex?: number }) => {
  return (
    <group>
      {projects.map((project, index) => (
        <ProjectFrame
          key={project.id} 
          project={project} 
          animationDelay={0.2 * index}
          isActive={index === activeProjectIndex}
        />
      ))}
    </group>
  );
};

export default ProjectPortals;
