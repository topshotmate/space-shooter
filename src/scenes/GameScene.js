class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // Check if continuing from victory screen
        if (data && data.continueGame) {
            this.initialScore = data.score || 0;
            this.initialWave = data.wave || 1;
        } else {
            this.initialScore = 0;
            this.initialWave = 1;
        }
    }

    create() {
        console.log('GameScene create() started');

        // Game state
        this.score = this.initialScore;
        this.lives = GameConfig.PLAYER_LIVES;
        this.lastFired = 0;
        this.gameOver = false;
        this.isPaused = false;

        console.log('Initial state set');

        // Wave system
        this.currentWave = this.initialWave;
        this.enemiesSpawnedThisWave = 0;
        this.enemiesKilledThisWave = 0;
        this.waveStartTime = 0;

        console.log('Current wave:', this.currentWave);

        // Boss state
        this.boss = null;
        this.isBossWave = false;
        this.bossHealthBar = null;
        this.bossHealthBarBg = null;

        // Combo system
        this.comboCount = 0;
        this.comboTimer = null;
        this.comboText = null;

        // Power-up state
        this.hasShield = false;
        this.scoreMultiplier = 1;
        this.weaponLevel = 1;

        console.log('About to create background');
        // Create scrolling background
        this.createBackground();

        console.log('About to create player');
        // Create player
        this.createPlayer();

        console.log('Player created');

        // Create groups for game objects
        this.bullets = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 50,
            runChildUpdate: true
        });

        this.enemyBullets = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 30,
            runChildUpdate: true
        });

        this.enemies = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 30
        });

        this.powerUps = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 10
        });

        this.asteroids = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 10
        });

        // Create UI
        this.createUI();

        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // Setup collisions
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.enemyBullets, this.playerHitByBullet, null, this);
        this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);
        this.physics.add.overlap(this.player, this.asteroids, this.hitAsteroid, null, this);
        this.physics.add.overlap(this.bullets, this.asteroids, this.bulletHitAsteroid, null, this);

        console.log('About to create particles');
        // Particle emitters
        this.createParticles();

        console.log('About to start wave');
        // Start wave system
        this.startWave();

        console.log('Wave started, scene create complete');

        // Pause key listener
        this.pauseKey.on('down', () => {
            this.togglePause();
        });

        // Debug: Z key to skip to boss wave
        this.debugBossKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.debugBossKey.on('down', () => {
            this.skipToBossWave();
        });

        console.log('Input handlers set up');
    }

    skipToBossWave() {
        console.log('Skipping to boss wave...');

        // Stop current timers
        if (this.enemySpawnTimer) this.enemySpawnTimer.remove();
        if (this.asteroidSpawnTimer) this.asteroidSpawnTimer.remove();

        // Clear existing enemies
        this.enemies.clear(true, true);
        this.enemyBullets.clear(true, true);

        // Set to boss wave
        this.currentWave = 3;
        this.isBossWave = true;
        this.enemiesToKillThisWave = 0;
        this.waveText.setText(`Wave: ${this.currentWave}`);

        // Spawn boss directly
        this.spawnBoss();
    }

    createBackground() {
        // Add background layers
        this.bgBack = this.add.tileSprite(0, 0, GameConfig.WIDTH, GameConfig.HEIGHT, 'bg-back');
        this.bgBack.setOrigin(0, 0);

        this.bgStars = this.add.tileSprite(0, 0, GameConfig.WIDTH, GameConfig.HEIGHT, 'bg-stars');
        this.bgStars.setOrigin(0, 0);

        // Create group for background objects (planets, asteroids)
        this.bgObjects = this.add.group();

        // Array of possible background objects
        this.bgObjectTypes = [
            { key: 'planet-big', scale: 1.5, speed: 20 },
            { key: 'planet-small', scale: 1, speed: 30 },
            { key: 'asteroid-1', scale: 0.8, speed: 50 },
            { key: 'asteroid-2', scale: 0.8, speed: 50 }
        ];

        // Start spawning random background objects
        this.bgObjectSpawnTimer = this.time.addEvent({
            delay: 3000,
            callback: this.spawnBackgroundObject,
            callbackScope: this,
            loop: true
        });
    }

    spawnBackgroundObject() {
        if (Math.random() > 0.7) return;

        const objType = Phaser.Utils.Array.GetRandom(this.bgObjectTypes);
        const x = Phaser.Math.Between(50, GameConfig.WIDTH - 50);

        const obj = this.add.image(x, -100, objType.key);
        obj.setScale(objType.scale);
        obj.setAlpha(0.6);
        obj.setDepth(-1);

        obj.scrollSpeed = objType.speed;
        obj.rotationSpeed = Phaser.Math.FloatBetween(-0.01, 0.01);

        this.bgObjects.add(obj);
    }

    createPlayer() {
        this.player = this.physics.add.sprite(
            GameConfig.WIDTH / 2,
            GameConfig.HEIGHT - 100,
            'player-ship'
        );
        this.player.setCollideWorldBounds(true);
        this.player.play('player-idle');
        this.player.setScale(2);
    }

    createUI() {
        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Courier New'
        });

        // Lives text
        this.livesText = this.add.text(GameConfig.WIDTH - 16, 16, `Lives: ${this.lives}`, {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Courier New'
        }).setOrigin(1, 0);

        // Wave text
        this.waveText = this.add.text(GameConfig.WIDTH / 2, 16, `Wave: ${this.currentWave}`, {
            fontSize: '24px',
            fill: '#ffff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5, 0);

        // Weapon level indicator
        this.weaponText = this.add.text(16, 50, `Weapon: Lv.${this.weaponLevel}`, {
            fontSize: '20px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });

        // Pause overlay (hidden by default)
        this.pauseOverlay = this.add.container(0, 0);
        this.pauseOverlay.setDepth(100);

        // Semi-transparent background
        const pauseBg = this.add.rectangle(0, 0, GameConfig.WIDTH, GameConfig.HEIGHT, 0x000000, 0.8);
        pauseBg.setOrigin(0, 0);
        this.pauseOverlay.add(pauseBg);

        // PAUSED title
        const pauseTitle = this.add.text(GameConfig.WIDTH / 2, 80, 'PAUSED', {
            fontSize: '64px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#ff8800',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.pauseOverlay.add(pauseTitle);

        // High score
        const highScore = localStorage.getItem('spaceShooterHighScore') || 0;
        const highScoreText = this.add.text(GameConfig.WIDTH / 2, 160, `High Score: ${highScore}`, {
            fontSize: '28px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.pauseOverlay.add(highScoreText);

        // Controls title
        const controlsTitle = this.add.text(GameConfig.WIDTH / 2, 230, 'CONTROLS', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.pauseOverlay.add(controlsTitle);

        // Controls list
        const controls = [
            'WASD or Arrow Keys - Move',
            'SPACE - Shoot',
            'P - Pause/Resume'
        ];

        let yPos = 270;
        controls.forEach(control => {
            const controlText = this.add.text(GameConfig.WIDTH / 2, yPos, control, {
                fontSize: '20px',
                fill: '#aaaaaa',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
            this.pauseOverlay.add(controlText);
            yPos += 30;
        });

        // Resume instruction
        const resumeText = this.add.text(GameConfig.WIDTH / 2, GameConfig.HEIGHT - 100, 'Press P to Resume', {
            fontSize: '32px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.pauseOverlay.add(resumeText);

        // Add blinking effect to resume text
        this.tweens.add({
            targets: resumeText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.pauseOverlay.setVisible(false);

        // Combo counter (initially hidden)
        this.comboText = this.add.text(GameConfig.WIDTH - 16, 50, '', {
            fontSize: '24px',
            fill: '#ff00ff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(1, 0).setVisible(false);
    }

    createParticles() {
        // Create particle emitter for explosions (Phaser 3.60+ API)
        this.explosionEmitter = this.add.particles(0, 0, 'laser-bolt', {
            frame: 0,
            angle: { min: 0, max: 360 },
            speed: { min: 50, max: 200 },
            quantity: 10,
            lifespan: 600,
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: [0xff0000, 0xff6600, 0xffaa00],
            emitting: false
        });
    }

    startWave() {
        this.waveStartTime = this.time.now;
        this.enemiesSpawnedThisWave = 0;
        this.enemiesKilledThisWave = 0;

        // Check if this is a boss wave
        this.isBossWave = (this.currentWave % GameConfig.BOSS_WAVE_INTERVAL === 0);

        if (this.isBossWave) {
            // Boss wave announcement
            const waveAnnounce = this.add.text(GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2, 'BOSS WAVE!\n\nPrepare for Battle', {
                fontSize: '64px',
                fill: '#ff0000',
                fontFamily: 'Courier New',
                fontStyle: 'bold',
                stroke: '#880000',
                strokeThickness: 6,
                align: 'center'
            }).setOrigin(0.5).setDepth(50);

            this.tweens.add({
                targets: waveAnnounce,
                alpha: 0,
                y: GameConfig.HEIGHT / 2 - 50,
                duration: 3000,
                ease: 'Power2',
                onComplete: () => {
                    waveAnnounce.destroy();
                    // Spawn boss after announcement
                    this.spawnBoss();
                }
            });
            return; // Don't spawn regular enemies
        }

        const baseEnemies = GameConfig.ENEMIES_PER_WAVE_BASE;
        const enemiesToSpawn = Math.floor(baseEnemies * Math.pow(GameConfig.DIFFICULTY_SCALING, this.currentWave - 1));

        // Spawn wave announcement
        const waveAnnounce = this.add.text(GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2, `Wave ${this.currentWave}`, {
            fontSize: '64px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#ff8800',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(50);

        this.tweens.add({
            targets: waveAnnounce,
            alpha: 0,
            y: GameConfig.HEIGHT / 2 - 50,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => waveAnnounce.destroy()
        });

        // Enemy spawning timer
        const spawnDelay = Math.max(800, GameConfig.ENEMY_SPAWN_INTERVAL - (this.currentWave * 100));
        const maxActiveEnemies = 6; // Limit enemies on screen at once

        // Store target for wave completion check
        this.enemiesToKillThisWave = enemiesToSpawn;

        this.enemySpawnTimer = this.time.addEvent({
            delay: spawnDelay,
            callback: () => {
                // Keep spawning until player has killed enough, but limit active enemies
                if (this.enemiesKilledThisWave < this.enemiesToKillThisWave &&
                    this.enemies.countActive() < maxActiveEnemies) {
                    this.spawnEnemy();
                    this.enemiesSpawnedThisWave++;
                }
            },
            callbackScope: this,
            loop: true
        });

        // Asteroid spawning
        this.asteroidSpawnTimer = this.time.addEvent({
            delay: 4000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(50, GameConfig.WIDTH - 50);

        // Determine enemy type based on wave
        let enemyType;
        const rand = Math.random();

        if (this.currentWave === 1) {
            enemyType = GameConfig.ENEMY_TYPES.SMALL;
        } else if (this.currentWave === 2) {
            enemyType = rand < 0.7 ? GameConfig.ENEMY_TYPES.SMALL : GameConfig.ENEMY_TYPES.MEDIUM;
        } else if (this.currentWave === 3) {
            if (rand < 0.5) enemyType = GameConfig.ENEMY_TYPES.SMALL;
            else if (rand < 0.8) enemyType = GameConfig.ENEMY_TYPES.MEDIUM;
            else enemyType = GameConfig.ENEMY_TYPES.ALIEN;
        } else {
            if (rand < 0.3) enemyType = GameConfig.ENEMY_TYPES.SMALL;
            else if (rand < 0.6) enemyType = GameConfig.ENEMY_TYPES.MEDIUM;
            else if (rand < 0.85) enemyType = GameConfig.ENEMY_TYPES.ALIEN;
            else enemyType = GameConfig.ENEMY_TYPES.BIG;
        }

        const enemy = this.enemies.create(x, -50, enemyType.key);

        if (enemy) {
            enemy.setScale(enemyType.scale);
            enemy.play(enemyType.anim);

            // Apply difficulty scaling
            const difficultyMult = Math.pow(GameConfig.DIFFICULTY_SCALING, this.currentWave - 1);
            enemy.body.velocity.y = enemyType.speed * difficultyMult;

            // Store enemy data
            enemy.setData('health', enemyType.health);
            enemy.setData('maxHealth', enemyType.health);
            enemy.setData('points', enemyType.points);
            enemy.setData('fireRate', enemyType.fireRate);
            enemy.setData('fireChance', enemyType.fireChance);
            enemy.setData('lastFired', 0);
            enemy.setData('enemyType', enemyType);
        }
    }

    spawnAsteroid() {
        if (Math.random() > GameConfig.ASTEROID_SPAWN_CHANCE) return;

        const x = Phaser.Math.Between(50, GameConfig.WIDTH - 50);
        const asteroid = this.asteroids.create(x, -50, 'asteroid-hazard');

        if (asteroid) {
            asteroid.setScale(1.5);
            asteroid.body.velocity.y = GameConfig.ASTEROID_SPEED;
            asteroid.body.setAngularVelocity(50);
            asteroid.setData('damage', GameConfig.ASTEROID_DAMAGE);
        }
    }

    spawnBoss() {
        console.log('spawnBoss() called');

        // Check if texture exists
        if (!this.textures.exists('boss')) {
            console.error('Boss texture not loaded!');
            return;
        }
        console.log('Boss texture exists');

        // Create boss sprite
        this.boss = this.physics.add.sprite(GameConfig.WIDTH / 2, -100, 'boss');
        console.log('Boss sprite created:', this.boss);
        console.log('Boss position:', this.boss.x, this.boss.y);

        this.boss.setScale(0.8);
        this.boss.setDepth(10); // Ensure boss renders above background
        this.boss.setVisible(true); // Ensure visible
        this.boss.setActive(true); // Ensure active

        // Try to play animation, fallback to first frame if it fails
        try {
            this.boss.play('boss-idle');
            console.log('Boss animation started');
        } catch (e) {
            console.error('Boss animation failed:', e);
            this.boss.setFrame(0);
        }

        // Boss data
        this.boss.setData('health', GameConfig.BOSS_HEALTH);
        this.boss.setData('maxHealth', GameConfig.BOSS_HEALTH);
        this.boss.setData('phase', 0);
        this.boss.setData('lastFired', 0);
        this.boss.setData('moveDirection', 1);

        // Move boss into position
        this.tweens.add({
            targets: this.boss,
            y: 120,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                console.log('Boss tween complete, position:', this.boss.x, this.boss.y);
            }
        });

        console.log('Boss tween started');

        // Setup boss collisions
        this.physics.add.overlap(this.bullets, this.boss, this.hitBoss, null, this);
        this.physics.add.overlap(this.player, this.boss, this.hitPlayer, null, this);

        // Create boss health bar
        this.createBossHealthBar();

        // Start boss AI
        this.bossAITimer = this.time.addEvent({
            delay: 100,
            callback: this.updateBossAI,
            callbackScope: this,
            loop: true
        });
    }

    createBossHealthBar() {
        const barWidth = 400;
        const barHeight = 20;
        const x = GameConfig.WIDTH / 2 - barWidth / 2;
        const y = 60;

        // Background
        this.bossHealthBarBg = this.add.rectangle(x, y, barWidth, barHeight, 0x000000);
        this.bossHealthBarBg.setOrigin(0, 0);
        this.bossHealthBarBg.setStrokeStyle(2, 0xffffff);

        // Health bar
        this.bossHealthBar = this.add.rectangle(x + 2, y + 2, barWidth - 4, barHeight - 4, 0xff0000);
        this.bossHealthBar.setOrigin(0, 0);

        // Boss label
        this.add.text(GameConfig.WIDTH / 2, y - 10, 'BOSS', {
            fontSize: '20px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5, 1);
    }

    updateBossHealthBar() {
        if (!this.boss || !this.bossHealthBar) return;

        const healthPercent = this.boss.getData('health') / this.boss.getData('maxHealth');
        const barWidth = 396; // 400 - 4 for padding
        this.bossHealthBar.width = barWidth * Math.max(0, healthPercent);

        // Change color based on health
        if (healthPercent > 0.66) {
            this.bossHealthBar.setFillStyle(0xff0000); // Red
        } else if (healthPercent > 0.33) {
            this.bossHealthBar.setFillStyle(0xff6600); // Orange
        } else {
            this.bossHealthBar.setFillStyle(0xff00ff); // Purple
        }
    }

    updateBossAI(time) {
        if (!this.boss || !this.boss.active) return;

        const health = this.boss.getData('health');
        const maxHealth = this.boss.getData('maxHealth');
        const healthPercent = health / maxHealth;

        // Determine phase based on health
        let phase = 0;
        if (healthPercent <= 0.33) phase = 2;
        else if (healthPercent <= 0.66) phase = 1;

        // Horizontal movement
        let moveDir = this.boss.getData('moveDirection');
        this.boss.x += GameConfig.BOSS_SPEED * 0.01 * moveDir;

        if (this.boss.x < 100 || this.boss.x > GameConfig.WIDTH - 100) {
            moveDir *= -1;
            this.boss.setData('moveDirection', moveDir);
        }

        // Attack patterns based on phase
        const now = this.time.now;
        const lastFired = this.boss.getData('lastFired');

        if (now > lastFired + GameConfig.BOSS_FIRE_RATE) {
            this.bossFire(phase);
            this.boss.setData('lastFired', now);
        }
    }

    bossFire(phase) {
        if (!this.boss || !this.boss.active) return;

        switch (phase) {
            case 0: // Spread pattern
                for (let i = -1; i <= 1; i++) {
                    const bullet = this.enemyBullets.get(this.boss.x + i * 30, this.boss.y + 50);
                    if (bullet) {
                        bullet.setActive(true);
                        bullet.setVisible(true);
                        bullet.setTexture('enemy-bullet');
                        bullet.setScale(2);
                        bullet.body.velocity.y = GameConfig.ENEMY_BULLET_SPEED;
                        bullet.body.velocity.x = i * 100;
                    }
                }
                break;

            case 1: // Spiral pattern
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 72) + this.time.now * 0.1;
                    const bullet = this.enemyBullets.get(this.boss.x, this.boss.y + 50);
                    if (bullet) {
                        bullet.setActive(true);
                        bullet.setVisible(true);
                        bullet.setTexture('enemy-bullet');
                        bullet.setScale(2);
                        this.physics.velocityFromAngle(angle, GameConfig.ENEMY_BULLET_SPEED * 0.8, bullet.body.velocity);
                    }
                }
                break;

            case 2: // Barrage pattern
                for (let i = 0; i < 8; i++) {
                    this.time.delayedCall(i * 100, () => {
                        const bullet = this.enemyBullets.get(this.boss.x, this.boss.y + 50);
                        if (bullet) {
                            bullet.setActive(true);
                            bullet.setVisible(true);
                            bullet.setTexture('enemy-bullet');
                            bullet.setScale(2);
                            bullet.body.velocity.y = GameConfig.ENEMY_BULLET_SPEED;
                            bullet.body.velocity.x = Phaser.Math.Between(-50, 50);
                        }
                    });
                }
                break;
        }
    }

    hitBoss(bullet, boss) {
        // Skip if bullet already hit something
        if (!bullet.active) return;

        // Screen shake
        this.cameras.main.shake(GameConfig.SCREEN_SHAKE_DURATION, GameConfig.SCREEN_SHAKE_INTENSITY * 0.001);

        // Particle effect
        this.explosionEmitter.explode(5, bullet.x, bullet.y);

        // Flash boss red
        boss.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            if (boss.active) boss.clearTint();
        });

        // Destroy bullet
        bullet.setActive(false);
        bullet.setVisible(false);

        // Reduce boss health
        let health = boss.getData('health');
        health--;
        boss.setData('health', health);

        // Update health bar
        this.updateBossHealthBar();

        // Update combo
        this.updateCombo();

        // Check if boss defeated
        if (health <= 0) {
            this.defeatBoss();
        }
    }

    defeatBoss() {
        if (!this.boss) return;

        // Stop boss AI
        if (this.bossAITimer) {
            this.bossAITimer.remove();
        }

        // Big explosion
        const explosion = this.add.sprite(this.boss.x, this.boss.y, 'explosion-big');
        explosion.setScale(2);
        explosion.play('explode-big');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });

        // Screen shake
        this.cameras.main.shake(500, GameConfig.SCREEN_SHAKE_INTENSITY * 0.002);

        // Particle burst
        this.explosionEmitter.explode(30, this.boss.x, this.boss.y);

        // Award points
        this.score += GameConfig.BOSS_POINTS;
        this.scoreText.setText(`Score: ${this.score}`);

        // Destroy boss
        this.boss.destroy();
        this.boss = null;

        // Remove health bar
        if (this.bossHealthBar) this.bossHealthBar.destroy();
        if (this.bossHealthBarBg) this.bossHealthBarBg.destroy();

        // Transition to victory scene
        this.time.delayedCall(2000, () => {
            this.scene.start('VictoryScene', {
                score: this.score,
                wave: this.currentWave + 1,
                bossWave: this.currentWave
            });
        });
    }

    update(time, delta) {
        // Debug: Only log first 5 frames to avoid spam
        if (!this.updateCount) this.updateCount = 0;
        if (this.updateCount < 5) {
            console.log('Update called, frame:', this.updateCount);
            this.updateCount++;
        }

        if (this.gameOver || this.isPaused) {
            return;
        }

        // Scroll background
        this.bgBack.tilePositionY -= GameConfig.BG_SCROLL_SPEED;
        this.bgStars.tilePositionY -= GameConfig.STARS_SCROLL_SPEED;

        // Update background objects
        if (this.bgObjects && this.bgObjects.children) {
            this.bgObjects.children.entries.forEach(obj => {
                if (obj && obj.active) {
                    obj.y += obj.scrollSpeed * (delta / 1000) * 60;
                    obj.rotation += obj.rotationSpeed;

                    if (obj.y > GameConfig.HEIGHT + 100) {
                        obj.destroy();
                    }
                }
            });
        }

        // Player movement
        this.handlePlayerMovement();

        // Player shooting
        if (this.spaceBar.isDown) {
            this.shootBullet(time);
        }

        // Enemy shooting
        this.handleEnemyShooting(time);

        // Update bullets
        this.bullets.children.entries.forEach(bullet => {
            if (bullet.active && bullet.y < -10) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });

        // Update enemy bullets
        this.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.active && bullet.y > GameConfig.HEIGHT + 10) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });

        // Update enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && enemy.y > GameConfig.HEIGHT + 50) {
                enemy.destroy();
            }
        });

        // Update power-ups
        this.powerUps.children.entries.forEach(powerUp => {
            if (powerUp.active && powerUp.y > GameConfig.HEIGHT + 50) {
                powerUp.destroy();
            }
        });

        // Update asteroids
        this.asteroids.children.entries.forEach(asteroid => {
            if (asteroid.active && asteroid.y > GameConfig.HEIGHT + 50) {
                asteroid.destroy();
            }
        });

        // Update shield position
        if (this.player.shield) {
            this.player.shield.x = this.player.x;
            this.player.shield.y = this.player.y;
        }

        // Check wave completion
        this.checkWaveCompletion();
    }

    handlePlayerMovement() {
        const speed = GameConfig.PLAYER_SPEED;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }

    shootBullet(time) {
        const weaponConfig = GameConfig.WEAPON_LEVELS[this.weaponLevel];

        if (time > this.lastFired + weaponConfig.fireRate) {
            if (weaponConfig.spread) {
                // Spread shot (3 bullets)
                this.createBullet(this.player.x - 10, this.player.y - 20, -20);
                this.createBullet(this.player.x, this.player.y - 20, 0);
                this.createBullet(this.player.x + 10, this.player.y - 20, 20);
            } else {
                // Single shot
                this.createBullet(this.player.x, this.player.y - 20, 0);
            }

            this.lastFired = time;
        }
    }

    createBullet(x, y, offsetX) {
        const bullet = this.bullets.get(x, y);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setTexture('laser-bolt');
            bullet.setScale(1.5);
            bullet.play('laser-shot');
            bullet.body.velocity.y = -GameConfig.BULLET_SPEED;
            bullet.body.velocity.x = offsetX * 5;
        }
    }

    handleEnemyShooting(time) {
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;

            const fireRate = enemy.getData('fireRate');
            const fireChance = enemy.getData('fireChance');
            const lastFired = enemy.getData('lastFired');

            if (fireRate > 0 && time > lastFired + fireRate && Math.random() < fireChance) {
                this.enemyShoot(enemy);
                enemy.setData('lastFired', time);
            }
        });
    }

    enemyShoot(enemy) {
        const bullet = this.enemyBullets.get(enemy.x, enemy.y + 20);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setTexture('enemy-bullet');
            bullet.setScale(2);
            bullet.body.velocity.y = GameConfig.ENEMY_BULLET_SPEED;
        }
    }

    hitEnemy(bullet, enemy) {
        // Skip if bullet already hit something
        if (!bullet.active) return;

        // Reduce enemy health
        let health = enemy.getData('health');
        health--;
        enemy.setData('health', health);

        // Visual feedback - flash red
        enemy.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            if (enemy.active) enemy.clearTint();
        });

        // Destroy bullet
        bullet.setActive(false);
        bullet.setVisible(false);

        // Check if enemy is destroyed
        if (health <= 0) {
            // Create explosion
            const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
            explosion.setScale(2);
            explosion.play('explode');
            explosion.on('animationcomplete', () => {
                explosion.destroy();
            });

            // Particle effect
            this.explosionEmitter.explode(8, enemy.x, enemy.y);

            // Screen shake
            this.cameras.main.shake(100, GameConfig.SCREEN_SHAKE_INTENSITY * 0.0005);

            // Drop power-up chance
            if (Math.random() < GameConfig.POWERUP_DROP_CHANCE) {
                this.spawnPowerUp(enemy.x, enemy.y);
            }

            // Update combo
            this.updateCombo();

            // Calculate score with combo multiplier
            let comboMultiplier = 1;
            if (this.comboCount >= 20) comboMultiplier = GameConfig.COMBO_MULTIPLIERS[20];
            else if (this.comboCount >= 10) comboMultiplier = GameConfig.COMBO_MULTIPLIERS[10];
            else if (this.comboCount >= 5) comboMultiplier = GameConfig.COMBO_MULTIPLIERS[5];

            // Update score
            const basePoints = enemy.getData('points');
            const points = Math.floor(basePoints * this.scoreMultiplier * comboMultiplier);
            this.score += points;
            this.scoreText.setText(`Score: ${this.score}`);

            // Track kills
            this.enemiesKilledThisWave++;

            // Destroy enemy
            enemy.destroy();
        }
    }

    spawnPowerUp(x, y) {
        // Random power-up type (0-3)
        const powerUpType = Phaser.Math.Between(0, 3);
        const powerUp = this.powerUps.create(x, y, 'power-up', powerUpType);

        if (powerUp) {
            powerUp.setScale(2);
            powerUp.body.velocity.y = 100;
            powerUp.setData('type', powerUpType);
        }
    }

    collectPowerUp(player, powerUp) {
        const type = powerUp.getData('type');

        // Flash effect
        const flash = this.add.sprite(powerUp.x, powerUp.y, 'hit');
        flash.setScale(3);
        flash.setTint(0x00ff00);
        flash.play('hit-effect');
        flash.on('animationcomplete', () => flash.destroy());

        // Apply power-up effect with visual feedback
        switch (type) {
            case 0: // Weapon upgrade
                if (this.weaponLevel < 3) {
                    this.weaponLevel++;
                    this.weaponText.setText(`Weapon: Lv.${this.weaponLevel}`);
                    this.showPowerUpText('WEAPON UP!', 0x00ffff);
                } else {
                    this.showPowerUpText('MAX WEAPON!', 0x00ffff);
                }
                break;
            case 1: // Shield
                this.activateShield();
                this.showPowerUpText('SHIELD!', 0x00ffff);
                break;
            case 2: // Score multiplier
                this.scoreMultiplier = GameConfig.SCORE_MULTIPLIER;
                this.showPowerUpText('2X SCORE!', 0xffff00);
                this.showMultiplierIndicator();
                this.time.delayedCall(GameConfig.POWERUP_DURATION, () => {
                    this.scoreMultiplier = 1;
                    this.hideMultiplierIndicator();
                });
                break;
            case 3: // Extra life
                this.lives++;
                this.livesText.setText(`Lives: ${this.lives}`);
                this.showPowerUpText('+1 LIFE!', 0x00ff00);
                break;
        }

        powerUp.destroy();
    }

    showPowerUpText(message, color) {
        const text = this.add.text(this.player.x, this.player.y - 50, message, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);

        text.setTint(color);

        // Animate text floating up and fading
        this.tweens.add({
            targets: text,
            y: text.y - 60,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    showMultiplierIndicator() {
        if (this.multiplierText) return;

        this.multiplierText = this.add.text(16, 80, '2X MULTIPLIER', {
            fontSize: '18px',
            fill: '#ffff00',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });

        // Blinking effect
        this.multiplierTween = this.tweens.add({
            targets: this.multiplierText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    hideMultiplierIndicator() {
        if (this.multiplierTween) {
            this.multiplierTween.stop();
            this.multiplierTween = null;
        }
        if (this.multiplierText) {
            this.multiplierText.destroy();
            this.multiplierText = null;
        }
    }

    activateShield() {
        if (this.hasShield) return;

        this.hasShield = true;

        // Visual shield effect - larger and more visible
        const shield = this.add.circle(0, 0, 40, 0x00ffff, 0.2);
        shield.setStrokeStyle(3, 0x00ffff);
        shield.setDepth(5);
        this.player.shield = shield;

        // Pulsing effect for shield
        this.player.shieldTween = this.tweens.add({
            targets: shield,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.4,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.time.delayedCall(GameConfig.SHIELD_DURATION, () => {
            this.hasShield = false;
            if (this.player.shieldTween) {
                this.player.shieldTween.stop();
                this.player.shieldTween = null;
            }
            if (this.player.shield) {
                this.player.shield.destroy();
                this.player.shield = null;
            }
        });
    }

    updateCombo() {
        this.comboCount++;

        // Reset combo timer
        if (this.comboTimer) {
            this.comboTimer.remove();
        }

        this.comboTimer = this.time.delayedCall(GameConfig.COMBO_TIMEOUT, () => {
            this.resetCombo();
        });

        // Update combo display
        if (this.comboCount >= 5) {
            this.comboText.setText(`Combo x${this.comboCount}`);
            this.comboText.setVisible(true);

            // Change color based on combo level
            if (this.comboCount >= 20) {
                this.comboText.setFill('#ff00ff'); // Purple
            } else if (this.comboCount >= 10) {
                this.comboText.setFill('#ff6600'); // Orange
            } else {
                this.comboText.setFill('#ffff00'); // Yellow
            }
        }
    }

    resetCombo() {
        this.comboCount = 0;
        this.comboText.setVisible(false);
        if (this.comboTimer) {
            this.comboTimer.remove();
            this.comboTimer = null;
        }
    }

    hitPlayer(player, enemy) {
        if (this.hasShield) {
            enemy.destroy();
            return;
        }

        // Create hit effect
        const hit = this.add.sprite(player.x, player.y, 'hit');
        hit.setScale(2);
        hit.play('hit-effect');
        hit.on('animationcomplete', () => hit.destroy());

        enemy.destroy();

        this.damagePlayer();
    }

    playerHitByBullet(player, bullet) {
        if (this.hasShield) {
            bullet.setActive(false);
            bullet.setVisible(false);
            return;
        }

        const hit = this.add.sprite(player.x, player.y, 'hit');
        hit.setScale(2);
        hit.play('hit-effect');
        hit.on('animationcomplete', () => hit.destroy());

        bullet.setActive(false);
        bullet.setVisible(false);

        this.damagePlayer();
    }

    hitAsteroid(player, asteroid) {
        if (this.hasShield) {
            asteroid.destroy();
            return;
        }

        const hit = this.add.sprite(player.x, player.y, 'hit');
        hit.setScale(2);
        hit.play('hit-effect');
        hit.on('animationcomplete', () => hit.destroy());

        asteroid.destroy();
        this.damagePlayer();
    }

    bulletHitAsteroid(bullet, asteroid) {
        bullet.setActive(false);
        bullet.setVisible(false);

        const explosion = this.add.sprite(asteroid.x, asteroid.y, 'explosion');
        explosion.setScale(1.5);
        explosion.play('explode');
        explosion.on('animationcomplete', () => explosion.destroy());

        asteroid.destroy();
    }

    damagePlayer() {
        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);

        // Reset combo on hit
        this.resetCombo();

        // Screen shake
        this.cameras.main.shake(200, GameConfig.SCREEN_SHAKE_INTENSITY * 0.002);

        if (this.lives <= 0) {
            this.endGame();
        } else {
            // Brief invincibility
            this.player.setAlpha(0.5);
            this.time.delayedCall(1500, () => {
                this.player.setAlpha(1);
            });
        }
    }

    checkWaveCompletion() {
        // Skip if boss wave or no target set or already transitioning
        if (this.isBossWave || !this.enemiesToKillThisWave) return;

        if (this.enemiesKilledThisWave >= this.enemiesToKillThisWave && this.enemies.countActive() === 0) {
            // Wave complete! Clear target to prevent multiple triggers
            this.enemiesToKillThisWave = 0;

            this.currentWave++;
            this.waveText.setText(`Wave: ${this.currentWave}`);

            // Stop current timers
            if (this.enemySpawnTimer) this.enemySpawnTimer.remove();
            if (this.asteroidSpawnTimer) this.asteroidSpawnTimer.remove();

            // Start next wave after delay
            this.time.delayedCall(3000, () => {
                if (!this.gameOver) {
                    this.startWave();
                }
            });
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseOverlay.setVisible(this.isPaused);

        if (this.isPaused) {
            this.physics.pause();
            this.anims.pauseAll();
        } else {
            this.physics.resume();
            this.anims.resumeAll();
        }
    }

    endGame() {
        this.gameOver = true;

        // Stop all timers
        if (this.enemySpawnTimer) this.enemySpawnTimer.remove();
        if (this.asteroidSpawnTimer) this.asteroidSpawnTimer.remove();
        if (this.bgObjectSpawnTimer) this.bgObjectSpawnTimer.remove();

        // Save high score
        const currentHighScore = localStorage.getItem('spaceShooterHighScore') || 0;
        if (this.score > currentHighScore) {
            localStorage.setItem('spaceShooterHighScore', this.score);
        }

        // Transition to game over scene
        this.time.delayedCall(500, () => {
            this.scene.start('GameOverScene', {
                score: this.score,
                wave: this.currentWave
            });
        });
    }
}
