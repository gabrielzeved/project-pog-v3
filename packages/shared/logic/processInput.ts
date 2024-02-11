import { vec2 } from 'gl-matrix';
import { UNIT } from '../constants';

export function processInput(direction: vec2): vec2 {
  const velocity: vec2 = [direction[0] * 15 * UNIT, direction[1] * 15 * UNIT];
  return velocity;
}
