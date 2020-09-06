import 'module-alias/register';
require('dotenv').config();
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import jwt from 'jsonwebtoken';
import variables from '@/bin/configuration/variables';
const connectedUsers = {};
MongoHelper.connect(process.env.connection)
  .then(async () => {
    const { server, io } = await import('@/bin/configuration/app');

    let port = process.env.PORT || 3333;
    server.listen(port, () => {
      io.on('connection', async (socket) => {
        const { token } = socket.handshake.query;
        const decoded: any = await jwt.verify(
          token,
          variables.Security.secretKey,
        );
        connectedUsers[decoded.user._id] = socket.id;
        console.log(decoded.user._id, 'conectado');
        socket.on('disconnect', async () => {
          connectedUsers[decoded.user._id] = null;
        });
      });

      console.info(`Servidor rodando na porta ${port}`);
    });
  })
  .catch(console.error);
