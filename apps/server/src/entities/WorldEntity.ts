import { vec2 } from 'gl-matrix';

export class WorldEntity {
  public lastPosition: vec2 = [0, 0];

  constructor(
    public id: string,
    public name: string,
    public position: vec2,
    public direction: vec2,
    public velocity: vec2,
    public spritePath: string
  ) {
    this.lastPosition = vec2.copy([0, 0], this.position);
  }

  update(dt: number) {}
}
