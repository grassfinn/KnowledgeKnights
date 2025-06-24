import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

// TODO Issues:
// Server signal to the frontend to start the animation
// Server controls the frequency
// syncing these two things together
// Individual players but/ shared health
// OOP approach - player Class class is created

// Tick system
// every half second it tick, after 10 ticks triggers the
// send a signal to start the animation  5s

const players = {};

const debug = {
  bossHit: 0,
  playerHit: 0,
};

let bossMaxHp = 100;
let bossHealth;
let playerMaxHp = 100;
let playerHealth;
let bossAttackCounter = 0;

const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

let numberOfPlayers = 0;
let gameState = '';
let scale;

app.use(express.static(join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

let tickStartTime = Date.now();
let tickInterval = 2500;
let tickNumber = 0;
let counter = 0;
// Server Tick
setInterval(() => {
  // if (!gameState) return;
  tickNumber++;
  io.emit('game-tick', {
    tickStartTime,
    tickNumber,
    tickInterval,
    serverTime: Date.now(),
  });
  console.log(`Sending [server] tick ${tickNumber} sent, ${Date.now()}`);
}, tickInterval);
// What happens when a user connects
io.on('connection', (socket) => {
  const ip = socket.handshake.address;

  socket.emit('sync-tick', {
    tickStartTime,
    tickNumber,
    tickInterval,
    timeJoined: Date.now(),
  });

  socket.on('ready', (count) => {
    if (count) {
      counter++;
      console.log({ counter });
    }

    if (!gameState && counter >= 1) {
      gameState = 'playing';
      playerMaxHp *= numberOfPlayers;
      bossMaxHp *= numberOfPlayers;
      playerHealth = playerMaxHp;
      bossHealth = bossMaxHp;
      scale =
        numberOfPlayers === 1 ? 5 : Math.ceil(4 * Math.log(numberOfPlayers));
      console.log('Starting....');
      socket.emit('ready');
      // setInterval(()=> {
      // console.log('sending attack')
      // socket.emit('boss-attack')
      // },5000)
      // setInterval(() => {
      //   playerHealth -= scale
      //   console.log({ playerHealth, playerMaxHp });
      //   console.log('playerHp', playerHealth / playerMaxHp * 100, {scale});

      //   socket.emit('attack', playerHealth / playerMaxHp * 100)
      // }, 3000)
    }
  });

  socket.on('attack-finished', () => {
    console.log('Server- recieved attack Finished');
    socket.emit('boss-attack');
  });

  if (gameState === 'playing') {
    socket.emit('continue');
  }

  if (!players[ip]) {
    players[ip] = ip;
    numberOfPlayers = Object.keys(players).length;
    console.log(numberOfPlayers);
  } else {
    console.log(`${players[ip]} has already joined`);
    console.log(numberOfPlayers);
  }

  // signals

  socket.on('game-start', () => {
    if (gameState === 'playing') {
      socket.emit('boss-attack');
      io.emit('game-start', playerHealth, bossHealth);
      console.log(gameState);

      // console.log({ numberOfPlayers, playerHealth, bossHealth });
    }
  });

  socket.on('correct', () => {
    bossHealth -= scale;
    if (bossHealth <= 0) {
      // VICTORY
      gameState = 'game-over';
      io.emit('game-over');
    }
    debug.bossHit++;
    io.emit('boss-hit', getPercentage(bossHealth, bossMaxHp), debug.bossHit);
    console.log({ bossHealth });
  });

  socket.on('incorrect', () => {
    playerHealth -= scale;
    if (playerHealth <= 0) {
      // LOSE
      gameState = 'game-over';
      io.emit('game-over');
    }

    // io.emit('player-hit', bossHealth);
    debug.playerHit++;
    io.emit(
      'player-hit',
      getPercentage(playerHealth, playerMaxHp),
      debug.playerHit
    );
    console.log({ playerHealth });
  });
});

server.listen(7000, () => {
  console.log('server running at http://localhost:7000');
});

process.on('SIGINT', () => {
  console.log('Ctrl+C pressed. Exiting gracefully...');
  io.emit('shutdown');
  // Perform cleanup actions here, like closing database connections or saving data
  process.exit(0); // Exit the process with a success code
});

function getPercentage(hp, maxHp) {
  return Math.floor((hp / maxHp) * 100);
}
