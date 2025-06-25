import {gameState} from './state.js';
import {bossAttack, updateBossHp, updatePlayerHp, showGameOverScreen} from './ui.js';
import {playMusic, stopMusic} from "./audio.js";

export const socket = io();


export function setupSocket() {
    window.socket = socket; // expose for other modules


    socket.on('sync-tick', (data) => {
        // When the user Joined Back
        // Current time of the animation
        // Server Time
        // send the animation selected time
        console.log(data);

        gameState.syncTick(data);
    });

    socket.on('game-tick', ({tickNumber}, state) => {
        console.log(tickNumber, state);
    });

    socket.on('boss-hit', updateBossHp);
    socket.on('player-hit', updatePlayerHp);

    socket.on('continue', () => {
        document.getElementById('quiz-zone').style.visibility = 'visible';
        // Rejoin Offset attack stuff
        // bossAttack();
    });

    socket.on('game-start', (playerHp, bossHp) => {
        gameState.setHp(playerHp, bossHp);
        playMusic();
        bossAttack(5000)

    });

    socket.on('game-over', () => {
        if (gameState.gameOver) return
        gameState.gameOver = true;
        stopMusic();
        showGameOverScreen();
    });

    socket.on('shutdown', () => {
        document.body.innerHTML = '<h1>Please refresh game</h1>';
    });
    socket.on('boss-attack-start', ({startTime, duration}) => {
        // Maybe make attacks faster depends on percentage points
        const now = Date.now()
        const offset = now - startTime;
        const adjustedDuration = Math.max(duration - offset, 0);
        bossAttack(adjustedDuration)
    });
    socket.on('ended', () => {
        stopMusic()
    })
}
