import { Dispatcher } from '@colyseus/command';
import { MainRoomState } from '@ppog/shared';
import { User } from '@prisma/client';
import { Client, Room, ServerError } from 'colyseus';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { GameManager } from '../GameManager';
import { prismaClient } from '../app.config';
import { ActionCommand } from '../commands/ActionCommand';
import { OnJoinCommand } from '../commands/OnJoinCommand';
import { OnLeaveCommand } from '../commands/OnLeaveCommand';
import { OnMoveCommand } from '../commands/OnMoveCommand';
import CharacterController from '../controllers/character';

export class MainRoom extends Room<MainRoomState> {
  maxClients: number = 50;
  characterController = new CharacterController();
  dispatcher = new Dispatcher(this);

  /* Executes before onJoin */
  static async onAuth(token: string, req: IncomingMessage) {
    if (!token) {
      throw new ServerError(400, 'Not authenticated');
    }

    const payload = jwt.verify(token!, process.env.JWT_SECRET!) as any;

    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId
      }
    });

    if (!user) {
      throw new ServerError(400, 'Not authenticated');
    }

    delete user.password;
    return user;
  }

  async onCreate(options: any) {
    this.setState(new MainRoomState());

    await GameManager.getInstance().start(this);

    this.setSimulationInterval((dt) => {
      GameManager.getInstance().loop(dt);
    });

    // const enemy = GameManager.getInstance().entityManager.spawn<Enemy>(EntityType.ENEMY, {
    //   id: v4(),
    //   type: EntityType.ENEMY,
    //   position: {
    //     x: Math.floor(Math.random() * 100),
    //     y: Math.floor(Math.random() * 100)
    //   }
    // });

    // enemy.name = 'Enemy';

    this.setPatchRate(1000 / 60);

    this.onMessage('move', (client, message) => {
      this.dispatcher.dispatch(new OnMoveCommand(), {
        id: client.sessionId,
        x: message.x,
        y: message.y
      });
    });

    this.onMessage('attack', (client, message) => {
      this.dispatcher.dispatch(new ActionCommand(), {
        id: client.sessionId,
        type: message
      });
    });
  }

  async onJoin(client: Client, options: any, user: User) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client,
      characterController: this.characterController,
      user
    });
  }

  async onLeave(client: Client, consented: boolean) {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      client,
      characterController: this.characterController
    });
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
