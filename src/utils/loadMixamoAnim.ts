import type { VRM } from "@pixiv/three-vrm";
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { MixamoVRMRigMap, isMixamoRigName } from "./MixamoRigMap";

const MIXAMO_CLIP_NAME = "mixamo.com";

/**
 * Load a Mixamo FBX from a bundled asset URL, retarget tracks onto `vrm`, and return one {@link THREE.AnimationClip}.
 *
 * Pass a Vite static URL from `src/assets/VRM/*.fbx`:
 *
 * @example
 * ```ts
 * import danceUrl from "../assets/VRM/Mixamo_Dance.fbx?url";
 * const clip = await loadMixamoAnimation(danceUrl, vrm);
 * ```
 */
export async function loadMixamoAnimation(
  assetUrl: string,
  vrm: VRM,
): Promise<THREE.AnimationClip> {
  const loader = new FBXLoader();
  const asset = await loader.loadAsync(assetUrl);

  const clip = THREE.AnimationClip.findByName(
    asset.animations,
    MIXAMO_CLIP_NAME,
  );
  if (!clip) {
    throw new Error(
      `Mixamo FBX has no "${MIXAMO_CLIP_NAME}" clip (animations: ${asset.animations.map((a) => a.name).join(", ") || "none"})`,
    );
  }

  const hips = asset.getObjectByName("mixamorigHips");
  if (!hips) {
    throw new Error("Mixamo FBX missing object mixamorigHips");
  }

  const tracks: THREE.KeyframeTrack[] = [];
  const restRotationInverse = new THREE.Quaternion();
  const parentRestWorldRotation = new THREE.Quaternion();
  const _quatA = new THREE.Quaternion();

  const motionHipsHeight = hips.position.y;
  const vrmHipsY =
    vrm.humanoid?.normalizedRestPose?.hips?.position?.[1] ?? motionHipsHeight;
  const hipsPositionScale =
    motionHipsHeight !== 0 ? vrmHipsY / motionHipsHeight : 1;

  clip.tracks.forEach((track) => {
    const parts = track.name.split(".");
    const mixamoRigName = parts[0];
    const propertyName = parts[1];
    if (!mixamoRigName || !propertyName) return;
    if (!isMixamoRigName(mixamoRigName)) return;

    const vrmBoneName = MixamoVRMRigMap[mixamoRigName];
    const vrmNodeName = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName)?.name;
    const mixamoRigNode = asset.getObjectByName(mixamoRigName);
    const parent = mixamoRigNode?.parent;

    if (vrmNodeName == null || !mixamoRigNode || !parent) return;

    mixamoRigNode.getWorldQuaternion(restRotationInverse).invert();
    parent.getWorldQuaternion(parentRestWorldRotation);

    if (track instanceof THREE.QuaternionKeyframeTrack) {
      for (let i = 0; i < track.values.length; i += 4) {
        const flatQuaternion = track.values.slice(i, i + 4);

        _quatA.fromArray(flatQuaternion);
        _quatA
          .premultiply(parentRestWorldRotation)
          .multiply(restRotationInverse);
        _quatA.toArray(flatQuaternion);

        flatQuaternion.forEach((v, index) => {
          track.values[index + i] = v;
        });
      }

      tracks.push(
        new THREE.QuaternionKeyframeTrack(
          `${vrmNodeName}.${propertyName}`,
          track.times,
          track.values.map((v, i) =>
            vrm.meta?.metaVersion === "0" && i % 2 === 0 ? -v : v,
          ),
        ),
      );
    } else if (track instanceof THREE.VectorKeyframeTrack) {
      const value = track.values.map(
        (v, i) =>
          (vrm.meta?.metaVersion === "0" && i % 3 !== 1 ? -v : v) *
          hipsPositionScale,
      );
      tracks.push(
        new THREE.VectorKeyframeTrack(
          `${vrmNodeName}.${propertyName}`,
          track.times,
          value,
        ),
      );
    }
  });

  return new THREE.AnimationClip("vrmAnimation", clip.duration, tracks);
}
