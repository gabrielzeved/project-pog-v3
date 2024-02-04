import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { Server } from './Server';
import readline from 'readline';
import { Logger } from './utils/Logger';
import { ClientPackets } from '@ppog/shared';

export let server: Server;

function main() {
  const port = process.env.PORT ?? 3000;

  const http = createServer();
  const io = new SocketServer(http, {
    cors: {
      origin: '*'
    }
  });

  http.listen(port, () => {
    Logger.success(`🚀 POG Server initialized on port \x1b[31m${port}`);
    commandHandler();
  });

  server = new Server(io);

  server.run();
}

function commandHandler() {
  const rl = readline.createInterface({
    input: process.stdin
  });

  console.log('Type a command or send a message');

  rl.on(`line`, (input) => {
    if (input.startsWith('/')) {
      const command = input.split(' ');

      switch (command[0]) {
        case '/help':
          console.log('Help command');
          break;
        default:
          break;
      }
    } else {
      server.sendPacketToAll(new ClientPackets.ChatMessagePacket(input));
    }
  });
}

main();
