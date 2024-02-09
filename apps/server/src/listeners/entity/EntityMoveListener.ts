import { EntityMovePacket } from '@ppog/shared/packets/client/entities/EntityMovePacket';
import { server } from '../..';
import { EntityMoveEvent } from '../../events/entity/EntityMoveEvent';

export function EntityMoveEventListener(evt: EntityMoveEvent) {
  server.sendPacketToAll(
    new EntityMovePacket({
      id: evt.entity.id,
      from: evt.from,
      to: evt.to
    })
  );
}
