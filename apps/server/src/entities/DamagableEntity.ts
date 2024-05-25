import { EntityUpdateAttributesPacket } from '@ppog/shared/packets/client/entities';
import { vec2 } from 'gl-matrix';
import { server } from '..';
import { WorldEntity } from './WorldEntity';

export abstract class DamagableEntity extends WorldEntity {
  private _maxHealth: number = 100;
  private _health: number;
  private _collision: vec2 = [1, 1];

  constructor(
    public id: string,
    public name: string,
    public position: vec2,
    public direction: vec2,
    public velocity: vec2,
    public spritePath: string,
    maxHealth: number,
    health: number,
    collision: vec2
  ) {
    super(id, name, position, direction, velocity, spritePath);

    this._maxHealth = maxHealth;
    this._health = health;
    this._collision = collision;
  }

  public get collision() {
    return this._collision;
  }

  public set collision(collision: vec2) {
    this.collision = collision;

    //REPLACE TO PUT INSIDE QUEUE
    server.sendPacketToAll(
      new EntityUpdateAttributesPacket(this.id, this._health, this._maxHealth, this._collision)
    );
  }

  public get health() {
    return this._health;
  }

  public set health(health: number) {
    this._health = health;

    //REPLACE TO PUT INSIDE QUEUE
    server.sendPacketToAll(
      new EntityUpdateAttributesPacket(this.id, this._health, this._maxHealth, this._collision)
    );
  }

  public get maxHealth() {
    return this._maxHealth;
  }

  public set maxHealth(maxHealth: number) {
    this._maxHealth = maxHealth;

    //REPLACE TO PUT INSIDE QUEUE
    server.sendPacketToAll(
      new EntityUpdateAttributesPacket(this.id, this._health, this._maxHealth, this._collision)
    );
  }

  start(): void {
    this._health = this._maxHealth;
  }

  update(dt: number): void {}
}
