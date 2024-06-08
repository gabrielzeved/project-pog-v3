import { Process } from './Process';

export class CooldownProcess extends Process {
  private currentTime: number = 0;

  constructor(
    private _totalDuration: number,
    public callback?: Function
  ) {
    super();
  }

  update(elpased: number): void {
    super.update(elpased);
    if (this.finished) return;

    this.currentTime += elpased;

    if (this.currentTime >= this._totalDuration) {
      this.finished = true;
      this.callback();
    }
  }
}
