import * as http from 'http';
import { Server } from 'socket.io';

function main() {
  const port = process.env.PORT || 3000;

  const server = http.createServer();
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  server.listen(port, () => {
    console.log('listening on: ', port);
  });
}

main();
