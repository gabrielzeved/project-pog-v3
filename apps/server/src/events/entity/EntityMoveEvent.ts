import { vec2 } from 'gl-matrix';
import { WorldEntity } from '../../entities/WorldEntity';
import { Event, EventType } from '../Event';

export class EntityMoveEvent extends Event {
  protected type: EventType = EventType.ENTITY_MOVE;

  constructor(
    public entity: WorldEntity,
    public direction: vec2,
    public delta: number,
    public tick: number
  ) {
    super();
  }
}
