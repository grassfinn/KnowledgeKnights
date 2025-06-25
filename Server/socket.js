import Game from "./game/Game.js";

const game = new Game();

export default function registerSocketHandlers(io) {
    // setInterval(() => game.tick(io), game.tickInterval);

    io.on('connection', (socket) => {
        game.addPlayer(socket);

        socket.emit('sync-tick', game.getTickSyncData());
        socket.on('ready', (count) => game.handleReady(socket, count, io));
        socket.on('game-start', () => game.handleGameStart(io, socket));
        socket.on('correct', () => game.handleCorrect(io));
        socket.on('incorrect', () => game.handleIncorrect(io, socket));
        // socket.on('attack-finished', () => socket.emit('boss-attack'));

    });
};