import React, { useMemo } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GridHelper, Color, TextureLoader } from "three";
import { useStore } from "../store/useStore";

const CustomGrid: React.FC<{ centerZ: number }> = ({ centerZ }) => {
  const grid = new GridHelper(20, 20);
  const color1 = new Color(0x404040);
  const color2 = new Color(0x282828);

  if (grid.material instanceof Array) {
    grid.material[0].color = color1;
    grid.material[1].color = color2;
  }

  return <primitive object={grid} position={[0, 0, centerZ]} />;
};

const ImagePlane: React.FC<{
  url: string;
  onLoad: (aspect: number) => void;
}> = ({ url, onLoad }) => {
  const texture = useLoader(TextureLoader, url);

  const planeSize = useMemo(() => {
    if (!texture.image)
      return [10, 10, 1, 1] as [number, number, number, number];
    const aspectRatio = texture.image.width / texture.image.height;
    onLoad(aspectRatio);
    return [10 * aspectRatio, 10, 1, 1] as [number, number, number, number];
  }, [texture, onLoad]);

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={planeSize} />
      <meshStandardMaterial map={texture} transparent opacity={0.8} side={2} />
    </mesh>
  );
};

const Scene: React.FC<{ onAspectRatioChange: (aspect: number) => void }> = ({
  onAspectRatioChange,
}) => {
  const imageUrl = useStore((state) => state.imageUrl);
  const { camera } = useThree();

  const handleImageLoad = (aspect: number) => {
    onAspectRatioChange(aspect);
    if ("aspect" in camera) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
  };

  return (
    <>
      <OrbitControls enableDamping={false} minDistance={1} maxDistance={100} />

      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Debug cube at origin */}
      <mesh position={[0, 0, -5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      <CustomGrid centerZ={-5} />

      {imageUrl && <ImagePlane url={imageUrl} onLoad={handleImageLoad} />}
    </>
  );
};

export const ThreeScene: React.FC = () => {
  const camera = useStore((state) => state.camera);
  const [aspect, setAspect] = React.useState(16 / 9);

  const cameraProps = {
    position: camera?.position || [3, 3, 3],
    fov: camera?.fov || 75,
    near: 0.1,
    far: 1000,
  };

  const containerStyle = {
    width: "100%",
    paddingTop: `${(1 / aspect) * 100}%`,
    position: "relative" as const,
    backgroundColor: "black",
    border: "1px solid rgb(209, 213, 219)",
    borderRadius: "0.5rem",
    overflow: "hidden",
  };

  const canvasStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  return (
    <div style={containerStyle}>
      <div style={canvasStyle}>
        <Canvas camera={cameraProps}>
          <Scene onAspectRatioChange={setAspect} />
        </Canvas>
      </div>
    </div>
  );
};
