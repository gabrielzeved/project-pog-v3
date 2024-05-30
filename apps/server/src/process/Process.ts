export abstract class Process {
  public finished: boolean = false;
  abstract update(elpased: number): void;
}
