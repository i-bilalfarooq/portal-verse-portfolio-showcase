
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
    position: [-2.5, 0, 0],
    image: '/placeholder.svg',
    url: 'https://htmllab.run.place/'
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'E-Commerce Website for a watch brand',
    color: '#FBBC04', // Google yellow
    position: [0, 0, -2.5],
    image: '/placeholder.svg',
    url: 'https://waqt.publicvm.com/'
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'Blockchain-Based B2B Data Sharing Platform',
    color: '#34A853', // Google green
    position: [2.5, 0, 0],
    image: '/placeholder.svg',
    url: 'https://datasouk.great-site.net/'
  }
];

// Project details component that appears on hover
const ProjectDetails = ({ project, visible, position }: { 
  project: ProjectData, 
  visible: boolean,
  position: THREE.Vector3
}) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Make panel face the camera
      groupRef.current.quaternion.copy(camera.quaternion);
      
      // Animate visibility
      groupRef.current.scale.setScalar(visible ? 1 : 0);
      groupRef.current.visible = visible;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={[position.x, position.y + 1.5, position.z]}
      visible={visible}
      scale={visible ? 1 : 0}
    >
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial 
          color="#111" 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <Text
        position={[0, 0.4, 0.01]}
        color="#00FEFE"
        anchorX="center"
        anchorY="middle"
        fontSize={0.15}
      >
        {project.title}
      </Text>
      
      <Text
        position={[0, 0.15, 0.01]}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.08}
      >
        {project.description}
      </Text>
      
      {/* View Project Button */}
      <group position={[0, -0.3, 0.01]} onClick={() => window.open(project.url, '_blank')}>
        <mesh>
          <planeGeometry args={[1, 0.3]} />
          <meshStandardMaterial color="#00FEFE" />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          color="black"
          anchorX="center"
          anchorY="middle"
          fontSize={0.1}
        >
          View Project
        </Text>
      </group>
    </group>
  );
};

const ProjectPortal = ({ project, animationDelay = 0 }: { project: ProjectData, animationDelay?: number }) => {
  const portalRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState(new THREE.Vector3(...project.position));
  const texture = useTexture('/placeholder.svg'); // Use placeholder as fallback
  
  useEffect(() => {
    // Entry animation - start from above and animate down
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
    if (sphereRef.current) {
      // Continuous rotation
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      
      // Update position for the details panel
      if (portalRef.current) {
        setPosition(portalRef.current.position.clone());
      }
      
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
  
  return (
    <group>
      <group
        ref={portalRef}
        position={[project.position[0], project.position[1], project.position[2]]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => window.open(project.url, '_blank')}
      >
        {/* Project portal sphere */}
        <mesh ref={sphereRef} castShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial 
            color={project.color} 
            metalness={0.6} 
            roughness={0.2} 
            emissive={project.color} 
            emissiveIntensity={hovered ? 0.8 : 0.3}
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
          position={[0, 1.3, 0]}
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
        visible={hovered} 
        position={position}
      />
    </group>
  );
};

const ProjectPortals = () => {
  return (
    <group>
      {projects.map((project, index) => (
        <ProjectPortal 
          key={project.id} 
          project={project} 
          animationDelay={0.2 * index}
        />
      ))}
    </group>
  );
};

export default ProjectPortals;
