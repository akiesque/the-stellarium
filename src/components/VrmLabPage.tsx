import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Leva, folder, useControls } from "leva";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin, VRMExpressionPresetName } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
  type VRMAnimation,
} from "@pixiv/three-vrm-animation";
import AppShell from "./layout/AppShell";
import { serializeVrmLabPreset } from "../vrm/vrmLabPreset";

import minamiUrl from "../assets/VRM/Minami.vrm?url";
import vrma01 from "../assets/VRM/VRMA_01.vrma?url";
import vrma02 from "../assets/VRM/VRMA_02.vrma?url";
import vrma03 from "../assets/VRM/VRMA_03.vrma?url";
import vrma04 from "../assets/VRM/VRMA_04.vrma?url";
import vrma05 from "../assets/VRM/VRMA_05.vrma?url";
import vrma06 from "../assets/VRM/VRMA_06.vrma?url";
import vrma07 from "../assets/VRM/VRMA_07.vrma?url";

const VRMA_URLS = [
  vrma01,
  vrma02,
  vrma03,
  vrma04,
  vrma05,
  vrma06,
  vrma07,
] as const;

/** Presets we expose in Leva (skip blink — handled by auto-blink / manual). */
const EXPRESSION_SLIDERS = [
  VRMExpressionPresetName.Happy,
  VRMExpressionPresetName.Angry,
  VRMExpressionPresetName.Sad,
  VRMExpressionPresetName.Relaxed,
  VRMExpressionPresetName.Surprised,
  VRMExpressionPresetName.Aa,
  VRMExpressionPresetName.Ih,
  VRMExpressionPresetName.Ou,
  VRMExpressionPresetName.Ee,
  VRMExpressionPresetName.Oh,
  VRMExpressionPresetName.LookLeft,
  VRMExpressionPresetName.LookRight,
  VRMExpressionPresetName.LookUp,
  VRMExpressionPresetName.LookDown,
] as const;

export type VrmLabHudPayload = {
  clipIndex: number;
  clipName: string;
  timeSec: number;
  durationSec: number;
  frameAtFps: number;
  hudFps: number;
  playing: boolean;
};

type VrmSceneProps = {
  position: { x: number; y: number; z: number };
  rotationY: number;
  scale: number;
  ambientIntensity: number;
  directionalIntensity: number;
  clipIndex: number;
  timeScale: number;
  playing: boolean;
  autoBlink: boolean;
  blinkIntervalSec: number;
  blinkIntervalJitterSec: number;
  blinkManual: number;
  expressions: Record<(typeof EXPRESSION_SLIDERS)[number], number>;
  hudFps: number;
  onHudUpdate?: (hud: VrmLabHudPayload) => void;
  onCameraSnapshot?: (cam: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
    near: number;
    far: number;
  }) => void;
};

