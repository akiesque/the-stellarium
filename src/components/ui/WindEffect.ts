import type { VRM, VRMSpringBoneJoint } from "@pixiv/three-vrm";
import * as THREE from "three";

/**
 * Subtle idle **hair** motion: spring gravity bias on hair-like spring bones only.
 * Call **before** `vrm.update(delta)`.
 */

const _force = new THREE.Vector3();
const _wind = new THREE.Vector3();

const springGravitySnap = new WeakMap<
  VRMSpringBoneJoint,
  { dir: THREE.Vector3; power: number }
>();

/** Only spring chains on bones whose names look like hair (VRM naming varies). */
const HAIR_NAME_RE =
  /hair|ponytail|twintail|twin|ahoge|side|bangs|extension|ribbon|strand|pony|twin_/i;

function isHairLikeSpringJoint(joint: VRMSpringBoneJoint): boolean {
  const a = joint.bone.name;
  if (HAIR_NAME_RE.test(a)) return true;
  const ch = joint.child?.name;
  return ch ? HAIR_NAME_RE.test(ch) : false;
}

/** Gust vector added to each hair joint’s base gravity force (keep small). */
function windOffset(elapsed: number, out: THREE.Vector3): THREE.Vector3 {
  const t = elapsed;
  out.set(
    Math.sin(t * 0.55) * 0.06 + Math.sin(t * 1.25 + 0.4) * 0.025,
    Math.sin(t * 0.38 + 0.2) * 0.014,
    Math.cos(t * 0.62 + 0.15) * 0.05 + Math.sin(t * 1.05 + 1.1) * 0.02,
  );
  return out;
}

/** Mutates spring joint `settings` from snapshot + wind, **hair joints only**. */
export function applyVrmSpringWindForces(vrm: VRM, elapsed: number): void {
  const mgr = vrm.springBoneManager;
  if (!mgr) return;

  windOffset(elapsed, _wind);

  for (const joint of mgr.joints) {
    if (!isHairLikeSpringJoint(joint)) continue;

    const s = joint.settings;
    let snap = springGravitySnap.get(joint);
    if (!snap) {
      snap = { dir: s.gravityDir.clone(), power: s.gravityPower };
      springGravitySnap.set(joint, snap);
    }

    _force.copy(snap.dir).multiplyScalar(snap.power);
    _force.add(_wind);

    const len = _force.length();
    if (len > 1e-8) {
      s.gravityDir.copy(_force).divideScalar(len);
      s.gravityPower = len;
    }
  }
}
