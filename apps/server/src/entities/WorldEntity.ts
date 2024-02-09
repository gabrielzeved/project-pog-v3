import { vec2 } from 'gl-matrix';
import { server } from '..';
import { EntityMoveEvent } from '../events/entity/EntityMoveEvent';

export class WorldEntity {
  private _lastPosition: vec2;

  constructor(
    public id: string,
    public name: string,
    public position: vec2,
    public velocity: vec2,
    public spritePath: string
  ) {
    this._lastPosition = vec2.copy([0, 0], this.position);
  }

  update(dt: number) {
    vec2.copy(this._lastPosition, this.position);
    vec2.add(this.position, this.position, this.velocity);

    if (!vec2.equals(this._lastPosition, this.position)) {
      const event = new EntityMoveEvent(this, this._lastPosition, this.position);
      server.queueEvent(event);
    }
  }
}
