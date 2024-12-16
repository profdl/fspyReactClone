import React, { useEffect, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { TextureLoader } from 'three';
import { useStore } from '../store/useStore';

const ImagePlane: React.FC<{ url: string }> = ({ url }) => {
  const texture = useLoader(TextureLoader, url);
  
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial map={texture} transparent opacity={0.8} />
    </mesh>
  );
};

const Scene: React.FC = () => {
  const imageUrl = useStore((state) => state.imageUrl);
  const axisLines = useStore((state) => state.axisLines);
  const updateCamera = useStore((state) => state.updateCamera);

  // Calculate camera position from axis lines
  useEffect(() => {
    if (axisLines.length === 3) {
      // Basic camera position estimation (this will be improved)
      const xLine = axisLines.find(l => l.color === 'red');
      const yLine = axisLines.find(l => l.color === 'green');
      const zLine = axisLines.find(l => l.color === 'blue');

      if (xLine && yLine && zLine) {
        // Calculate a rough camera position based on the vanishing points
        const xDir = {
          x: xLine.end.x - xLine.start.x,
          y: xLine.end.y - xLine.start.y,
        };
        const yDir = {
          x: yLine.end.x - yLine.start.x,
          y: yLine.end.y - yLine.start.y,
        };
        
        // Estimate camera height based on line lengths
        const height = Math.max(
          Math.sqrt(xDir.x * xDir.x + xDir.y * xDir.y),
          Math.sqrt(yDir.x * yDir.x + yDir.y * yDir.y)
        ) / 100;

        updateCamera({
          position: [0, height * 5, height * 5],
          fov: 50,
        });
      }
    }
  }, [axisLines, updateCamera]);

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Grid
        args={[20, 20]}
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        cellSize={1}
        cellThickness={1}
        cellColor="#6b7280"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#374151"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      {imageUrl && <ImagePlane url={imageUrl} />}
      
      {/* Axis helpers */}
      <axesHelper args={[5]} />
    </>
  );
};

export const ThreeScene: React.FC = () => {
  const camera = useStore((state) => state.camera);

  return (
    <div className="w-full h-[500px] border border-gray-300 rounded-lg overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera
          makeDefault
          position={camera.position}
          fov={camera.fov}
        />
        <Scene />
      </Canvas>
    </div>
  );
};