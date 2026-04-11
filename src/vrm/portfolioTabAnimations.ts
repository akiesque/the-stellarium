import vrma02 from "../assets/VRM/VRMA_02.vrma?url";
import hitToSideFbx from "../assets/VRM/Hit To Side Of Body.fbx?url";
import vrma03 from "../assets/VRM/VRMA_03.vrma?url";
import leftTurnFbx from "../assets/VRM/Left Turn.fbx?url";

/** Must match `PortfolioPage` tab ids. */
export type PortfolioTabId = "home" | "projects" | "gallery" | "contact";

export type PortfolioTabAnimation =
  | { tab: PortfolioTabId; kind: "vrma"; url: string }
  | { tab: PortfolioTabId; kind: "mixamo"; url: string };

/** One tab’s animation row (subset of {@link PortfolioTabSceneConfig}). */
export type PortfolioTabAnimationRow = PortfolioTabAnimation;

/** Camera preset when switching to this tab (world space, meters). */
export type TabCameraPreset = {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  /**
   * Vertical field of view in degrees. Omit on a tab to use **home**’s `fov` (see `resolveCameraFov`).
   */
  fov?: number;
};

/**
 * Per-tab OrbitControls tuning. Distances are `maxDim * multiplier` once the model is framed.
 * Angles are radians (Three.js / OrbitControls convention).
 */
export type TabOrbitConfig = {
  minDistanceMultiplier?: number;
  maxDistanceMultiplier?: number;
  enablePan?: boolean;
  enableZoom?: boolean;
  enableRotate?: boolean;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  /** Radians; omit for full horizontal orbit. */
  minAzimuthAngle?: number;
  maxAzimuthAngle?: number;
  panSpeed?: number;
  rotateSpeed?: number;
  zoomSpeed?: number;
  /**
   * Pan in screen X/Y instead of along the ground plane — easier to feel “sliding” the model.
   */
  screenSpacePanning?: boolean;
  /**
   * When true: **left** mouse = pan, **middle** = rotate, **wheel/right** = zoom (good Contact-tab demo).
   * When false (default): left = rotate, middle = pan (Three.js default; many users never try middle click).
   */
  useLeftMouseToPan?: boolean;
};

const ORBIT_DEFAULTS = {
  minDistanceMultiplier: 0.12,
  maxDistanceMultiplier: 3.2,
  enablePan: true,
  enableZoom: true,
  enableRotate: true,
} as const;

export type PortfolioTabSceneConfig = {
  tab: PortfolioTabId;
  kind: "vrma" | "mixamo";
  url: string;
  camera: TabCameraPreset;
  /** Merged with {@link ORBIT_DEFAULTS} at runtime. */
  orbit: TabOrbitConfig;
  /**
   * When true (default), the clip plays once and holds the last frame until the tab changes.
   */
  playOnce?: boolean;
};

export function resolveTabOrbit(orbit: TabOrbitConfig) {
  const merged = {
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    minAzimuthAngle: Number.NEGATIVE_INFINITY,
    maxAzimuthAngle: Number.POSITIVE_INFINITY,
    ...ORBIT_DEFAULTS,
    ...orbit,
  };
  return merged;
}

/**
 * One row per tab: animation source, camera preset, orbit metadata (legacy), and play mode.
 * Edit this table only — `VRMBackground` reads it for clips + camera (position, target, fov).
 */
export const PORTFOLIO_TAB_CONFIG = [
  {
    tab: "home",
    kind: "vrma",
    url: vrma03,
    camera: {
      position: [0, 1.0, 1.5],
      target: [-0.3, 1.2, 0],
      fov: 20,
    },
    orbit: {
      enablePan: true,
      panSpeed: 0.8,
      rotateSpeed: 0.7,
    },
    playOnce: true,
  },
  {
    tab: "projects",
    kind: "mixamo",
    url: leftTurnFbx,
    camera: {
      position: [0, 1.12, 1.5],
      target: [0.4, 1.2, 0],
      fov: 20,
    },
    orbit: {
      minDistanceMultiplier: 0.1,
      maxDistanceMultiplier: 4,
      enablePan: true,
      panSpeed: 1,
    },
    playOnce: true,
  },
  {
    tab: "gallery",
    kind: "mixamo",
    url: hitToSideFbx,
    camera: {
      position: [-2.5, 2.0, -1.0],
      target: [0.9, 0.05, 0.4],
      fov: 40,
    },
    orbit: {
      enablePan: false,
      enableZoom: true,
      rotateSpeed: 0.9,
    },
    playOnce: true,
  },
  {
    tab: "contact",
    kind: "vrma",
    url: vrma02,
    camera: {
      position: [0.5, 3.5, 3.5],
      target: [-0.8, 0.01, 0],
      fov: 20,
    },
    orbit: {
      enablePan: true,
      useLeftMouseToPan: true,
      screenSpacePanning: true,
      minPolarAngle: 0.25,
      maxPolarAngle: Math.PI * 0.55,
      panSpeed: 1.25,
      rotateSpeed: 0.65,
    },
    playOnce: true,
  },
] as const satisfies readonly PortfolioTabSceneConfig[];

/** Animation-only rows derived from {@link PORTFOLIO_TAB_CONFIG}. */
export const TAB_ANIMATIONS: readonly PortfolioTabAnimationRow[] =
  PORTFOLIO_TAB_CONFIG.map(({ tab, kind, url }) => ({ tab, kind, url }));

function isPortfolioTabId(id: string): id is PortfolioTabId {
  return PORTFOLIO_TAB_CONFIG.some((e) => e.tab === id);
}

export function portfolioTabFromRoute(
  tab: string | undefined,
): PortfolioTabId {
  if (tab && isPortfolioTabId(tab)) return tab;
  return "home";
}

export function getPortfolioTabSceneConfig(
  tab: PortfolioTabId,
): PortfolioTabSceneConfig {
  const row = PORTFOLIO_TAB_CONFIG.find((e) => e.tab === tab);
  return row ?? PORTFOLIO_TAB_CONFIG[0];
}

const DEFAULT_FOV = 40;

/** `home` row’s FOV, or {@link DEFAULT_FOV} if missing. */
export function getHomeCameraFov(): number {
  const home = PORTFOLIO_TAB_CONFIG.find((e) => e.tab === "home")?.camera;
  return home?.fov ?? DEFAULT_FOV;
}

/** Effective FOV for a tab: tab’s `camera.fov`, else home’s, else {@link DEFAULT_FOV}. */
export function resolveCameraFov(tab: PortfolioTabId): number {
  const cfg = getPortfolioTabSceneConfig(tab).camera;
  if (cfg.fov != null) return cfg.fov;
  return getHomeCameraFov();
}
