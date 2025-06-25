export const gameState = {
    playerHp: 100,
    bossHp: 100,
    isBossAttacking: false,
    gameOver: false,
    syncTick({tickStartTime, tickNumber, tickInterval}) {
        this.tickStartTime = tickStartTime;
        this.tickNumber = tickNumber;
        this.tickInterval = tickInterval;
    },

    setHp(playerHp, bossHp) {
        this.playerHp = playerHp;
        this.bossHp = bossHp;
        document.getElementById('player-hp').value = playerHp;
        document.getElementById('boss-hp').value = bossHp;
    }
};
