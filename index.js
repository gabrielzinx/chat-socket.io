import express from 'express';
import http from 'http';
import path from 'path';

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
});

server.listen(port, () => {
    console.log(`server on listening: http://localhost:${port}`);
});