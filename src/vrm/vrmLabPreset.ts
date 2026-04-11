/**
 * Serializable snapshot from the VRM lab. Use this as the contract between
 * “tuning in the lab” and your runtime (portfolio, cutscenes, etc.).
 *
 * **How to use at runtime (typical flow):**
 * 1. Tune in `/vrm-lab`, click “Copy preset JSON”, paste into e.g. `src/vrm/presets/minami-intro.json`.
 * 2. `import preset from './presets/minami-intro.json'` (enable `resolveJsonModule` in tsconfig if needed).
 * 3. After your VRM loads (`gltf.userData.vrm`), apply:
 *    - Model: set the outer `THREE.Group` position / rotation.y / scale from `preset.model`.
 *    - Lights: your scene’s ambient + directional intensities from `preset.light`.
 *    - Expressions: `vrm.expressionManager?.setValue(name, weight)` for each entry in `preset.expressions` (and blink fields if you use them).
 *    - Animation: pick `preset.animation.clipIndex`, create `AnimationMixer(vrm.scene)`, `mixer.clipAction(clips[clipIndex])`, set `action.time = preset.animation.pauseAtTimeSec` if you want a frozen pose, then `mixer.update(0)` and `vrm.update(0)`.
 *    - Camera: move `PerspectiveCamera` to `preset.camera.position`, point OrbitControls `.target` at `preset.camera.target`, set `fov`, `near`, and `far`.
 *
 * VRMA clips are **time-based** (seconds), not discrete “frames” unless you pick an FPS; the lab HUD shows `frame @ fps` as `floor(time * fps)` for planning loops and pause points.
 */
export const VRM_LAB_PRESET_VERSION = 1 as const;

export type VrmLabPresetV1 = {
  version: typeof VRM_LAB_PRESET_VERSION;
  /** Human label for your own reference. */
  label?: string;
  model: {
    position: { x: number; y: number; z: number };
    rotationY: number;
    scale: number;
  };
  light: {
    ambientIntensity: number;
    directionalIntensity: number;
  };
  animation: {
    clipIndex: number;
    timeScale: number;
    playing: boolean;
    /**
     * When you pause playback in the lab, this records the clip time (seconds) —
     * use as `action.time` before `mixer.update(0)` to reproduce the frozen pose.
     */
    pauseAtTimeSec: number | null;
    /** Same instant expressed as floor(time * hudFps); informational. */
    pauseAtFrame: number | null;
    hudFps: number;
  };
  expressions: Record<string, number>;
  blink: {
    autoBlink: boolean;
    blinkIntervalSec: number;
    blinkIntervalJitterSec: number;
    blinkManual: number;
  };
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
    near: number;
    far: number;
  } | null;
};

export function serializeVrmLabPreset(input: {
  label?: string;
  leva: Record<string, unknown>;
  expressions: Record<string, number>;
  hud: {
    clipIndex: number;
    pauseAtTimeSec: number | null;
    pauseAtFrame: number | null;
    hudFps: number;
  };
  camera: VrmLabPresetV1["camera"];
}): VrmLabPresetV1 {
  const c = input.leva;
  const pos = c.position as { x: number; y: number; z: number };

  return {
    version: VRM_LAB_PRESET_VERSION,
    label: input.label,
    model: {
      position: { x: pos.x, y: pos.y, z: pos.z },
      rotationY: c.rotationY as number,
      scale: c.scale as number,
    },
    light: {
      ambientIntensity: c.ambientIntensity as number,
      directionalIntensity: c.directionalIntensity as number,
    },
    animation: {
      clipIndex: c.clipIndex as number,
      timeScale: c.timeScale as number,
      playing: c.playing as boolean,
      pauseAtTimeSec: input.hud.pauseAtTimeSec,
      pauseAtFrame: input.hud.pauseAtFrame,
      hudFps: input.hud.hudFps,
    },
    expressions: { ...input.expressions },
    blink: {
      autoBlink: c.autoBlink as boolean,
      blinkIntervalSec: c.blinkIntervalSec as number,
      blinkIntervalJitterSec: c.blinkIntervalJitterSec as number,
      blinkManual: c.blinkManual as number,
    },
    camera: input.camera,
  };
}
