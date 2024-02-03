import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { Server } from './Server';

export let server: Server;

function main() {
  const port = process.env.PORT || 3000;

  const http = createServer();
  const io = new SocketServer(http, {
    cors: {
      origin: '*'
    }
  });

  http.listen(port, () => {
    console.log('listening on: ', port);
  });

  server = new Server(io, {});

  server.setup();
}

main();
