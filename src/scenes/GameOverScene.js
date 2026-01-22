class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalWave = data.wave || 1;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add background
        this.add.tileSprite(0, 0, width, height, 'bg-back').setOrigin(0, 0);

        // Game Over text
        this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Final score
        this.add.text(width / 2, height / 2 - 20, `Final Score: ${this.finalScore}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Wave reached
        this.add.text(width / 2, height / 2 + 20, `Wave Reached: ${this.finalWave}`, {
            fontSize: '28px',
            fill: '#ffff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // High score
        const highScore = localStorage.getItem('spaceShooterHighScore') || 0;
        const isNewHighScore = this.finalScore > highScore;

        if (isNewHighScore) {
            this.add.text(width / 2, height / 2 + 60, 'NEW HIGH SCORE!', {
                fontSize: '24px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        } else {
            this.add.text(width / 2, height / 2 + 60, `High Score: ${highScore}`, {
                fontSize: '24px',
                fill: '#aaaaaa',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        }

        // Restart instructions
        const restartText = this.add.text(width / 2, height / 2 + 120, 'Press SPACE to restart', {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Blinking effect for restart text
        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Input to restart - use a delay to avoid key carryover
        this.time.delayedCall(200, () => {
            this.input.keyboard.once('keydown-SPACE', () => {
                console.log('Space pressed on game over, restarting');
                this.scene.start('GameScene');
            });
        });
    }
}
