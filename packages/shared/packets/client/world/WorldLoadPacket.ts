import { WorldData } from '../../../world/world';
import { Packet, PacketType } from '../../Packet';

export type WorldLoadPacketData = WorldData;

export class WorldLoadPacket extends Packet {
  type: PacketType = PacketType.WORLD_LOAD;

  constructor(public data: WorldLoadPacketData) {
    super();
  }
}
