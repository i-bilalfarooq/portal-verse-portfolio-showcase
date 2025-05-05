
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface GateEntranceProps {
  onOpen: () => void;
}

const GateEntrance = ({ onOpen }: GateEntranceProps) => {
  const leftGateRef = useRef<THREE.Mesh>(null);
  const rightGateRef = useRef<THREE.Mesh>(null);
  const [opening, setOpening] = useState(false);
  
  useFrame(() => {
    if (opening) {
      if (leftGateRef.current && rightGateRef.current) {
        // This is just a placeholder for the animation
        // The actual animation will be done with GSAP
      }
    }
  });
  
  const handleOpen = () => {
    setOpening(true);
    
    if (leftGateRef.current && rightGateRef.current) {
      // Animate left gate moving left
      gsap.to(leftGateRef.current.position, {
        x: -3,
        duration: 2,
        ease: "power2.inOut"
      });
      
      // Animate right gate moving right
      gsap.to(rightGateRef.current.position, {
        x: 3,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          setTimeout(onOpen, 500);
        }
      });
    }
  };
  
  return (
    <group onClick={handleOpen}>
      {/* Left Gate */}
      <mesh ref={leftGateRef} position={[-0.5, 0, 0]} castShadow>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color="#444" emissive="#00FEFE" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Right Gate */}
      <mesh ref={rightGateRef} position={[0.5, 0, 0]} castShadow>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color="#444" emissive="#00FEFE" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Entrance Text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color="#00FEFE"
        anchorX="center"
        anchorY="middle"
      >
        Click to Enter
      </Text>
    </group>
  );
};

export default GateEntrance;
