import { Entity, Player } from '@ppog/shared';
import { ActionType } from '@ppog/shared/actions/ActionType';
import { DamagableEntity } from '@ppog/shared/entities/DamagableEntity';
import { vec2 } from 'gl-matrix';
import { GameManager } from '../GameManager';
import { CooldownProcess } from '../process/CooldownProcess';

export class SlashAttack extends CooldownProcess {
  constructor(
    private entity: Entity,
    public attackPosition: vec2
  ) {
    super(350);
    this.callback = this.resetAction.bind(this);
    this.attack();
  }

  SLASH_BOX_SIZE = 16;

  public attack() {
    const body = GameManager.getInstance().physics.bodies.get(this.entity.id);

    if (!(this.entity instanceof Player)) return;
    if (this.entity.currentAction === ActionType.SLASH) return;

    this.entity.currentAction = ActionType.SLASH;

    const direction = vec2.sub([0, 0], this.attackPosition, [
      this.entity.position.x,
      this.entity.position.y
    ]);

    vec2.normalize(direction, direction);

    const entities = GameManager.getInstance().physics.boxCast(
      {
        x: this.entity.position.x + direction[0] * this.SLASH_BOX_SIZE,
        y: this.entity.position.y + direction[1] * this.SLASH_BOX_SIZE
      },
      { x: this.SLASH_BOX_SIZE, y: this.SLASH_BOX_SIZE },
      body
    );

    for (const target of entities) {
      if (!(target instanceof DamagableEntity)) return;

      target.health = target.health - 1;
      target.velocity.x = direction[0] * 5;
      target.velocity.y = direction[1] * 5;
    }
  }

  private resetAction() {
    (this.entity as Player).currentAction = ActionType.NONE;
  }
}
