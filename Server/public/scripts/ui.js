import {gameState} from './state.js';
import {socket} from "./socket.js";
import {playBossHit} from "./audio.js";

const bossAvatar = document.querySelector('.bossAvatar');
const bossProgress = document.getElementById('boss-hp');
const playerProgress = document.getElementById('player-hp');


export function bossAttack(duration) {
    console.log(duration);
    if (gameState.isBossAttacking || gameState.gameOver) return;

    gameState.isBossAttacking = true;
    const anim = bossAvatar.animate([{scale: 2, backgroundColor: 'red'}], {
        duration: duration, easing: 'ease-in-out',
    });

    anim.onfinish = () => {
        console.log('Boss Hit')
        gameState.isBossAttacking = false;
        playBossHit()
        // socket.emit('incorrect');
    };
}

export function updateBossHp(hp, bossHit) {
    bossProgress.value = hp;
    document.getElementById('b-hit').textContent = bossHit;
}

export function updatePlayerHp(hp, playerHit) {
    playerProgress.value = hp;
    document.getElementById('p-hit').textContent = playerHit;
}

export function showGameOverScreen() {
    document.querySelector('main').innerHTML = '<h1>Game Over!</h1>';
}

export function setupReadyButton(socket) {
    const readyButton = document.getElementById('ready');
    readyButton.addEventListener('click', (e) => {
        toggleElements()
        socket.emit('ready', 1);
        readyButton.style.backgroundColor = 'green';
        const quizContainer = document.querySelector('#quiz-zone');
        toggleElements(quizContainer, readyButton);
    }, {once: true});

}

export function toggleElements(...elements) {
    for (const element of elements) {
        console.log(element);
        element.classList.toggle('hidden');
    }
}


export function setupGame() {
    gameState.music = 0.75
    setupReadyButton(window.socket);
}