function VrmScene({
  position,
  rotationY,
  scale,
  ambientIntensity,
  directionalIntensity,
  clipIndex,
  timeScale,
  playing,
  autoBlink,
  blinkIntervalSec,
  blinkIntervalJitterSec,
  blinkManual,
  expressions,
  hudFps,
  onHudUpdate,
  onCameraSnapshot,
}: VrmSceneProps) {
  const { camera, invalidate } = useThree();
  const hudEmitAt = useRef(0);
  const camEmitAt = useRef(0);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const blinkRef = useRef({
    phase: "wait" as "wait" | "blink",
    waitLeft: 1.2,
    blinkU: 0,
  });

  const gltf = useLoader(
    GLTFLoader,
    minamiUrl,
    (loader) => {
      loader.register((parser) => new VRMLoaderPlugin(parser));
    },
  );

  const vrm = gltf.userData.vrm as VRM | undefined;
  const [clips, setClips] = useState<THREE.AnimationClip[]>([]);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    if (!vrm) return;

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

    let cancelled = false;

    Promise.all(VRMA_URLS.map((url) => loader.loadAsync(url)))
      .then((vrmaGltfs) => {
        if (cancelled || !vrm) return;
        const next: THREE.AnimationClip[] = [];
        for (const g of vrmaGltfs) {
          const list = g.userData.vrmAnimations as VRMAnimation[] | undefined;
          const vrma = list?.[0];
          if (!vrma) continue;
          try {
            next.push(createVRMAnimationClip(vrma, vrm));
          } catch {
            /* skip broken clips */
          }
        }
        setClips(next);
      })
      .catch(() => {
        /* ignore load errors */
      });

    return () => {
      cancelled = true;
    };
  }, [vrm]);

  useEffect(() => {
    if (!vrm) return;
    const mixer = new THREE.AnimationMixer(gltf.scene);
    mixerRef.current = mixer;
    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [vrm, gltf.scene]);

  const safeClipIndex = useMemo(() => {
    if (clips.length === 0) return 0;
    return Math.min(Math.max(0, Math.floor(clipIndex)), clips.length - 1);
  }, [clipIndex, clips.length]);

  useEffect(() => {
    const mixer = mixerRef.current;
    if (!mixer || clips.length === 0) return;

    if (actionRef.current) {
      actionRef.current.stop();
      actionRef.current = null;
    }

    const clip = clips[safeClipIndex];
    if (!clip) return;
    const action = mixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.play();
    actionRef.current = action;
  }, [clips, safeClipIndex]);

  useEffect(() => {
    const action = actionRef.current;
    if (action) action.paused = !playing;
  }, [playing]);

  useEffect(() => {
    const mixer = mixerRef.current;
    if (mixer) mixer.timeScale = timeScale;
  }, [timeScale]);

  useLayoutEffect(() => {
    const root = gltf.scene;
    if (root.userData.vrmLabFramed) return;
    root.userData.vrmLabFramed = true;
    root.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);
    root.updateMatrixWorld(true);

    const floorBox = new THREE.Box3().setFromObject(root);
    root.position.y -= floorBox.min.y;
    root.updateMatrixWorld(true);

    const size = new THREE.Vector3();
    new THREE.Box3().setFromObject(root).getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const targetY = size.y * 0.42;

    const ctrl = controlsRef.current;
    if (ctrl) {
      ctrl.target.set(0, targetY, 0);
      ctrl.minDistance = maxDim * 0.12;
      ctrl.maxDistance = maxDim * 3.2;
    }

    const dist = maxDim * 0.95;
    camera.position.set(0, targetY + maxDim * 0.06, dist);
    ctrl?.update();
    invalidate();
  }, [gltf.scene, camera, invalidate]);

  useFrame((state, delta) => {
    const mixer = mixerRef.current;
    if (mixer) mixer.update(delta);

    const action = actionRef.current;
    const clip = clips[safeClipIndex];
    const timeSec = action?.time ?? 0;
    const durationSec = clip?.duration ?? 0;
    const frameAtFps = Math.max(0, Math.floor(timeSec * hudFps));

    const t = state.clock.elapsedTime;
    if (onHudUpdate && t - hudEmitAt.current > 0.08) {
      hudEmitAt.current = t;
      onHudUpdate({
        clipIndex: safeClipIndex,
        clipName: clip?.name ?? `clip_${safeClipIndex}`,
        timeSec,
        durationSec,
        frameAtFps,
        hudFps,
        playing,
      });
    }

    if (
      onCameraSnapshot &&
      controlsRef.current &&
      t - camEmitAt.current > 0.12
    ) {
      camEmitAt.current = t;
      const ctrl = controlsRef.current;
      const persp = camera as THREE.PerspectiveCamera;
      const tgt = ctrl.target;
      onCameraSnapshot({
        position: camera.position.toArray() as [number, number, number],
        target: [tgt.x, tgt.y, tgt.z],
        fov: persp.fov,
        near: persp.near,
        far: persp.far,
      });
    }

    const em = vrm?.expressionManager;
    if (em) {
      for (const name of EXPRESSION_SLIDERS) {
        const w = expressions[name];
        if (w > 0 && em.getExpression(name)) {
          em.setValue(name, w);
        } else if (em.getExpression(name)) {
          em.setValue(name, 0);
        }
      }

      if (autoBlink) {
        const b = blinkRef.current;
        const blinkDur = 0.2;
        if (b.phase === "wait") {
          b.waitLeft -= delta;
          if (b.waitLeft <= 0) {
            b.phase = "blink";
            b.blinkU = 0;
          }
        } else {
          b.blinkU += delta / blinkDur;
          const u = Math.min(b.blinkU, 1);
          const w = Math.sin(Math.PI * u);
          if (em.getExpression(VRMExpressionPresetName.Blink)) {
            em.setValue(VRMExpressionPresetName.Blink, w);
          }
          if (u >= 1) {
            b.phase = "wait";
            if (em.getExpression(VRMExpressionPresetName.Blink)) {
              em.setValue(VRMExpressionPresetName.Blink, 0);
            }
            const jitter =
              (Math.random() * 2 - 1) * blinkIntervalJitterSec;
            b.waitLeft = Math.max(0.35, blinkIntervalSec + jitter);
          }
        }
      } else if (em.getExpression(VRMExpressionPresetName.Blink)) {
        em.setValue(VRMExpressionPresetName.Blink, blinkManual);
      }
    }

    if (vrm) vrm.update(delta);
  });

  useEffect(() => {
    if (!autoBlink) return;
    blinkRef.current.phase = "wait";
    blinkRef.current.waitLeft = 0.4;
    blinkRef.current.blinkU = 0;
  }, [autoBlink, blinkIntervalSec, blinkIntervalJitterSec]);

  return (
    <>
      <color attach="background" args={["#0a0a0f"]} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[2, 4, 3]} intensity={directionalIntensity} />

      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotationY, 0]}
        scale={[scale, scale, scale]}
      >
        <primitive object={gltf.scene} />
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={0.2}
        maxDistance={12}
      />
    </>
  );
}

