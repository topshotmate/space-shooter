class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.score = data.score || 0;
        this.wave = data.wave || 1;
        this.bossWave = data.bossWave || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add scrolling background
        this.bgBack = this.add.tileSprite(0, 0, width, height, 'bg-back');
        this.bgBack.setOrigin(0, 0);

        this.bgStars = this.add.tileSprite(0, 0, width, height, 'bg-stars');
        this.bgStars.setOrigin(0, 0);

        // Victory title
        this.add.text(width / 2, 100, 'BOSS DEFEATED!', {
            fontSize: '64px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#008800',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Wave info
        this.add.text(width / 2, 200, `Wave ${this.bossWave} Complete`, {
            fontSize: '32px',
            fill: '#ffff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Score
        this.add.text(width / 2, 260, `Score: ${this.score}`, {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Bonus message
        this.add.text(width / 2, 320, '+5000 Boss Bonus!', {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Continue message
        const continueText = this.add.text(width / 2, height - 100, 'Press SPACE to Continue', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Blinking effect
        this.tweens.add({
            targets: continueText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Input to continue - use a delay to avoid key carryover
        this.time.delayedCall(200, () => {
            this.input.keyboard.once('keydown-SPACE', () => {
                console.log('Space pressed on victory, continuing game');
                this.scene.start('GameScene', {
                    score: this.score,
                    wave: this.wave,
                    continueGame: true
                });
            });
        });
    }

    update() {
        // Scroll background
        this.bgBack.tilePositionY -= GameConfig.BG_SCROLL_SPEED;
        this.bgStars.tilePositionY -= GameConfig.STARS_SCROLL_SPEED;
    }
}
