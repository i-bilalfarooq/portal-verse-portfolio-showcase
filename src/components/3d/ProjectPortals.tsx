
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
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
    color: '#4285F4', // Google blue
    position: [-4, 0, -2], // Positioned better for scroll navigation
    image: '/placeholder.svg',
    url: 'https://htmllab.run.place/'
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'Blockchain-Based B2B Data Sharing Platform',
    color: '#34A853', // Google green
    position: [0, 0, -6], // In the middle distance for scroll navigation
    image: '/placeholder.svg',
    url: 'https://datasouk.great-site.net/'
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'E-Commerce Website for a watch brand',
    color: '#FBBC04', // Google yellow
    position: [4, 0, -10], // Furthest back for scroll navigation
    image: '/placeholder.svg',
    url: 'https://waqt.publicvm.com/'
  }
];

// Project details component that appears on hover or when in focus
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
  
  // Update ref when prop changes
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);
  
  // Fix GSAP plugin issues
  useEffect(() => {
    if (!gsap.globalTimeline.getChildren().length) {
      gsap.registerPlugin();
    }
  }, []);
  
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
      scale={[0.01, 0.01, 0.01]} // Start almost invisible for smooth animation
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
        font="/fonts/Inter-Bold.woff" // Assuming you have this font
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
      
      {/* View Project Button - now bigger and with hover effect */}
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
          font="/fonts/Inter-Bold.woff" // Assuming you have this font
        >
          View Project
        </Text>
      </group>
    </group>
  );
};

const ProjectPortal = ({ 
  project, 
  animationDelay = 0, 
  isActive
}: { 
  project: ProjectData, 
  animationDelay?: number,
  isActive: boolean
}) => {
  const portalRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState(new THREE.Vector3(...project.position));
  const texture = useTexture('/placeholder.svg'); // Use placeholder as fallback
  const [detailsVisible, setDetailsVisible] = useState(false);
  const { camera } = useThree();
  const isActiveRef = useRef(isActive);
  const hoveredRef = useRef(hovered);
  
  // Update refs when props change
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);
  
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);
  
  // Fix GSAP plugin issues
  useEffect(() => {
    if (!gsap.globalTimeline.getChildren().length) {
      gsap.registerPlugin();
    }
  }, []);
  
  // Entry animation
  useEffect(() => {
    if (portalRef.current) {
      portalRef.current.position.y = 10;
      gsap.to(portalRef.current.position, {
        y: project.position[1],
        duration: 1.5,
        delay: animationDelay,
        ease: "elastic.out(1, 0.75)"
      });
    }
  }, [animationDelay, project.position]);
  
  useFrame(() => {
    if (sphereRef.current && portalRef.current) {
      // Continuous rotation
      sphereRef.current.rotation.y += 0.005;
      
      // Update position for the details panel
      if (portalRef.current) {
        setPosition(portalRef.current.position.clone());
      }
      
      // Show details when active or hovered
      setDetailsVisible(isActiveRef.current || hoveredRef.current);
      
      // Scale based on active status or hover
      let targetScale = 1;
      if (isActiveRef.current) {
        targetScale = 1.5; // Larger when active (scrolled to)
      } else if (hoveredRef.current) {
        targetScale = 1.3; // Medium when hovered
      }
      
      // Apply smooth scaling
      if (sphereRef.current) {
        sphereRef.current.scale.x = THREE.MathUtils.lerp(sphereRef.current.scale.x, targetScale, 0.1);
        sphereRef.current.scale.y = THREE.MathUtils.lerp(sphereRef.current.scale.y, targetScale, 0.1);
        sphereRef.current.scale.z = THREE.MathUtils.lerp(sphereRef.current.scale.z, targetScale, 0.1);
      }
      
      // Adjust emissive intensity based on focus/hover
      const material = sphereRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        const targetIntensity = isActiveRef.current ? 0.9 : (hoveredRef.current ? 0.8 : 0.3);
        material.emissiveIntensity = THREE.MathUtils.lerp(
          material.emissiveIntensity,
          targetIntensity,
          0.1
        );
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
        ref={portalRef}
        position={[project.position[0], project.position[1], project.position[2]]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Project portal sphere */}
        <mesh ref={sphereRef} castShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial 
            color={project.color} 
            metalness={0.6} 
            roughness={0.2} 
            emissive={project.color} 
            emissiveIntensity={0.3}
            map={texture}
          />
          
          {/* Orbit rings */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.02, 16, 100]} />
            <meshStandardMaterial color="#fff" transparent opacity={0.3} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.1, 0.02, 16, 100]} />
            <meshStandardMaterial color="#00FEFE" transparent opacity={0.3} />
          </mesh>
        </mesh>
        
        {/* Project name always visible */}
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.2}
          color="#00FEFE"
          anchorX="center"
          anchorY="middle"
        >
          {project.title}
        </Text>
      </group>
      
      {/* Project details panel - separate from the sphere for better interaction */}
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
        <ProjectPortal 
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
