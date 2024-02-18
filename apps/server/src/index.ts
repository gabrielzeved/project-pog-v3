import { ClientPackets } from '@ppog/shared';
import { program } from 'commander';
import { createServer } from 'http';
import readline from 'readline';
import { Server as SocketServer } from 'socket.io';
import { Server } from './Server';
import { Logger } from './utils/Logger';

import './commands';

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

program.exitOverride();

function commandHandler() {
  const rl = readline.createInterface({
    input: process.stdin
  });

  console.log('Type a command or send a message');

  rl.on(`line`, (input) => {
    if (input.startsWith('/')) {
      const args = input.split(' ');
      args[0] = args[0].replace('/', '');

      try {
        program.parse(['.', '.', ...args]);
      } catch (e) {}
    } else {
      server.sendPacketToAll(new ClientPackets.ChatMessagePacket(input));
    }
  });
}

main();
