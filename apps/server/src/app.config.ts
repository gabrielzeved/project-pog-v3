import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import config from '@colyseus/tools';
import { ChatRoom, MainRoom } from './rooms';
import { PrismaClient } from '@prisma/client';
import { AuthRoutes, CharacterRoutes } from './routes';
import authMiddleware from './middlewares/auth';

export const prismaClient = new PrismaClient();

export default config({
  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define('my_room', MainRoom);
    gameServer.define('chat_room', ChatRoom);
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    // app.get("/hello_world", (req, res) => {
    //     res.send("It's time to kick ass and chew bubblegum!");
    // });

    app.post('/auth/signup', AuthRoutes.SignUp);
    app.post('/auth/login', AuthRoutes.Login);

    app.get('/auth/me', [authMiddleware], (req, res) => {
      res.json(req.user);
    });

    app.post('/character', [authMiddleware], CharacterRoutes.CreateCharacter);

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== 'production') {
      app.use('/', playground);
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use('/colyseus', monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  }
});
