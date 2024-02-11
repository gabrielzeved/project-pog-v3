import { vec2 } from 'gl-matrix';

export interface Snapshot {
  position: vec2;
  velocity: vec2;
}

export function processSnapshot(snapshot: Snapshot, delta: number): Snapshot {
  const newPosition: vec2 = [
    snapshot.position[0] + snapshot.velocity[0] * delta,
    snapshot.position[1] + snapshot.velocity[1] * delta
  ];
  return {
    velocity: snapshot.velocity,
    position: newPosition
  };
}
