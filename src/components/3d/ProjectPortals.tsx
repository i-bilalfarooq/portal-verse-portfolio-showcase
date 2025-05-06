
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  color: string;
  position: [number, number, number];
  image: string;
}

const projects: ProjectData[] = [
  {
    id: 'htmllab',
    title: 'HTMLLab',
    description: 'AI-Based HTML and CSS Generator',
    color: '#4285F4', // Google blue
    position: [-2.5, 0, 0],
    image: '/placeholder.svg'
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'E-Commerce Website for a watch brand',
    color: '#FBBC04', // Google yellow
    position: [0, 0, -2.5],
    image: '/placeholder.svg'
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'Blockchain-Based B2B Data Sharing Platform',
    color: '#34A853', // Google green
    position: [2.5, 0, 0],
    image: '/placeholder.svg'
  }
];

const ProjectPortal = ({ project, animationDelay = 0 }: { project: ProjectData, animationDelay?: number }) => {
  const portalRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(project.image);
  
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
      
      {/* Project details on hover */}
      {hovered && (
        <Html
          position={[0, 0, 0]}
          center
          distanceFactor={10}
          className="pointer-events-none"
        >
          <div className="w-96 bg-gray-900/90 backdrop-blur-md p-4 rounded-md border border-[#00FEFE] text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#00FEFE]">{project.title}</h2>
            </div>
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-48 object-cover my-3 rounded"
            />
            <p className="text-sm mb-2">{project.description}</p>
            <a 
              href={`/work`} 
              className="inline-block bg-[#00FEFE] text-black px-4 py-2 rounded text-sm mt-2 pointer-events-auto hover:bg-[#FF00FF] hover:text-white transition-colors"
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
