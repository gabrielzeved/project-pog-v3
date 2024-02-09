import { Vector2 } from '../types';
export abstract class Entity {
  constructor(
    public readonly id: string,
    public position: Vector2,
    public spritePath: string
  ) {}

  abstract update(): void;
}
