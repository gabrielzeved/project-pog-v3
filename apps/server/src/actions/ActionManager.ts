import actions from '../assets/actions.json';
import { Process } from '../process/Process';
import { ActionType } from './ActionType';

export interface ActionData {
  id: string;
  cooldown: number;
}

export class ActionManager {
  public actions: Map<string, Process> = new Map();

  getData(action: ActionType): ActionData {
    return actions[action];
  }

  update(elapsed: number) {
    for (const action of this.actions.values()) {
      action.update(elapsed);
    }
  }
}
