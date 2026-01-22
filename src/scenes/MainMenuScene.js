class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add scrolling background
        this.bgBack = this.add.tileSprite(0, 0, width, height, 'bg-back');
        this.bgBack.setOrigin(0, 0);

        this.bgStars = this.add.tileSprite(0, 0, width, height, 'bg-stars');
        this.bgStars.setOrigin(0, 0);

        // Title
        this.add.text(width / 2, height / 3, 'SPACE SHOOTER', {
            fontSize: '64px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#0088ff',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, height / 3 + 80, 'Retro Edition', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Get high score from localStorage
        const highScore = localStorage.getItem('spaceShooterHighScore') || 0;

        // High score display
        this.add.text(width / 2, height / 2, `High Score: ${highScore}`, {
            fontSize: '28px',
            fill: '#ffff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Start button text
        const startText = this.add.text(width / 2, height / 2 + 80, 'Press SPACE to Start', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Blinking effect for start text
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Controls instructions
        this.add.text(width / 2, height - 120, 'CONTROLS:', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height - 90, 'WASD or Arrow Keys - Move', {
            fontSize: '18px',
            fill: '#aaaaaa',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(width / 2, height - 65, 'SPACE - Shoot', {
            fontSize: '18px',
            fill: '#aaaaaa',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(width / 2, height - 40, 'P - Pause', {
            fontSize: '18px',
            fill: '#aaaaaa',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Input to start game - use a delay to avoid key carryover
        this.time.delayedCall(200, () => {
            this.input.keyboard.once('keydown-SPACE', () => {
                console.log('Space pressed on menu, starting game');
                this.scene.start('GameScene');
            });
        });
    }

    update() {
        // Scroll background
        this.bgBack.tilePositionY -= GameConfig.BG_SCROLL_SPEED;
        this.bgStars.tilePositionY -= GameConfig.STARS_SCROLL_SPEED;
    }
}