const expressionFolderSchema = (() => {
  const inner: Record<
    string,
    boolean | { value: number; min: number; max: number; step: number }
  > = {
    autoBlink: true,
    blinkIntervalSec: { value: 3.2, min: 1, max: 10, step: 0.1 },
    blinkIntervalJitterSec: { value: 1.4, min: 0, max: 5, step: 0.1 },
    blinkManual: { value: 0, min: 0, max: 1, step: 0.01 },
  };
  for (const name of EXPRESSION_SLIDERS) {
    inner[name] = { value: 0, min: 0, max: 1, step: 0.01 };
  }
  return folder(inner);
})();

type VrmLabCanvasProps = VrmSceneProps & {
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
};

/** Scene-graph perspective camera registered as the Canvas default (Leva-driven). */
function LabPerspectiveCamera({
  fov,
  near,
  far,
}: {
  fov: number;
  near: number;
  far: number;
}) {
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
    const aspect = height > 0 ? width / height : 1;
    camera.aspect = aspect;
    camera.fov = fov;
    camera.near = near;
    camera.far = far;
    camera.updateProjectionMatrix();
    invalidate();
  }, [fov, near, far, width, height, invalidate]);

  return (
    <perspectiveCamera
      ref={camRef}
      position={[0, 1.2, 1.4]}
      fov={fov}
      near={near}
      far={far}
    />
  );
}

function VrmLabCanvas({
  cameraFov,
  cameraNear,
  cameraFar,
  ...sceneProps
}: VrmLabCanvasProps) {
  return (
    <Canvas
      className="h-full w-full"
      gl={{ alpha: false, antialias: true }}
      dpr={[1, 2]}
    >
      <LabPerspectiveCamera fov={cameraFov} near={cameraNear} far={cameraFar} />
      <Suspense
        fallback={
          <Html center>
            <span className="text-sm text-muted-foreground">Loading VRM…</span>
          </Html>
        }
      >
        <VrmScene {...sceneProps} />
      </Suspense>
    </Canvas>
  );
}

