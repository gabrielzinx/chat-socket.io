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

    socket.on('join room', ({ username, roomCode }) => {
        rooms.some((room) => {
            if (room.code === roomCode) {
                room.users.push({ username: username, id: socket.id });
                socket.join(roomCode);

                io.to(roomCode).emit('join room', room);
            }
        });

        const newRoom = createRoom(roomCode, { username: username, id: socket.id }, 5);

        if (!rooms.find(i => i.code === roomCode)) {
            rooms.push(newRoom);
        } else return

        socket.join(roomCode);

        io.to(roomCode).emit('join room', newRoom);

    });

    socket.on("sending message", ({ username, roomCode, message, time }) => {
        rooms.some((room) => {
            if (room.code === roomCode) {
                room.messages.push({
                    name: username,
                    time: time,
                    msg: message
                })
                
                io.to(roomCode).emit('receiving message', {
                    name: username,
                    time: time,
                    msg: message
                })
                return true;
            }
        });
    })

    socket.on('disconnect', () => {
        socket.leaveAll();
        rooms.forEach((room) => {
            room.users = room.users.filter((user) => user.id !== socket.id)
        })
        console.log('user disconnected');
    });
});

function createRoom(code, user, maxConnections) {
    const room = {
        code: String(code),
        users: [user],
        messages: [],
        maxConnections: maxConnections
    };

    return room;
}

server.listen(port, () => {
    console.log(`server on listening: http://localhost:${port}`);
});