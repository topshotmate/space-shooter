# Retro 2D Space Shooter

A classic vertical-scrolling space shooter built with Phaser 3 and retro pixel art.

## Milestone 3 - Boss Fights & Polish ✅ (COMPLETE!)

### Boss System
- **Epic Boss Battles** appear every 3 waves
- **Multi-Phase Attack Patterns**:
  - Phase 1 (100-66% health): Spread shot pattern
  - Phase 2 (66-33% health): Spiral bullet pattern
  - Phase 3 (33-0% health): Rapid barrage pattern
- **Boss Health Bar** with color-changing indicator
- **Victory Screen** after defeating bosses with bonus rewards
- **Continue System** - Keep playing after boss victories

### Combo System
- Build combos by destroying enemies consecutively
- **Combo Multipliers**:
  - 5+ kills: 1.5x points (Yellow)
  - 10+ kills: 2.0x points (Orange)
  - 20+ kills: 3.0x points (Purple)
- Combo resets if you don't destroy an enemy within 3 seconds
- Combo also resets when taking damage

### Enhanced Visual Effects
- **Screen Shake** on explosions, hits, and boss damage
- **Particle Effects** on all explosions and enemy destruction
- **Enhanced Explosions** - Bigger explosions for boss defeats
- **Visual Feedback** - Flash effects and color changes

### Quality of Life
- **Improved Pause Menu** with high score and controls reminder
- Boss wave announcements
- Smooth transitions between waves
- Score continues between waves after boss victories

## Milestone 2 - Enhanced Gameplay ✅

### Core Features
- **Main Menu** with high score display and controls
- **Wave-Based Gameplay** with progressive difficulty
- **Multiple Enemy Types**: Small, Medium, Large, and Alien enemies with unique behaviors
- **Enemy AI**: Enemies can shoot back with varying fire rates
- **Power-Up System** (4 types):
  - Weapon Upgrade (3 levels, spread shot at max level)
  - Shield (temporary invincibility)
  - Score Multiplier (2x for limited time)
  - Extra Life
- **Dynamic Background** with randomly spawning planets and asteroids
- **Asteroid Hazards** that damage the player
- **Pause Functionality** (P key)
- **High Score Tracking** (persists between sessions)
- **Progressive Difficulty** (enemies get faster and more numerous)

### Visual Features
- Animated sprites for all enemies
- Explosion and hit effects
- Shield visual indicator
- Wave announcements
- Weapon level display

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:8080
```

## Controls

- **Movement**: Arrow keys or WASD
- **Shoot**: Spacebar
- **Pause**: P key
- **Start Game**: Spacebar (on menu)
- **Restart**: Spacebar (on game over screen)

## Game Mechanics

- Start with 3 lives
- Points vary by enemy type:
  - Small enemies: 100 points
  - Medium enemies: 200 points
  - Alien enemies: 300 points
  - Large enemies: 500 points
  - **Boss**: 5000 points
- Wave-based progression with increasing difficulty
- **Boss appears every 3rd wave** (Waves 3, 6, 9, etc.)
- 15% chance for power-ups to drop from destroyed enemies
- Enemies have different health, speed, and attack patterns
- Shield provides temporary invincibility (8 seconds)
- Score multiplier doubles points for 10 seconds
- Weapon upgrades:
  - Level 1: Standard fire rate
  - Level 2: Faster fire rate
  - Level 3: Spread shot with 3 bullets
- **Combo system** multiplies points for consecutive kills
- Game continues after boss victory - see how far you can go!

## Assets Used

All pixel art assets from the Legacy Collection:
- **Player**: SpaceShipShooter ship spritesheet
- **Enemies**:
  - Small enemies (fast, low health)
  - Medium enemies (moderate stats, can shoot)
  - Large enemies (slow, high health, shoots frequently)
  - Alien enemies (unique movement, can shoot)
  - **Boss** (50 HP, multi-phase attacks)
- **Projectiles**:
  - Player laser bolts
  - Enemy bullets
  - Additional weapon types (bolt, pulse)
- **Power-Ups**: 4 different power-up sprites
- **Effects**:
  - Standard explosions
  - **Big boss explosions**
  - Hit effects
  - Flash effects
  - **Particle effects**
- **Background**:
  - Blue space parallax layers
  - Dynamic planets (big and small)
  - Background asteroids
- **Hazards**: Asteroid sprites

## Game Complete!

All three milestones are complete! The game features:
- ✅ Core gameplay loop with enemies and shooting
- ✅ Multiple enemy types with AI
- ✅ Power-up and upgrade systems
- ✅ Wave progression and difficulty scaling
- ✅ Epic boss battles every 3 waves
- ✅ Combo system for high scores
- ✅ Enhanced visual effects and polish
- ✅ Victory screens and continuous gameplay

Enjoy the game and see how high you can score!
