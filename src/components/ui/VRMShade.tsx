import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";
import * as THREE from "three";

const SILHOUETTE_BACKUP_KEY = "__vrmSilhouetteBackup";

function isDrawableMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh === true;
}

/**
 * One shared unlit material — cheap and identical on every mesh (pure silhouette).
 */
export function createVrmSilhouetteMaterial(
  color: THREE.ColorRepresentation,
): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color,
    depthWrite: true,
  });
}

/**
 * Walks the VRM scene, saves each mesh’s original material(s), then assigns `material`.
 * Skinned meshes are still `Mesh` in Three.js, so they are included.
 */
export function applySilhouetteToVrmRoot(
  root: THREE.Object3D,
  material: THREE.MeshBasicMaterial,
): void {
  root.traverse((child) => {
    if (!isDrawableMesh(child)) return;
    if (child.userData[SILHOUETTE_BACKUP_KEY] == null) {
      child.userData[SILHOUETTE_BACKUP_KEY] = Array.isArray(child.material)
        ? child.material.slice()
        : child.material;
    }
    child.material = material;
  });
}

/** Restores materials saved by {@link applySilhouetteToVrmRoot}. */
export function restoreVrmSilhouetteMaterials(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (!isDrawableMesh(child)) return;
    const backup = child.userData[SILHOUETTE_BACKUP_KEY] as
      | THREE.Material
      | THREE.Material[]
      | undefined;
    if (backup != null) {
      child.material = backup;
      delete child.userData[SILHOUETTE_BACKUP_KEY];
    }
  });
}

type VRMShadeProps = {
  url: string;
  color?: THREE.ColorRepresentation;
  /** When false, restores the VRM’s original MToon / PBR materials. */
  isSilhouette?: boolean;
};

/**
 * Standalone: loads a VRM and toggles silhouette mode.
 * For a scene that already has a loaded VRM, use {@link applySilhouetteToVrmRoot} instead
 * (see `VRMBackground` / `PortfolioVrm`).
 */
export function VRMShade({
  url,
  color = "#0f7669",
  isSilhouette = true,
}: VRMShadeProps) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });
  const vrm = gltf.userData.vrm as VRM | undefined;

  const silhouetteMaterial = useMemo(
    () => createVrmSilhouetteMaterial(color),
    [color],
  );

  useEffect(() => {
    if (!vrm?.scene) return;
    if (isSilhouette) {
      applySilhouetteToVrmRoot(vrm.scene, silhouetteMaterial);
    } else {
      restoreVrmSilhouetteMaterials(vrm.scene);
    }
    return () => {
      if (vrm?.scene) restoreVrmSilhouetteMaterials(vrm.scene);
    };
  }, [vrm, isSilhouette, silhouetteMaterial]);

  useEffect(() => {
    silhouetteMaterial.color.set(color);
  }, [color, silhouetteMaterial]);

  if (!vrm) return null;
  return <primitive object={vrm.scene} />;
}
