import express from 'express';
import http from 'http';
import path from 'path';
import rooms from './rooms/data.js';

import { Server } from "socket.io";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = 3000;

const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('join room', ({ username, roomCode }) => {
        rooms.some((room) => {
            if (room.code === roomCode) {
                room.users.push({ username: username, id: socket.id });
                socket.join(roomCode)

                io.to(roomCode).emit('join room', room);
            }
        })
    });

    socket.on('disconnect', () => {
        rooms.forEach((room) => {
            room.users = room.users.filter((user) => user.id !== socket.id)
        })
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`server on listening: http://localhost:${port}`);
});