function parseLevaControls(controls: Record<string, unknown>) {
  const c = controls;
  const position = c.position as { x: number; y: number; z: number };
  const rotationY = c.rotationY as number;
  const scale = c.scale as number;
  const ambientIntensity = c.ambientIntensity as number;
  const directionalIntensity = c.directionalIntensity as number;
  const clipIndex = c.clipIndex as number;
  const timeScale = c.timeScale as number;
  const playing = c.playing as boolean;
  const hudFps = c.hudFps as number;
  const autoBlink = c.autoBlink as boolean;
  const blinkIntervalSec = c.blinkIntervalSec as number;
  const blinkIntervalJitterSec = c.blinkIntervalJitterSec as number;
  const blinkManual = c.blinkManual as number;

  const expressions = Object.fromEntries(
    EXPRESSION_SLIDERS.map((name) => [name, (c[name] as number) ?? 0]),
  ) as Record<(typeof EXPRESSION_SLIDERS)[number], number>;

  const cameraFov = c.cameraFov as number;
  const cameraNear = c.cameraNear as number;
  const cameraFar = c.cameraFar as number;

  return {
    position,
    rotationY,
    scale,
    ambientIntensity,
    directionalIntensity,
    clipIndex,
    timeScale,
    playing,
    hudFps,
    autoBlink,
    blinkIntervalSec,
    blinkIntervalJitterSec,
    blinkManual,
    expressions,
    cameraFov,
    cameraNear,
    cameraFar,
  };
}

