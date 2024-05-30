import { MainRoom } from './Room';
import { WorldPhysics } from './WorldPhysics';
import { EntityManager } from './entities/EntityManager';

export class GameManager {
  private static instance: GameManager;
  public static DELTA_TIME = 1 / 60;

  private _physics: WorldPhysics;
  private _room: MainRoom;
  private _entityManager: EntityManager = new EntityManager();

  public get entityManager() {
    return this._entityManager;
  }

  public get physics() {
    return this._physics;
  }

  public get room() {
    return this._room;
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }

    return GameManager.instance;
  }

  public async start(room: MainRoom) {
    this._room = room;
    this._physics = new WorldPhysics(this._room);
    await this._physics.start();
    this.loop();
  }

  public loop() {
    this._physics.loop(GameManager.DELTA_TIME);
    setTimeout(this.loop.bind(this), GameManager.DELTA_TIME * 1000);
  }
}
