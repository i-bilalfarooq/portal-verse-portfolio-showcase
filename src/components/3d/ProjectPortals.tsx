
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  color: string;
  position: [number, number, number];
}

const projects: ProjectData[] = [
  {
    id: 'htmllab',
    title: 'HTMLLab',
    description: 'AI-Based HTML and CSS Generator',
    color: '#4285F4', // Google blue
    position: [-2, 0, 0]
  },
  {
    id: 'waqt',
    title: 'Waqt',
    description: 'E-Commerce Website for a watch brand',
    color: '#FBBC04', // Google yellow
    position: [0, 0, -2]
  },
  {
    id: 'datasouk',
    title: 'DataSouk',
    description: 'Blockchain-Based B2B Data Sharing Platform',
    color: '#34A853', // Google green
    position: [2, 0, 0]
  }
];

const ProjectPortal = ({ project }: { project: ProjectData }) => {
  const portalRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  useFrame(({ clock }) => {
    if (portalRef.current) {
      portalRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      
      if (hovered) {
        portalRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 5) * 0.05);
      } else {
        portalRef.current.scale.setScalar(1);
      }
    }
  });
  
  return (
    <group
      position={project.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      {/* Project portal */}
      <mesh ref={portalRef} castShadow>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color={project.color} 
          metalness={0.5} 
          roughness={0.2} 
          emissive={project.color} 
          emissiveIntensity={hovered ? 0.8 : 0.3} 
        />
      </mesh>
      
      {/* Tooltip */}
      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-gray-900/80 backdrop-blur-sm p-2 rounded-md text-white border border-[#00FEFE] w-48">
            <h3 className="font-bold text-[#00FEFE]">{project.title}</h3>
            <p className="text-sm text-gray-300">{project.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

const ProjectPortals = () => {
  return (
    <group>
      {projects.map(project => (
        <ProjectPortal key={project.id} project={project} />
      ))}
    </group>
  );
};

export default ProjectPortals;
