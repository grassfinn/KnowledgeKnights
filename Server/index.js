import express from 'express';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {Server} from 'socket.io';
import registerSocketHandlers from "./socket.js";

// TODO Issues:
// Server signal to the frontend to start the animation
// Server controls the frequency
// syncing these two things together
// Individual players but/ shared health
// OOP approach - player Class class is created

const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Kinda like Router but for sockets
registerSocketHandlers(io)

server.listen(7000, () => {
    console.log('server running at http://localhost:7000');
});

process.on('SIGINT', () => {
    console.log('Ctrl+C pressed. Exiting gracefully...');
    io.emit('shutdown');
    // Perform cleanup actions here, like closing database connections or saving data
    process.exit(0); // Exit the process with a success code
});
