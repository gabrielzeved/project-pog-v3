import { Socket } from 'socket.io';

export class Client {
  constructor(public socket: Socket) {}
}