function VrmLabWorkspace() {
  const controls = useControls({
    Model: folder({
      position: { value: { x: 0, y: 0, z: 0 }, step: 0.05 },
      rotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
      scale: { value: 1, min: 0.2, max: 3, step: 0.05 },
    }),
    Light: folder({
      ambientIntensity: { value: 0.55, min: 0, max: 2, step: 0.05 },
      directionalIntensity: { value: 1.1, min: 0, max: 4, step: 0.05 },
    }),
    Perspective: folder({
      cameraFov: { value: 42, min: 10, max: 100, step: 0.5, label: "FOV (°)" },
      cameraNear: { value: 0.02, min: 0.001, max: 1, step: 0.001 },
      cameraFar: { value: 120, min: 5, max: 500, step: 1 },
    }),
    Animation: folder({
      clipIndex: { value: 0, min: 0, max: 6, step: 1 },
      timeScale: { value: 1, min: 0, max: 3, step: 0.05 },
      playing: true,
      hudFps: {
        value: 30,
        min: 12,
        max: 120,
        step: 1,
        label: "HUD frame FPS",
      },
    }),
    Expressions: expressionFolderSchema,
  });

  const p = parseLevaControls(controls as Record<string, unknown>);
  const [hud, setHud] = useState<VrmLabHudPayload | null>(null);
  const [cameraSnap, setCameraSnap] = useState<{
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
    near: number;
    far: number;
  } | null>(null);

  const onHudUpdate = useCallback((next: VrmLabHudPayload) => {
    setHud(next);
  }, []);

  const onCameraSnapshot = useCallback(
    (cam: {
      position: [number, number, number];
      target: [number, number, number];
      fov: number;
      near: number;
      far: number;
    }) => {
      setCameraSnap(cam);
    },
    [],
  );

  const copyPreset = useCallback(async () => {
    const parsed = parseLevaControls(controls as Record<string, unknown>);
    const preset = serializeVrmLabPreset({
      leva: controls as Record<string, unknown>,
      expressions: parsed.expressions,
      hud: {
        clipIndex: hud?.clipIndex ?? parsed.clipIndex,
        pauseAtTimeSec:
          parsed.playing || !hud ? null : Number(hud.timeSec.toFixed(4)),
        pauseAtFrame:
          parsed.playing || !hud ? null : hud.frameAtFps,
        hudFps: parsed.hudFps,
      },
      camera: cameraSnap,
    });
    const text = JSON.stringify(preset, null, 2);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }, [controls, hud, cameraSnap]);

  const progressPct =
    hud && hud.durationSec > 0
      ? Math.min(100, (hud.timeSec / hud.durationSec) * 100)
      : 0;

  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none p-4">
            <div className="w-full max-w-[min(360px,calc(100vw-2rem))] max-h-[min(85dvh,calc(100vh-6rem))] overflow-y-auto overscroll-contain rounded-lg pointer-events-auto shadow-2xl">
              <Leva flat titleBar={{ title: "Debug", drag: true }} />
            </div>
          </div>,
          document.body,
        )}
      <main className="relative z-10 container mx-auto max-w-5xl px-6 py-20 md:py-32">
        <div className="relative min-h-[70vh] w-full rounded-xl border border-border overflow-hidden bg-muted/20">
          <div className="absolute inset-0 z-0 min-h-[70vh] pointer-events-auto">
            <VrmLabCanvas {...p} onHudUpdate={onHudUpdate} onCameraSnapshot={onCameraSnapshot} />
          </div>

          <div className="relative z-10 pointer-events-none min-h-[70vh] flex flex-col">
            <div className="p-6 md:p-8 pointer-events-auto max-w-lg space-y-3">
              <h1 className="text-2xl font-display font-bold tracking-tight">
                VRM lab
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tune the panel, then use{" "}
                <span className="text-foreground font-medium">
                  Copy preset JSON
                </span>{" "}
                to save model / light / expression / animation pause-point /
                camera for your app. VRMA is time-based (seconds); the HUD shows
                an approximate <code className="text-xs">frame</code> ={" "}
                <code className="text-xs">floor(time × HUD frame FPS)</code>{" "}
                for planning stop / resume.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copyPreset()}
                  className="text-xs font-medium rounded-md border border-border bg-background/90 px-3 py-2 hover:bg-muted transition-colors"
                >
                  Copy preset JSON
                </button>
              </div>

              <div className="rounded-lg border border-border bg-background/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                <div className="text-[10px] font-sans font-semibold uppercase tracking-wide text-foreground/80">
                  Animation HUD
                </div>
                {hud ? (
                  <>
                    <div>
                      clip {hud.clipIndex}: {hud.clipName}
                    </div>
                    <div>
                      time {hud.timeSec.toFixed(3)}s / {hud.durationSec.toFixed(3)}s
                      <span className="text-foreground/70">
                        {" "}
                        ({progressPct.toFixed(1)}%)
                      </span>
                    </div>
                    <div>
                      frame @ {hud.hudFps}fps:{" "}
                      <span className="text-foreground">{hud.frameAtFps}</span>
                      {!p.playing ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {" "}
                          — paused (use this time/frame as resume anchor)
                        </span>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div>Loading clip…</div>
                )}
                <div className="mt-1 border-t border-border pt-1 font-sans text-[10px] text-muted-foreground">
                  Three.js clips use <strong>seconds</strong>, not authoring FPS.
                  Set <strong>HUD frame FPS</strong> in the panel to match your
                  DCC timeline if you think in frames.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function VrmLabPage() {
  return (
    <AppShell
      hideVrmBackground
      navRight={() => (
        <>
          <Link
            to="/"
            className="text-sm font-medium px-3 py-2 rounded-lg text-[hsl(var(--nav-text))] hover:text-[hsl(var(--nav-hover-text))] hover:bg-[hsl(var(--nav-hover-bg)/0.5)] transition-colors shrink-0"
          >
            Portfolio
          </Link>
          <span className="text-sm font-medium px-3 py-2 rounded-lg text-[hsl(var(--nav-active-text))] bg-[hsl(var(--nav-active-bg)/0.85)] border border-[hsl(var(--nav-active-border)/0.9)] shrink-0">
            VRM lab
          </span>
        </>
      )}
    >
      <VrmLabWorkspace />
    </AppShell>
  );
}
