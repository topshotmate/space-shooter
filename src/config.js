// Game configuration
const GameConfig = {
    // Screen dimensions
    WIDTH: 800,
    HEIGHT: 600,

    // Player settings
    PLAYER_SPEED: 200,
    PLAYER_FIRE_RATE: 300,
    PLAYER_LIVES: 3,

    // Projectile settings
    BULLET_SPEED: 400,
    ENEMY_BULLET_SPEED: 250,

    // Enemy settings - Base values (will scale with waves)
    ENEMY_SPAWN_INTERVAL: 2000,

    // Enemy types configuration
    ENEMY_TYPES: {
        SMALL: {
            key: 'enemy-small',
            anim: 'enemy-small-fly',
            speed: 120,
            health: 1,
            points: 100,
            scale: 2,
            fireRate: 0, // Doesn't shoot
            fireChance: 0
        },
        MEDIUM: {
            key: 'enemy-medium',
            anim: 'enemy-medium-fly',
            speed: 80,
            health: 2,
            points: 200,
            scale: 2,
            fireRate: 2000,
            fireChance: 0.3
        },
        BIG: {
            key: 'enemy-big',
            anim: 'enemy-big-fly',
            speed: 50,
            health: 5,
            points: 500,
            scale: 1.5,
            fireRate: 1500,
            fireChance: 0.5
        },
        ALIEN: {
            key: 'alien-flying',
            anim: 'alien-fly',
            speed: 100,
            health: 3,
            points: 300,
            scale: 0.5,
            fireRate: 1800,
            fireChance: 0.4
        }
    },

    // Wave system
    WAVE_DURATION: 30000, // 30 seconds per wave
    ENEMIES_PER_WAVE_BASE: 10,
    DIFFICULTY_SCALING: 1.2, // Multiplier per wave

    // Power-up settings
    POWERUP_DROP_CHANCE: 0.15, // 15% chance
    POWERUP_DURATION: 10000, // 10 seconds
    SHIELD_DURATION: 8000,
    SCORE_MULTIPLIER: 2,

    // Weapon upgrade settings
    WEAPON_LEVELS: {
        1: { fireRate: 300, spread: false },
        2: { fireRate: 200, spread: false },
        3: { fireRate: 150, spread: true }
    },

    // Hazard settings
    ASTEROID_SPEED: 150,
    ASTEROID_SPAWN_CHANCE: 0.1,
    ASTEROID_DAMAGE: 1,

    // Boss settings
    BOSS_WAVE_INTERVAL: 3, // Boss appears every 3 waves
    BOSS_HEALTH: 50,
    BOSS_POINTS: 5000,
    BOSS_SPEED: 80,
    BOSS_FIRE_RATE: 800,
    BOSS_PHASES: [
        { healthThreshold: 1.0, pattern: 'spread' },
        { healthThreshold: 0.66, pattern: 'spiral' },
        { healthThreshold: 0.33, pattern: 'barrage' }
    ],

    // Combo system
    COMBO_TIMEOUT: 3000, // 3 seconds to maintain combo
    COMBO_MULTIPLIERS: {
        5: 1.5,
        10: 2.0,
        20: 3.0
    },

    // Visual effects
    SCREEN_SHAKE_DURATION: 200,
    SCREEN_SHAKE_INTENSITY: 5,

    // Background scroll speed
    BG_SCROLL_SPEED: 1,
    STARS_SCROLL_SPEED: 2
};
