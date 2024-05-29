import { ChatMessage, ChatRoomState } from '@ppog/shared';
import { Client, Room, ServerError } from 'colyseus';
import CharacterController from '../controllers/character';
import * as jwt from 'jsonwebtoken';
import { prismaClient } from '../app.config';
import { User } from '@prisma/client';

export class ChatRoom extends Room<ChatRoomState> {
  characterController = new CharacterController();
  messageLifetime: number = 60000;
  serverTime: number = 0;

  /* Executes before onJoin */
  static async onAuth(token: string, req) {
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

  onCreate(options: any): void | Promise<any> {
    this.setState(new ChatRoomState());

    this.onMessage('sendChat', (client: Client, message: any) => {
      this.handleNewMessage(client, message);
    });

    // Set the frequency of the patch rate
    this.setPatchRate(1000 / 20);

    // Set the Simulation Interval callback
    this.setSimulationInterval((dt) => {
      this.serverTime += dt;
      this.pruneMessages();

      if (this.state == null) {
        console.log('We have no state!');
      }
    });
  }

  async onJoin(client: Client, options: any, userData: User) {
    client.userData = {
      userId: userData.id
    };

    const character = await this.characterController.getUserCharacter(userData.id);

    if (character) {
      this.state.chatMessages.push(
        new ChatMessage().assign({
          sender: '[Server]',
          message: `Olá, ${character.name}, seja bem vindo ao Project Pog Online!`,
          timestamp: this.serverTime + this.messageLifetime
        })
      );
    }
  }

  async onLeave(client: Client, consented: boolean) {
    const character = await this.characterController.getUserCharacter(client.userData.userId);

    if (character) {
      this.state.chatMessages.push(
        new ChatMessage().assign({
          sender: '[Server]',
          message: `${character.name}, saiu do jogo!`,
          timestamp: this.serverTime + this.messageLifetime
        })
      );
    }
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }

  async handleNewMessage(client: Client, message: any) {
    const character = await this.characterController.getUserCharacter(client.userData.userId);

    if (character) {
      this.state.chatMessages.push(
        new ChatMessage().assign({
          sender: character.name,
          message: message.message,
          timestamp: this.serverTime + this.messageLifetime
        })
      );
    }
  }

  // Iterate through all messages. any that have a timestamp <= the current serverTime get removed from the array
  pruneMessages() {
    this.state.chatMessages.forEach((message, index) => {
      if (this.serverTime >= message.timestamp) {
        this.state.chatMessages.splice(index, 1);
      }
    });
  }
}
