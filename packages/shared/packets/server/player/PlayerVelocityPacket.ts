import { vec2 } from 'gl-matrix';
import { Packet, PacketType } from '../../Packet';

export class PlayerVelocityPacket extends Packet {
  type: PacketType = PacketType.PLAYER_VELOCITY;

  constructor(
    public id: string,
    public velocity: vec2
  ) {
    super();
  }
}
