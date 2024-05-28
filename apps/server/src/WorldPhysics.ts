import RAPIER, { KinematicCharacterController, RigidBody } from '@dimforge/rapier2d-compat';
import { MainRoom } from './rooms';

export class WorldPhysics {
  public bodies: Map<string, RigidBody> = new Map();
  public world: RAPIER.World;

  public static DELTA_TIME = 1 / 60;

  public characterController: KinematicCharacterController;

  constructor(public room: MainRoom) {}

  async runSimulation() {
    await RAPIER.init();

    let gravity = { x: 0, y: 0 };
    this.world = new RAPIER.World(gravity);

    this.characterController = this.world.createCharacterController(0.1);
    const gameloop = () => {
      this.world.step();

      for (const entry of this.bodies.entries()) {
        const entity = this.room.state.entities.get(entry[0]);
        const body = entry[1];

        const velocity = entity.velocity;

        this.characterController.computeColliderMovement(body.collider(0), {
          x: velocity.x,
          y: velocity.y
        });

        let correctedMovement = this.characterController.computedMovement();

        body.setLinvel(
          {
            x: correctedMovement.x / WorldPhysics.DELTA_TIME,
            y: correctedMovement.y / WorldPhysics.DELTA_TIME
          },
          true
        );

        const position = body.translation();
        
        entity.position.x = position.x;
        entity.position.y = position.y;
      }

      setTimeout(gameloop, WorldPhysics.DELTA_TIME * 1000);
    };

    gameloop();
  }
}
