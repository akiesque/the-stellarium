/**
 * Full-screen R3F “scene” behind the portfolio.
 *
 * Flow (simple mental model):
 * 1. `<Canvas>` = WebGL surface + render loop.
 * 2. `perspectiveCamera` + `set({ camera })` = this camera is what you see (FOV, aspect, near/far).
 * 3. Lights + `primitive object={gltf.scene}` = your VRM is part of the same scene graph.
 * 4. `useFrame` runs every frame: here we only lerp the camera when `activeTab` changes (no scroll).
 */
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";

import minamiUrl from "../assets/VRM/Minami.vrm?url";

type VRMBackgroundProps = {
  /** Portfolio tab id from `PortfolioPage`; omit on other routes (camera stays on “home”). */
  activeTab?: string;
};

/** Where the camera sits and what it looks at for each tab (world space, meters). */
const CAMERA_BY_TAB: Record<
  string,
  { position: THREE.Vector3Tuple; target: THREE.Vector3Tuple }
> = {
  home: { position: [0, 1.12, 2.35], target: [0, 0.92, 0] },
  projects: { position: [-2.15, 1.12, 1.55], target: [0, 0.92, 0] },
  gallery: { position: [2.15, 1.12, 1.55], target: [0, 0.92, 0] },
  contact: { position: [0, 0.88, 2.05], target: [0, 0.78, 0] },
};

function tabCamera(tab: string | undefined) {
  const key = tab && tab in CAMERA_BY_TAB ? tab : "home";
  return CAMERA_BY_TAB[key] ?? CAMERA_BY_TAB.home;
}

/** One perspective camera, registered as default; keeps `aspect` in sync with the canvas. */
function RegisterPerspectiveCamera() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const set = useThree((s) => s.set);
  const invalidate = useThree((s) => s.invalidate);
  const { width, height } = useThree((s) => s.size);

  useLayoutEffect(() => {
    const camera = camRef.current;
    if (!camera) return;
    set({ camera });
  }, [set]);

  useEffect(() => {
    const camera = camRef.current;
    if (!camera) return;
    camera.aspect = height > 0 ? width / height : 1;
    camera.fov = 40;
    camera.near = 0.05;
    camera.far = 80;
    camera.updateProjectionMatrix();
    invalidate();
  }, [width, height, invalidate]);

  return (
    <perspectiveCamera
      ref={camRef}
      position={[0, 1.12, 2.35]}
      fov={40}
      near={0.05}
      far={80}
    />
  );
}

/** Smoothly moves the active camera toward the preset for the current tab. */
function CameraFollowsTab({ activeTab }: { activeTab?: string }) {
  const camera = useThree((s) => s.camera);
  const pos = useRef(
    new THREE.Vector3().fromArray(tabCamera(activeTab).position),
  );
  const target = useRef(
    new THREE.Vector3().fromArray(tabCamera(activeTab).target),
  );
  const goalPos = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const cfg = tabCamera(activeTab);
    goalPos.current.fromArray(cfg.position);
    goalTarget.current.fromArray(cfg.target);
    const k = 1 - Math.exp(-delta * 2.2);
    pos.current.lerp(goalPos.current, k);
    target.current.lerp(goalTarget.current, k);
    camera.position.copy(pos.current);
    camera.lookAt(target.current);
  });

  return null;
}

/** Loads the VRM once, centers it on the floor (same idea as VRM lab framing). */
function PortfolioVrm() {
  const gltf = useLoader(GLTFLoader, minamiUrl, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });
  const vrm = gltf.userData.vrm as VRM | undefined;

  useLayoutEffect(() => {
    const root = gltf.scene;
    if (root.userData.vrmPortfolioFramed) return;
    root.userData.vrmPortfolioFramed = true;
    root.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);
    root.updateMatrixWorld(true);

    const floorBox = new THREE.Box3().setFromObject(root);
    root.position.y -= floorBox.min.y;
    root.updateMatrixWorld(true);
  }, [gltf.scene]);

  useFrame((_, delta) => {
    vrm?.update(delta);
  });

  return <primitive object={gltf.scene} />;
}

function BackgroundScene({ activeTab }: VRMBackgroundProps) {
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    scene.background = null;
  }, [scene]);

  return (
    <>
      <RegisterPerspectiveCamera />
      <CameraFollowsTab activeTab={activeTab} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2.5, 5, 3]} intensity={0.85} />
      <Suspense fallback={null}>
        <PortfolioVrm />
      </Suspense>
    </>
  );
}

export default function VRMBackground({ activeTab }: VRMBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 isolate pointer-events-none" aria-hidden>
      <Canvas
        className="h-full w-full"
        frameloop="always"
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearColor(0x000000, 0);
        }}
        dpr={[1, 2]}
      >
        <BackgroundScene activeTab={activeTab} />
      </Canvas>
    </div>
  );
}
