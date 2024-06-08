import { ActionType } from '@ppog/shared/actions/ActionType';
import actions from '../assets/actions.json';
import { Process } from '../process/Process';

export interface ActionData {
  id: string;
  cooldown: number;
}

export class ActionManager {
  private actions: Map<string, Process> = new Map();

  addAction(process: Process) {
    this.actions.set(process.id, process);
  }

  removeAction(process: Process) {
    this.actions.delete(process.id);
  }

  getData(action: ActionType): ActionData {
    return actions[action];
  }

  update(elapsed: number) {
    for (const action of this.actions.values()) {
      action.update(elapsed);
    }
  }
}
