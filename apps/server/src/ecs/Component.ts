import 'reflect-metadata';
import { WorldEntity } from '../entities/WorldEntity';

export function Interpolate(target: Object, propertyKey: string | symbol) {
  Reflect.defineMetadata('sync', 'interpolate', target, propertyKey);
}

// SET ATTRIBUTE TO BE A PROXY TO SEND PACKET WHEN UPDATED
export function Sync(target: Object, propertyKey: string | symbol) {
  Reflect.defineMetadata('sync', 'imediate', target, propertyKey);
}

export function Component(ctr: Function) {
  ctr.prototype.name = ctr.constructor.name;
}

@Component
export class StaminaComponent {
  @Sync
  public maxStamina: number;

  @Sync
  public stamina: number;
}



export abstract class IComponent {
  name: string;
  entity!: WorldEntity;
  enabled: boolean = true;

  constructor(entity: WorldEntity) {
    this.entity = entity;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  update(delta: number) {}
}
