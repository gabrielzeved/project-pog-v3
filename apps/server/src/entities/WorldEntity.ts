import { Vector2 } from '@ppog/shared';

export class WorldEntity {
  constructor(
    public id: string,
    public name: string,
    public position: Vector2,
    public spritePath: string
  ) {}
}
