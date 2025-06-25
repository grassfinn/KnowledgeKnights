import Player from './Player.js';
import {getPercentage} from './utils.js'

export default class Game {
    constructor(tickInterval = 1250, bossAttackEveryNTicks = 4) {
        this.players = {};
        this.numberOfPlayers = 0;
        this.bossHealth = Math.max(0, this.bossHealth);
        this.playerHealth = Math.max(0, this.playerHealth);
        this.playerMaxHp = 100;
        this.bossMaxHp = 100;
        this.scale = 1;
        this.gameState = '';
        this.tickInterval = tickInterval;
        this.tickNumber = 0;
        this.tickStartTime = null;
        this.tickTimer = null;
        this.bossAttackEveryNTicks = bossAttackEveryNTicks
        this.counter = 0;
        this.debug = {bossHit: 0, playerHit: 0};
    }

    // TICK
    getTickSyncData() {
        return {
            tickStartTime: this.tickStartTime,
            tickNumber: this.tickNumber,
            tickInterval: this.tickInterval,
            timeJoined: Date.now()
        };
    }

    tick(io) {
        this.tickNumber++;
        if (this.gameState === 'playing' && (this.tickNumber % this.bossAttackEveryNTicks === 0)) {
            const attackDuration = 5000
            io.emit('boss-attack-start', {startTime: Date.now(), duration: attackDuration})
            setTimeout(() => {
                this.playerHealth -= this.scale
                this.debug.playerHit++
                io.emit('player-hit', getPercentage(this.playerHealth, this.playerMaxHp), this.debug.playerHit);

                if (this.playerHealth <= 0) {
                    this.gameState = 'game-over'
                    io.emit('game-over')
                    this.stopTick()

                }
            })
        }

        io.emit('game-tick', this.getTickSyncData(), this.gameState);
        console.log(`[Server] Tick ${this.tickNumber}`);
    }

    startTick(io) {
        if (this.tickTimer) return;
        this.tickStartTime = Date.now();
        this.tickTimer = setInterval(() => {
            this.tick(io);
        }, this.tickInterval);
    }

    stopTick() {
        if (this.tickTimer) {
            clearInterval(this.tickTimer);
            this.tickTimer = null;
        }
    }

    startGame(socket) {
        if (this.gameState === 'playing') return;
        this.gameState = 'playing';


        this.playerMaxHp = 100 * this.numberOfPlayers;
        this.bossMaxHp = 100 * this.numberOfPlayers;
        this.playerHealth = this.playerMaxHp;
        this.bossHealth = this.bossMaxHp;

        this.scale = this.numberOfPlayers === 1
            ? 5
            : Math.ceil(4 * Math.log(this.numberOfPlayers));
        socket.emit('game-start', this.playerHealth, this.bossHealth);
    }


    addPlayer(socket) {
        const ip = socket.handshake.address;
        // if (!this.players[ip]) {
        this.players[ip] = new Player(ip);
        this.numberOfPlayers = Object.keys(this.players).length;
        console.log(`Player ${ip} connected. Total: ${this.numberOfPlayers}`);
        // }
        // else {
        //     console.log(`${ip} already connected`);
        // }

        if (this.gameState === 'playing') {
            socket.emit('continue');
        }
    }

    handleReady(socket, count, io) {
        if (count) {
            this.counter++
            console.log('player is ready')

        }
        if (!this.gameState && this.counter >= 2) {
            console.log('Game starting...');
            console.log('Game started...');
            this.startGame(io);
            this.startTick(io)

        }
    }

    handleGameStart(io, socket) {
        if (this.gameState === 'playing') {
            io.emit('boss-attack');
            io.emit('game-start', this.playerHealth, this.bossHealth);
            this.startGame(io);
            console.log(this.tickNumber)
        }
    }

    handleCorrect(io) {
        this.bossHealth -= this.scale;
        this.debug.bossHit++;
        io.emit('boss-hit', getPercentage(this.bossHealth, this.bossMaxHp), this.debug.bossHit);

        if (this.bossHealth <= 0) {
            this.gameState = 'game-over';
            io.emit('game-over');
            this.stopTick()

        }
    }

    handleIncorrect(io, socket) {
        this.playerHealth -= this.scale;
        // console.log(`[SERVER] Handling inccorrect from ${socket.id}`)

        this.debug.playerHit++;
        io.emit('player-hit', getPercentage(this.playerHealth, this.playerMaxHp), this.debug.playerHit);

        if (this.playerHealth <= 0) {
            this.gameState = 'game-over';
            io.emit('game-over');
            this.stopTick()
        }

    }


}