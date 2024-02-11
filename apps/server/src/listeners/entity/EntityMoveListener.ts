import { TPS, processInput, processSnapshot } from '@ppog/shared';
import { vec2 } from 'gl-matrix';
import { PlayerEntity } from '../../entities/PlayerEntity';
import { EntityMoveEvent } from '../../events/entity/EntityMoveEvent';

export function EntityMoveEventListener(evt: EntityMoveEvent) {
  vec2.copy(evt.entity.lastPosition, evt.entity.position);
  vec2.copy(evt.entity.direction, evt.direction);

  const snapshot = processSnapshot(
    {
      position: [evt.entity.position[0], evt.entity.position[1]],
      velocity: processInput(evt.entity.direction)
    },
    Math.min(evt.delta, 1 / TPS)
  );

  evt.entity.position = snapshot.position;
  evt.entity.velocity = snapshot.velocity;

  if (evt.entity instanceof PlayerEntity) {
    evt.entity.lastInputSequenceNumber = evt.tick;
  }
}
