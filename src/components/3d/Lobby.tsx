
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Lobby = () => {
  const lobbyRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const floorRef = useRef<THREE.Mesh>(null);
  const platformRef = useRef<THREE.Mesh>(null);
  
  // Create particles for the atmosphere
  const particlesCount = 500;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 15;
    positions[i3 + 1] = (Math.random() - 0.5) * 15;
    positions[i3 + 2] = (Math.random() - 0.5) * 15;
  }
  
  useEffect(() => {
    // Start floor and platform from far away and animate them in
    if (floorRef.current) {
      floorRef.current.position.y = -30;
      floorRef.current.position.z = 30;
      
      gsap.to(floorRef.current.position, {
        y: -2,
        z: 0,
        duration: 2,
        ease: "power2.out"
      });
    }
    
    // Platform comes from below and far away
    if (platformRef.current) {
      platformRef.current.position.y = -30;
      platformRef.current.position.z = 30;
      
      gsap.to(platformRef.current.position, {
        y: -1.5,
        z: 0,
        duration: 2.3,
        ease: "power2.out"
      });
    }
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      
      // Add subtle movement to particles
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(clock.getElapsedTime() * 0.2 + i * 0.1) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Add subtle movement to the entire lobby
    if (lobbyRef.current) {
      lobbyRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });
  
  return (
    <group ref={lobbyRef}>
      {/* Floor */}
      <mesh 
        ref={floorRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]} 
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#111" 
          metalness={0.8} 
          roughness={0.3}
          emissive="#00FEFE"
          emissiveIntensity={0.05}
        />
        
        {/* Grid pattern on floor */}
        <mesh rotation={[0, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial 
            transparent
            opacity={0.3}
            wireframe
            color="#00FEFE"
          />
        </mesh>
      </mesh>
      
      {/* Ambient particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00FEFE"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Center platform */}
      <mesh 
        ref={platformRef} 
        position={[0, -1.5, 0]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[5, 5.5, 0.5, 32]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={0.7} 
          roughness={0.2}
          emissive="#00FEFE"
          emissiveIntensity={0.1}
        />
        
        {/* Platform edge glow */}
        <mesh position={[0, 0.26, 0]}>
          <torusGeometry args={[5, 0.05, 16, 100]} />
          <meshStandardMaterial 
            color="#00FEFE"
            emissive="#00FEFE"
            emissiveIntensity={1}
          />
        </mesh>
      </mesh>
    </group>
  );
};

export default Lobby;
