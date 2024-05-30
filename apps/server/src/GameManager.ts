import { WorldPhysics } from './WorldPhysics';
import { ActionManager } from './actions/ActionManager';
import { EntityManager } from './entities/EntityManager';
import { MainRoom } from './rooms';

export class GameManager {
  private static instance: GameManager;

  private _physics: WorldPhysics;
  private _room: MainRoom;
  private _entityManager: EntityManager = new EntityManager();
  private _actionManager: ActionManager = new ActionManager();

  public get entityManager() {
    return this._entityManager;
  }

  public get physics() {
    return this._physics;
  }

  public get room() {
    return this._room;
  }

  public get actionManager() {
    return this._actionManager;
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
    this._actionManager = new ActionManager();
    await this._physics.start();
  }

  public loop(dt: number) {
    this._actionManager.update(dt);
    this._physics.loop(dt);
  }
}
