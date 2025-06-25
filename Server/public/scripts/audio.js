const music = new Audio('/assets/the-final-boss-battle-158700.mp3');
const bossHit = new Audio('/assets/hit01.wav');
music.volume = 0.75;


export function playMusic() {
    music.currentTime = 0;
    music.play();
}

export function stopMusic() {
    music.pause();
    music.currentTime = 0;
}

export function playBossHit() {
    bossHit.currentTime = 0;
    bossHit.play();
}

