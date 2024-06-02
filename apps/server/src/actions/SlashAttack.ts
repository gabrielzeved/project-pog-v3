import { Entity, Player } from '@ppog/shared';
import { ActionType } from '@ppog/shared/actions/ActionType';
import { DamagableEntity } from '@ppog/shared/entities/DamagableEntity';
import { GameManager } from '../GameManager';
import { CooldownProcess } from '../process/CooldownProcess';

export class SlashAttack extends CooldownProcess {
  constructor(private entity: Entity) {
    super(350);
    this.callback = this.resetAction.bind(this);
    this.attack();
  }

  public attack() {
    const body = GameManager.getInstance().physics.bodies.get(this.entity.id);

    if (!(this.entity instanceof Player)) return;
    if (this.entity.currentAction === ActionType.SLASH) return;

    this.entity.currentAction = ActionType.SLASH;

    const entities = GameManager.getInstance().physics.boxCast(
      {
        x: this.entity.position.x + 16,
        y: this.entity.position.y
      },
      {
        x: 16,
        y: 16
      },
      body
    );

    for (const target of entities) {
      if (!(target instanceof DamagableEntity)) return;

      target.health = target.health - 1;
      target.velocity.x = 5;
    }
  }

  private resetAction() {
    (this.entity as Player).currentAction = ActionType.NONE;
  }
}
