import { vec2 } from 'gl-matrix';
import { Packet, PacketType } from '../../Packet';

export class PlayerMovePacket extends Packet {
  type: PacketType = PacketType.PLAYER_MOVE;

  constructor(
    public direction: vec2,
    public tick: number,
    public delta: number
  ) {
    super();
  }
}
