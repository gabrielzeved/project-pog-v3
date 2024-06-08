import { Command } from '@colyseus/command';
import { MainRoom } from '../rooms';

export interface OnMoveCommandProps {
  id: string;
  x: string;
  y: string;
}

export class OnMoveCommand extends Command<MainRoom, OnMoveCommandProps> {
  execute({ id, x, y }) {
    const entity = this.state.entities.get(id);

    if (!entity) return;

    entity.velocity.x = x;
    entity.velocity.y = y;
  }
}
