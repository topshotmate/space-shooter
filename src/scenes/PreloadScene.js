class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Display loading text
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

        // Update loading bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Load backgrounds
        this.load.image('bg-back', 'assets/backgrounds/blue-back.png');
        this.load.image('bg-stars', 'assets/backgrounds/blue-stars.png');
        this.load.image('planet-big', 'assets/backgrounds/planet-big.png');
        this.load.image('planet-small', 'assets/backgrounds/planet-small.png');
        this.load.image('asteroid-1', 'assets/backgrounds/asteroid-1.png');
        this.load.image('asteroid-2', 'assets/backgrounds/asteroid-2.png');

        // Load player ship spritesheet (80x48 = 5 frames of 16x48)
        this.load.spritesheet('player-ship', 'assets/sprites/ship.png', {
            frameWidth: 16,
            frameHeight: 24
        });

        // Load enemy spritesheets
        this.load.spritesheet('enemy-small', 'assets/sprites/enemy-small.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet('enemy-medium', 'assets/sprites/enemy-medium.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet('enemy-big', 'assets/sprites/enemy-big.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('alien-flying', 'assets/sprites/alien-flying.png', {
            frameWidth: 83,
            frameHeight: 64
        });

        // Load asteroid hazard
        this.load.image('asteroid-hazard', 'assets/sprites/asteroid-hazard.png');

        // Load boss spritesheet (960x144 = 5 frames of 192x144)
        this.load.spritesheet('boss', 'assets/sprites/boss.png', {
            frameWidth: 192,
            frameHeight: 144
        });

        // Load projectiles
        // Load laser bolt spritesheet (32x32 = 4 frames in 2x2 grid, each 16x16)
        this.load.spritesheet('laser-bolt', 'assets/projectiles/laser-bolts.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // Load explosion spritesheet (80x16 = 5 frames of 16x16)
        this.load.spritesheet('explosion', 'assets/effects/explosion.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // Load big explosion for boss (1008x128 = 9 frames of 112x128)
        this.load.spritesheet('explosion-big', 'assets/effects/explosion-big.png', {
            frameWidth: 112,
            frameHeight: 128
        });

        // Load hit effect
        this.load.spritesheet('hit', 'assets/effects/hit.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // Load power-ups (32x32 = 4 power-ups in 2x2 grid, each 16x16)
        this.load.spritesheet('power-up', 'assets/powerups/power-up.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // Load additional projectiles
        this.load.image('bolt', 'assets/projectiles/bolt.png');
        this.load.image('pulse', 'assets/projectiles/pulse.png');
        this.load.image('enemy-bullet', 'assets/projectiles/enemy-projectile.png');
    }

    create() {
        // Create animations
        this.createAnimations();

        // Start the main menu scene
        this.scene.start('MainMenuScene');
    }

    createAnimations() {
        // Player ship animations
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player-ship', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        // Enemy animations
        this.anims.create({
            key: 'enemy-small-fly',
            frames: this.anims.generateFrameNumbers('enemy-small', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy-medium-fly',
            frames: this.anims.generateFrameNumbers('enemy-medium', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy-big-fly',
            frames: this.anims.generateFrameNumbers('enemy-big', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'alien-fly',
            frames: this.anims.generateFrameNumbers('alien-flying', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Boss animation
        this.anims.create({
            key: 'boss-idle',
            frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        // Laser bolt animation
        this.anims.create({
            key: 'laser-shot',
            frames: this.anims.generateFrameNumbers('laser-bolt', { frames: [0, 1] }),
            frameRate: 10,
            repeat: -1
        });

        // Explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true
        });

        // Big explosion animation (for boss)
        this.anims.create({
            key: 'explode-big',
            frames: this.anims.generateFrameNumbers('explosion-big', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: 0,
            hideOnComplete: true
        });

        // Hit effect animation
        this.anims.create({
            key: 'hit-effect',
            frames: this.anims.generateFrameNumbers('hit', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: 0,
            hideOnComplete: true
        });
    }
}
