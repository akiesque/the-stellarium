import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Html } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
  type VRMAnimation,
} from "@pixiv/three-vrm-animation";

import minamiUrl from "../assets/VRM/Minami.vrm?url";
import {
  TAB_ANIMATIONS,
  getPortfolioTabSceneConfig,
  portfolioTabFromRoute,
  resolveCameraFov,
  type PortfolioTabId,
} from "../vrm/portfolioTabAnimations";
import { loadMixamoAnimation } from "../utils/loadMixamoAnim";
import {
  applySilhouetteToVrmRoot,
  createVrmSilhouetteMaterial,
  restoreVrmSilhouetteMaterials,
} from "./ui/VRMShade";
import { applyVrmSpringWindForces } from "./ui/WindEffect";
import Loader from "./ui/Loader";

type VRMBackgroundProps = {
  activeTab?: string;
};

const PORTFOLIO_SILHOUETTE_COLOR = "#0d9488";

/** `Html` Y offset inside framed VRM group (feet at y≈0) — roughly head height. */
const PORTFOLIO_LOADER_Y_MODEL_SPACE = 1.48;
/** Before the mesh exists (Suspense), world-space Y near camera look-at for home tab. */
const PORTFOLIO_LOADER_Y_PRELOAD = 1.14;

const CAMERA_TWEEN = {
  duration: 1.15,
  ease: "power2.inOut" as const,
};

/** Default scene camera: GSAP tweens position + look-at when `activeTab` changes. */
function PortfolioPerspectiveCamera({ activeTab }: { activeTab?: string }) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const lookAtRef = useRef(new THREE.Vector3(0, 0.92, 0));
  const set = useThree((s) => s.set);
  const invalidate = useThree((s) => s.invalidate);
  const { width, height } = useThree((s) => s.size);
  const prevTabId = useRef<PortfolioTabId | null>(null);

  useLayoutEffect(() => {
    const camera = camRef.current;
    if (!camera) return;
    set({ camera });
  }, [set]);

  useEffect(() => {
    const camera = camRef.current;
    if (!camera) return;
    camera.aspect = height > 0 ? width / height : 1;
    camera.near = 0.05;
    camera.far = 80;
    camera.updateProjectionMatrix();
    invalidate();
  }, [width, height, invalidate]);

  useLayoutEffect(() => {
    const camera = camRef.current;
    if (!camera) return;
    const tabId = portfolioTabFromRoute(activeTab);
    const cfg = getPortfolioTabSceneConfig(tabId).camera;
    camera.fov = resolveCameraFov(tabId);
    camera.position.set(cfg.position[0], cfg.position[1], cfg.position[2]);
    lookAtRef.current.set(cfg.target[0], cfg.target[1], cfg.target[2]);
    camera.lookAt(lookAtRef.current);
    camera.updateProjectionMatrix();
    prevTabId.current = tabId;
    invalidate();
    // One-shot: first paint uses the tab visible when the canvas mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const camera = camRef.current;
    if (!camera) return;

    const tabId = portfolioTabFromRoute(activeTab);
    if (prevTabId.current === tabId) return;
    prevTabId.current = tabId;

    const cfg = getPortfolioTabSceneConfig(tabId).camera;
    const endFov = resolveCameraFov(tabId);
    const endPos = {
      x: cfg.position[0],
      y: cfg.position[1],
      z: cfg.position[2],
    };
    const endLook = {
      x: cfg.target[0],
      y: cfg.target[1],
      z: cfg.target[2],
    };

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(lookAtRef.current);
    gsap.killTweensOf(camera);

    gsap.to(camera.position, {
      ...endPos,
      duration: CAMERA_TWEEN.duration,
      ease: CAMERA_TWEEN.ease,
    });
    gsap.to(lookAtRef.current, {
      ...endLook,
      duration: CAMERA_TWEEN.duration,
      ease: CAMERA_TWEEN.ease,
      onUpdate: () => {
        camera.lookAt(lookAtRef.current);
        invalidate();
      },
    });
    gsap.to(camera, {
      fov: endFov,
      duration: CAMERA_TWEEN.duration,
      ease: CAMERA_TWEEN.ease,
      onUpdate: () => {
        camera.updateProjectionMatrix();
        invalidate();
      },
    });
  }, [activeTab, invalidate]);

  useFrame(() => {
    const camera = camRef.current;
    if (!camera) return;
    camera.lookAt(lookAtRef.current);
  });

  const initialFov = resolveCameraFov(portfolioTabFromRoute(activeTab));

  return (
    <perspectiveCamera
      ref={camRef}
      position={[0, 1.12, 2.35]}
      fov={initialFov}
      near={0.05}
      far={80}
    />
  );
}

type PortfolioVrmProps = {
  activeTab?: string;
};

