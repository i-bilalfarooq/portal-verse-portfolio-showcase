
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface GateProps {
  onOpen: () => void;
}

const Gate = ({ onOpen }: GateProps) => {
  const leftGateRef = useRef<THREE.Mesh>(null);
  const rightGateRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [opening, setOpening] = useState(false);
  
  // Register GSAP plugins at component level
  useEffect(() => {
    // Fix GSAP opacity plugin issues
    if (!gsap.globalTimeline.getChildren().length) {
      gsap.registerPlugin();
    }
  }, []);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
    
    if (hovered && !opening && leftGateRef.current && rightGateRef.current) {
      leftGateRef.current.scale.y = THREE.MathUtils.lerp(leftGateRef.current.scale.y, 1.05, 0.1);
      rightGateRef.current.scale.y = THREE.MathUtils.lerp(rightGateRef.current.scale.y, 1.05, 0.1);
    } else if (!opening && leftGateRef.current && rightGateRef.current) {
      leftGateRef.current.scale.y = THREE.MathUtils.lerp(leftGateRef.current.scale.y, 1, 0.1);
      rightGateRef.current.scale.y = THREE.MathUtils.lerp(rightGateRef.current.scale.y, 1, 0.1);
    }
  });
  
  const handleOpen = () => {
    if (opening) return;
    
    setOpening(true);
    
    if (leftGateRef.current && rightGateRef.current) {
      // Animate gate opening
      gsap.to(leftGateRef.current.position, {
        x: -3,
        duration: 1.5,
        ease: "power2.inOut"
      });
      
      gsap.to(rightGateRef.current.position, {
        x: 3,
        duration: 1.5,
        ease: "power2.inOut",
      });
      
      // Animate gate rotation for more dramatic effect
      gsap.to(leftGateRef.current.rotation, {
        y: -0.3,
        duration: 1.5,
        ease: "power2.inOut"
      });
      
      gsap.to(rightGateRef.current.rotation, {
        y: 0.3,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
          // Call onOpen with a slight delay for smoother transition
          setTimeout(onOpen, 300);
        }
      });
      
      // Hide text manually instead of using GSAP opacity
      if (textRef.current) {
        setTimeout(() => {
          if (textRef.current) {
            textRef.current.visible = false;
          }
        }, 500);
      }
    }
  };
  
  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleOpen}
    >
      {/* Left Gate Panel */}
      <mesh 
        ref={leftGateRef} 
        position={[-1, 0, 0]} 
        castShadow
      >
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#00FEFE" 
          emissiveIntensity={hovered ? 0.4 : 0.2} 
        />
        
        {/* Gate Details - Left */}
        <mesh position={[-0.5, 0, 0.01]}>
          <planeGeometry args={[0.05, 3.6]} />
          <meshStandardMaterial color="#00FEFE" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Circuit pattern on gate */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`left-circuit-${i}`} position={[-0.6 + (i % 2) * 0.7, 1.5 - i * 0.4, 0.01]}>
            <planeGeometry args={[0.4, 0.02]} />
            <meshStandardMaterial color="#00FEFE" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </mesh>
      
      {/* Right Gate Panel */}
      <mesh 
        ref={rightGateRef} 
        position={[1, 0, 0]} 
        castShadow
      >
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#00FEFE" 
          emissiveIntensity={hovered ? 0.4 : 0.2} 
        />
        
        {/* Gate Details - Right */}
        <mesh position={[0.5, 0, 0.01]}>
          <planeGeometry args={[0.05, 3.6]} />
          <meshStandardMaterial color="#00FEFE" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Circuit pattern on gate */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`right-circuit-${i}`} position={[-0.1 + (i % 2) * 0.7, 1.5 - i * 0.4, 0.01]}>
            <planeGeometry args={[0.4, 0.02]} />
            <meshStandardMaterial color="#00FEFE" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </mesh>
      
      {/* Entrance Text */}
      <group ref={textRef} position={[0, 0.1, 0.2]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.25}
          color="#00FEFE"
          anchorX="center"
          anchorY="middle"
        >
          PORTFOLIO GATE
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.15}
          color="#FF00FF"
          anchorX="center"
          anchorY="middle"
        >
          Click to Enter
        </Text>
      </group>
    </group>
  );
};

export default Gate;
