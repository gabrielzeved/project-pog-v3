import { TPS, processInput, processSnapshot } from '@ppog/shared';
import { EntitySnapshotPacket } from '@ppog/shared/packets/client/entities/EntitySnapshotPacket';
import { vec2 } from 'gl-matrix';
import { server } from '../..';
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

  server.sendPacketToAll(
    new EntitySnapshotPacket({
      id: evt.entity.id,
      position: evt.entity.position,
      velocity: evt.entity.velocity,
      tick: evt.tick
    })
  );
}
