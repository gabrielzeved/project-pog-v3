import { Command } from '@colyseus/command';
import { ActionType } from '@ppog/shared/actions/ActionType';
import { GameManager } from '../GameManager';
import { SlashAttack } from '../actions/SlashAttack';
import { Process } from '../process/Process';
import { MainRoom } from '../rooms';

export interface ActionCommandProps {
  id: string;
  type: ActionType;
}

export type ActionConstructor = { new (...args: any[]): Process };

export class ActionCommand extends Command<MainRoom, ActionCommandProps> {
  execute({ id, type }: ActionCommandProps) {
    if (type === ActionType.SLASH) {
      const entity = this.state.entities.get(id);
      GameManager.getInstance().actionManager.addAction(new SlashAttack(entity));
    }
  }
}
