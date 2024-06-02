import RAPIER, { KinematicCharacterController, RigidBody, Vector } from '@dimforge/rapier2d-compat';
import { Entity } from '@ppog/shared';
import { GameManager } from './GameManager';
import { MainRoom } from './rooms';

export class WorldPhysics {
  public bodies: Map<string, RigidBody> = new Map();
  public world: RAPIER.World;

  public characterController: KinematicCharacterController;

  constructor(public room: MainRoom) {}

  async start() {
    await RAPIER.init();
    let gravity = { x: 0, y: 0 };
    this.world = new RAPIER.World(gravity);

    this.characterController = this.world.createCharacterController(0.1);
  }

  public boxCast(
    position: Vector,
    size: Vector,
    filterExcludeRigidBody?: RAPIER.RigidBody
  ): Entity[] {
    const entities: Entity[] = [];
    this.world.intersectionsWithShape(
      position,
      0,
      new RAPIER.Cuboid(size.x, size.y),
      (handle) => {
        const entity = GameManager.getInstance().entityManager.get(
          handle.parent().userData as string
        );
        entities.push(entity);
        return true;
      },
      null,
      null,
      null,
      filterExcludeRigidBody
    );
    return entities;
  }

  public rayCast(
    position: Vector,
    direction: Vector,
    length: number,
    filterExcludeRigidBody?: RAPIER.RigidBody
  ): boolean {
    let ray = new RAPIER.Ray(position, direction);

    const hit = this.world.castRay(ray, length, true, null, null, null, filterExcludeRigidBody);

    return !!hit;
  }

  async loop(delta: number) {
    this.world.step();
    for (const entry of this.bodies.entries()) {
      const entity = this.room.state.entities.get(entry[0]);
      const body = entry[1];

      if (!entity) return;

      const velocity = entity.velocity;

      this.characterController.computeColliderMovement(body.collider(0), {
        x: velocity.x,
        y: velocity.y
      });

      let correctedMovement = this.characterController.computedMovement();

      body.setLinvel(
        {
          x: correctedMovement.x / (delta / 1000),
          y: correctedMovement.y / (delta / 1000)
        },
        true
      );

      const position = body.translation();

      entity.position.x = position.x;
      entity.position.y = position.y;

      entity.velocity.x = entity.velocity.x * body.linearDamping() * (1 - delta / 1000);
      entity.velocity.y = entity.velocity.y * body.linearDamping() * (1 - delta / 1000);
    }
  }
}
