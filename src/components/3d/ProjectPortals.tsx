
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
      if (visible && groupRef.current.scale.x < 0.95) {
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.1));
      } else if (!visible && groupRef.current.scale.x > 0.05) {
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 0, 0.1));
      }
      
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
      visible={visible}
      scale={visible ? [1, 1, 1] : [0, 0, 0]}
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

const ProjectPortal = ({ project, animationDelay = 0, cameraPosition }: { 
  project: ProjectData, 
  animationDelay?: number,
  cameraPosition: THREE.Vector3
}) => {
  const portalRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState(new THREE.Vector3(...project.position));
  const texture = useTexture('/placeholder.svg'); // Use placeholder as fallback
  const [detailsVisible, setDetailsVisible] = useState(false);
  const { camera } = useThree();
  
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
  
  useFrame(({ clock }) => {
    if (sphereRef.current && portalRef.current) {
      // Continuous rotation
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      
      // Update position for the details panel
      if (portalRef.current) {
        setPosition(portalRef.current.position.clone());
      }
      
      // Calculate distance from camera for scaling effect
      const distance = camera.position.distanceTo(new THREE.Vector3(...project.position));
      const isInFocus = distance < 7; // If camera is close to this project
      
      // Show details when in focus or hovered
      setDetailsVisible(isInFocus || hovered);
      
      // Scale based on proximity to camera
      let targetScale = 1;
      if (isInFocus) {
        targetScale = 1.5;
      } else if (hovered) {
        targetScale = 1.3;
      }
      
      // Apply smooth scaling
      sphereRef.current.scale.setScalar(THREE.MathUtils.lerp(
        sphereRef.current.scale.x,
        targetScale,
        0.1
      ));
      
      // Adjust emissive intensity based on focus/hover
      const material = sphereRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.emissiveIntensity = THREE.MathUtils.lerp(
          material.emissiveIntensity,
          isInFocus ? 0.9 : (hovered ? 0.8 : 0.3),
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
        {/* Project portal sphere - don't open on click, only through the button */}
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

const ProjectPortals = () => {
  const { camera } = useThree();
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3());
  
  useFrame(() => {
    // Update camera position for child components
    setCameraPosition(camera.position.clone());
  });
  
  return (
    <group>
      {projects.map((project, index) => (
        <ProjectPortal 
          key={project.id} 
          project={project} 
          animationDelay={0.2 * index}
          cameraPosition={cameraPosition}
        />
      ))}
    </group>
  );
};

export default ProjectPortals;
