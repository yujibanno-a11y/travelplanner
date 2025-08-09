import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const Globe: React.FC = () => {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2}>
      <MeshDistortMaterial
        color="#00F5D4"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        emissive="#00F5D4"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
};

const StaticGlobeSVG: React.FC = () => (
  <motion.svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    className="text-primary-500"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="globeGradient" cx="0.3" cy="0.3">
        <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#00F5D4" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.1" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <motion.circle
      cx="100"
      cy="100"
      r="80"
      fill="url(#globeGradient)"
      stroke="#00F5D4"
      strokeWidth="2"
      filter="url(#glow)"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    />
    
    {/* Grid lines */}
    <g stroke="#00F5D4" strokeWidth="1" opacity="0.6">
      <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" />
      <ellipse cx="100" cy="100" rx="80" ry="20" fill="none" />
      <ellipse cx="100" cy="100" rx="60" ry="80" fill="none" />
      <ellipse cx="100" cy="100" rx="30" ry="80" fill="none" />
      <line x1="20" y1="100" x2="180" y2="100" />
      <line x1="100" y1="20" x2="100" y2="180" />
    </g>
  </motion.svg>
);

interface AnimatedGlobeProps {
  className?: string;
}

const AnimatedGlobe: React.FC<AnimatedGlobeProps> = ({ className = '' }) => {
  const { reducedMotion } = useTheme();
  const [use3D, setUse3D] = React.useState(true);

  React.useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl || reducedMotion) {
      setUse3D(false);
    }
  }, [reducedMotion]);

  if (!use3D) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <StaticGlobeSVG />
      </div>
    );
  }

  return (
    <div className={`${className}`} style={{ height: '200px' }}>
      <Suspense fallback={<StaticGlobeSVG />}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={300} depth={60} count={1000} factor={7} saturation={0} fade />
          <Globe />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default AnimatedGlobe;