import { v4 } from 'uuid';
import { GameManager } from '../GameManager';

export abstract class Process {
  public id: string;
  constructor() {
    this.id = v4();
  }

  public finished: boolean = false;
  update(elpased: number): void {
    if (this.finished) {
      GameManager.getInstance().actionManager.removeAction(this);
    }
  }
}