/** DOM via drei `Html` — safe inside R3F (unlike raw SVG in Canvas). */
function PortfolioVrmLoadFallback({
  positionY = PORTFOLIO_LOADER_Y_MODEL_SPACE,
}: {
  positionY?: number;
}) {
  return (
    <Html
      center
      transform={false}
      position={[0, positionY, 0]}
      occlude={false}
      distanceFactor={0.48}
      style={{ pointerEvents: "none" }}
    >
      <Loader />
    </Html>
  );
}

function PortfolioVrm({ activeTab }: PortfolioVrmProps) {
  const gltf = useLoader(GLTFLoader, minamiUrl, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });
  const vrm = gltf.userData.vrm as VRM | undefined;

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const framedRef = useRef(false);
  const rootWrapRef = useRef<THREE.Group>(null);

  const silhouetteMaterial = useMemo(
    () => createVrmSilhouetteMaterial(PORTFOLIO_SILHOUETTE_COLOR),
    [],
  );

  const [clipsByTab, setClipsByTab] = useState<Map<
    PortfolioTabId,
    THREE.AnimationClip
  > | null>(null);

  const clipsReady = clipsByTab !== null;

  useLayoutEffect(() => {
    const root = gltf.scene;
    const wrap = rootWrapRef.current;
    const wrapForCleanup = wrap;
    if (!framedRef.current && wrap) {
      framedRef.current = true;
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root);
      const center = box.getCenter(new THREE.Vector3());
      wrap.position.set(-center.x, -box.min.y, -center.z);
      wrap.updateMatrixWorld(true);
    }

    applySilhouetteToVrmRoot(root, silhouetteMaterial);
    return () => {
      restoreVrmSilhouetteMaterials(root);
      framedRef.current = false;
      if (wrapForCleanup) wrapForCleanup.position.set(0, 0, 0);
    };
  }, [gltf.scene, silhouetteMaterial]);

  useEffect(() => {
    if (!vrm || !clipsReady) return;
    const mixer = new THREE.AnimationMixer(gltf.scene);
    mixerRef.current = mixer;
    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [vrm, gltf.scene, clipsReady]);

  useEffect(() => {
    if (!vrm) return;
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

    const map = new Map<PortfolioTabId, THREE.AnimationClip>();

    void (async () => {
      for (const def of TAB_ANIMATIONS) {
        if (cancelled) return;
        try {
          if (def.kind === "vrma") {
            const g = await loader.loadAsync(def.url);
            const list = g.userData.vrmAnimations as VRMAnimation[] | undefined;
            const vrma = list?.[0];
            if (!vrma) continue;
            map.set(def.tab, createVRMAnimationClip(vrma, vrm));
          } else {
            const clip = await loadMixamoAnimation(def.url, vrm);
            map.set(def.tab, clip);
          }
        } catch {
          /* skip broken clip */
        }
      }
      if (!cancelled) setClipsByTab(map);
    })();

    return () => {
      cancelled = true;
    };
  }, [vrm]);

  useEffect(() => {
    const mixer = mixerRef.current;
    if (!mixer || !clipsByTab?.size) return;

    const tabId = portfolioTabFromRoute(activeTab);
    const clip = clipsByTab.get(tabId);
    if (!clip) return;

    if (actionRef.current) {
      actionRef.current.stop();
      actionRef.current = null;
    }

    const action = mixer.clipAction(clip);
    action.reset();
    const sceneCfg = getPortfolioTabSceneConfig(tabId);
    const playOnce = sceneCfg.playOnce !== false;
    if (playOnce) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    }
    action.play();
    actionRef.current = action;
  }, [activeTab, clipsByTab]);

  useFrame((state, delta) => {
    if (!clipsReady) return;
    const mixer = mixerRef.current;
    if (mixer) mixer.update(delta);
    if (vrm) {
      const t = state.clock.elapsedTime;
      applyVrmSpringWindForces(vrm, t);
      vrm.update(delta);
    }
  });

  return (
    <group ref={rootWrapRef}>
      <primitive object={gltf.scene} visible={clipsReady} />
      {!clipsReady ? <PortfolioVrmLoadFallback /> : null}
    </group>
  );
}

function BackgroundScene({ activeTab }: VRMBackgroundProps) {
  return (
    <>
      <PortfolioPerspectiveCamera activeTab={activeTab} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2.5, 5, 3]} intensity={0.85} />
      <Suspense
        fallback={
          <PortfolioVrmLoadFallback positionY={PORTFOLIO_LOADER_Y_PRELOAD} />
        }
      >
        <PortfolioVrm activeTab={activeTab} />
      </Suspense>
    </>
  );
}

export default function VRMBackground({ activeTab }: VRMBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 isolate pointer-events-none" aria-hidden>
      <Canvas
        className="h-full w-full touch-none"
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
