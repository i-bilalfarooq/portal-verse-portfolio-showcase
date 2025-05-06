
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Lobby = () => {
  const lobbyRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const floorRef = useRef<THREE.Mesh>(null);
  const platformRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Create more particles for a better atmosphere
  const particlesCount = 800;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  
  // Create a more interesting particle distribution
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    
    // Create a dome-like distribution of particles
    const radius = 15 * Math.random();
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + (Math.random() * 5);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Add color variation - mostly cyan with occasional pink
    const isAccent = Math.random() > 0.9;
    if (isAccent) {
      // Pink particles
      colors[i3] = 1;
      colors[i3 + 1] = 0;
      colors[i3 + 2] = 1;
    } else {
      // Cyan particles with slight variation
      colors[i3] = 0;
      colors[i3 + 1] = Math.random() * 0.4 + 0.6; // 0.6-1.0
      colors[i3 + 2] = Math.random() * 0.4 + 0.6; // 0.6-1.0
    }
  }
  
  useEffect(() => {
    // Fix GSAP plugin issues
    if (!gsap.globalTimeline.getChildren().length) {
      gsap.registerPlugin();
    }
    
    // More dramatic entry animations
    if (floorRef.current) {
      floorRef.current.position.y = -30;
      floorRef.current.position.z = 30;
      
      gsap.to(floorRef.current.position, {
        y: -2,
        z: 0,
        duration: 2.5,
        ease: "power3.out"
      });
    }
    
    // Platform comes from below with a slight bounce
    if (platformRef.current) {
      platformRef.current.position.y = -30;
      
      gsap.to(platformRef.current.position, {
        y: -1.5,
        duration: 3,
        ease: "elastic.out(1, 0.5)"
      });
    }
    
    // Glow effect animation
    if (glowRef.current) {
      glowRef.current.scale.set(0, 0, 0);
      
      gsap.to(glowRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 3.5,
        delay: 2,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      
      // Add more dynamic movement to particles
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const cycleOffset = i * 0.01;
        
        // Create gentle wave-like motions in different directions
        positions[i3] += Math.sin(clock.getElapsedTime() * 0.2 + cycleOffset) * 0.002;
        positions[i3 + 1] += Math.cos(clock.getElapsedTime() * 0.1 + cycleOffset) * 0.002;
        positions[i3 + 2] += Math.sin(clock.getElapsedTime() * 0.15 + cycleOffset) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Add subtle floating movement to the entire lobby
    if (lobbyRef.current) {
      lobbyRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
    
    // Animate the platform glow
    if (glowRef.current) {
      glowRef.current.rotation.z += 0.001;
      const intensity = 0.2 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });
  
  return (
    <group ref={lobbyRef}>
      {/* Floor with grid */}
      <mesh 
        ref={floorRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]} 
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#111" 
          metalness={0.8} 
          roughness={0.3}
          emissive="#00FEFE"
          emissiveIntensity={0.05}
        />
        
        {/* Grid pattern on floor */}
        <mesh rotation={[0, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[50, 50, 50, 50]} />
          <meshBasicMaterial 
            wireframe
            color="#00FEFE"
            transparent
            opacity={0.15}
          />
        </mesh>
      </mesh>
      
      {/* Advanced particles system with color */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particlesCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.6}
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
          color="#1A1A1A" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#00FEFE"
          emissiveIntensity={0.15}
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
        
        {/* Additional design elements */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`platform-detail-${i}`} 
                position={[
                  4.8 * Math.cos(i * Math.PI / 4), 
                  0.15, 
                  4.8 * Math.sin(i * Math.PI / 4)
                ]}>
            <boxGeometry args={[0.3, 0.1, 0.3]} />
            <meshStandardMaterial 
              color="#00FEFE"
              emissive="#00FEFE"
              emissiveIntensity={0.7}
            />
          </mesh>
        ))}
      </mesh>
      
      {/* Ground glow effect */}
      <mesh 
        ref={glowRef}
        position={[0, -1.48, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial 
          color="#00FEFE"
          emissive="#00FEFE"
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Project path indicators - now styled as spotlight beams */}
      {[
        { pos: [-4, -1.45, -2], size: [2, 10] },
        { pos: [0, -1.45, -6], size: [2, 10] },
        { pos: [4, -1.45, -10], size: [2, 10] }
      ].map((path, index) => (
        <group key={`path-${index}`} position={[path.pos[0], path.pos[1], path.pos[2]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[path.size[0], path.size[1]]} />
            <meshBasicMaterial 
              color="#00FEFE" 
              transparent={true} 
              opacity={0.03} 
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Add a small spotlight effect at the project location */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <circleGeometry args={[1.5, 32]} />
            <meshBasicMaterial 
              color="#00FEFE" 
              transparent={true} 
              opacity={0.15} 
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Lobby;
