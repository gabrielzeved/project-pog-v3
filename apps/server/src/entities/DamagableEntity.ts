import { EntityUpdateAttributesPacket } from '@ppog/shared/packets/client/entities';
import { server } from '..';
import { WorldEntity } from './WorldEntity';

export abstract class DamagableEntity extends WorldEntity {
  private _maxHealth: number = 100;
  private _health: number;

  public get health() {
    return this._health;
  }

  public set health(health: number) {
    this._health = health;

    //REPLACE TO PUT INSIDE QUEUE
    server.sendPacketToAll(
      new EntityUpdateAttributesPacket(this.id, this._health, this._maxHealth)
    );
  }

  public get maxHealth() {
    return this._maxHealth;
  }

  public set maxHealth(maxHealth: number) {
    this._maxHealth = maxHealth;

    //REPLACE TO PUT INSIDE QUEUE
    server.sendPacketToAll(
      new EntityUpdateAttributesPacket(this.id, this._health, this._maxHealth)
    );
  }

  start(): void {
    this._health = this._maxHealth;
  }

  update(dt: number): void {}
}
