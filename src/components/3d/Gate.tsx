
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface GateProps {
  onOpen: () => void;
}

const Gate = ({ onOpen }: GateProps) => {
  const leftGateRef = useRef<THREE.Mesh>(null);
  const rightGateRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [opening, setOpening] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Make sure gate is properly positioned for mobile/desktop
    if (leftGateRef.current && rightGateRef.current) {
      const gateWidth = isMobile ? 1.5 : 2;
      leftGateRef.current.position.x = -gateWidth/2;
      rightGateRef.current.position.x = gateWidth/2;
    }
  }, [isMobile]);
  
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
      // Determine distance to move based on screen size
      const moveDistance = isMobile ? 2 : 3;
      
      // Animate gate opening
      gsap.to(leftGateRef.current.position, {
        x: -moveDistance,
        duration: 1.5,
        ease: "power2.inOut"
      });
      
      gsap.to(rightGateRef.current.position, {
        x: moveDistance,
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
          setTimeout(onOpen, 300);
        }
      });
      
      // Hide text
      if (textRef.current) {
        gsap.to(textRef.current.position, {
          y: -2,
          duration: 0.5
        });
        gsap.to(textRef.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.5
        });
      }
    }
  };
  
  // Adjust sizes for mobile
  const gateWidth = isMobile ? 1.5 : 2;
  const gateHeight = isMobile ? 3 : 4;
  const fontSize = isMobile ? 0.18 : 0.25;
  const smallFontSize = isMobile ? 0.12 : 0.15;
  
  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleOpen}
    >
      {/* Left Gate Panel */}
      <mesh 
        ref={leftGateRef} 
        position={[-gateWidth/2, 0, 0]} 
        castShadow
      >
        <planeGeometry args={[gateWidth, gateHeight]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#00FEFE" 
          emissiveIntensity={hovered ? 0.4 : 0.2} 
        />
        
        {/* Gate Details - Left */}
        <mesh position={[-gateWidth/4, 0, 0.01]}>
          <planeGeometry args={[0.05, gateHeight * 0.9]} />
          <meshStandardMaterial color="#00FEFE" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Circuit pattern on gate */}
        {[...Array(6)].map((_, i) => (
          <mesh key={`left-circuit-${i}`} position={[-(gateWidth/4) + (i % 2) * (gateWidth/3), gateHeight/3 - i * (gateHeight/8), 0.01]}>
            <planeGeometry args={[gateWidth/5, 0.02]} />
            <meshStandardMaterial color="#00FEFE" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </mesh>
      
      {/* Right Gate Panel */}
      <mesh 
        ref={rightGateRef} 
        position={[gateWidth/2, 0, 0]} 
        castShadow
      >
        <planeGeometry args={[gateWidth, gateHeight]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#00FEFE" 
          emissiveIntensity={hovered ? 0.4 : 0.2} 
        />
        
        {/* Gate Details - Right */}
        <mesh position={[gateWidth/4, 0, 0.01]}>
          <planeGeometry args={[0.05, gateHeight * 0.9]} />
          <meshStandardMaterial color="#00FEFE" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Circuit pattern on gate */}
        {[...Array(6)].map((_, i) => (
          <mesh key={`right-circuit-${i}`} position={[-(gateWidth/8) + (i % 2) * (gateWidth/3), gateHeight/3 - i * (gateHeight/8), 0.01]}>
            <planeGeometry args={[gateWidth/5, 0.02]} />
            <meshStandardMaterial color="#00FEFE" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </mesh>
      
      {/* Entrance Text */}
      <group ref={textRef} position={[0, 0.1, 0.2]}>
        <Text
          position={[0, 0, 0]}
          fontSize={fontSize}
          color="#00FEFE"
          anchorX="center"
          anchorY="middle"
        >
          PORTFOLIO GATE
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={smallFontSize}
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
