import http from 'http';
import express,{Request, Response} from 'express';
import {Server} from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/index';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io =  new Server(server,{
  cors:{
   origin:["http://localhost:3000","http://localhost:3001","http://77.37.69.19:3000"],
   methods:["GET","POST"]
  }
});

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Adicionando as rotas definidas em routes/index.js
app.use(routes);

// Configurando o servidor para escutar na porta 443
const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`Servidor HTTP está rodando na porta ${PORT}`);
});
