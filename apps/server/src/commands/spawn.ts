import { InvalidArgumentError, program } from 'commander';
import { server } from '..';
import { EnemyEntity } from '../entities/EnemyEntity';

function myParseInt(value: any, _: any) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

program
  .command('spawn')
  .description('Spawn entities')
  .argument('<type>', 'Entity type to spawn')
  .argument('[x]', 'X position to spawn', myParseInt)
  .argument('[y]', 'Y position to spawn', myParseInt)
  .action((args) => {
    const entity = new EnemyEntity(
      `${Math.random() * 9999}`,
      'Enemy',
      [args.x ?? ~~(Math.random() * 750), args.y ?? ~~(Math.random() * 750)],
      [0, 0],
      [0, 0],
      'assets/enemy/data.json',
      100,
      100,
      [0,0]
    );
    server.gameManager.spawnEntity(entity);
  })
  .exitOverride();
