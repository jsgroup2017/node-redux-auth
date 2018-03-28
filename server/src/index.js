import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import router from './router';
import { dbConfig } from './config';
import socket from 'socket.io';

const app = express();

mongoose.connect(dbConfig.db);
mongoose.set('debug', true);

app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port);
const io = socket(server);
io.on('connection', (socket) => {
	console.log(socket.id);
	socket.on('SEND_MESSAGE', function(data){
        io.sockets.emit('RECEIVE_MESSAGE', data);
    })
})
console.log('server listening on:', port);
