# Retro 2D Space Shooter - Game Specification

## Overview
A classic vertical-scrolling space shooter built with Phaser 3, featuring retro pixel art, power-ups, boss fights, and progressive difficulty.

## Technology Stack
- **Engine**: Phaser 3
- **Language**: JavaScript/TypeScript
- **Runtime**: Browser (HTML5)

## Core Requirements

### Gameplay Mechanics
- **Player Control**: Arrow keys or WASD for movement, Spacebar to shoot
- **Scrolling**: Vertical auto-scrolling background
- **Lives System**: Player starts with 3 lives
- **Scoring**: Points awarded for destroying enemies and collecting power-ups
- **High Score**: Persistent high score tracking (localStorage)
- **Difficulty**: Progressive difficulty with wave-based enemy spawning

### Game States
1. Main Menu
2. Gameplay
3. Game Over
4. Pause Menu

### Player Mechanics
- Ship movement (constrained to screen bounds)
- Shooting (rate-limited projectiles)
- Collision detection (enemies, projectiles, power-ups)
- Damage/death animations
- Respawn with invincibility frames

### Enemy Mechanics
- Multiple enemy types with different behaviors
- Wave-based spawning patterns
- Health points for larger enemies
- Death animations and explosions
- Enemy projectiles

### Power-Up System
- **Weapon Upgrades**: Enhanced firing rate, spread shots
- **Shield**: Temporary invincibility
- **Score Multiplier**: Bonus points
- Random drops from destroyed enemies

### Boss Fights
- End-of-level boss encounters
- Multi-phase attack patterns
- Health bar display
- Special victory screen/rewards

## Asset Mapping

### Player Ship
- **Primary Asset**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/ship.png`
- **Alternative**: `Legacy Collection/Assets/Characters/top-down-shooter-ship/spritesheets/red/ship-01.png`
- **Thrust Animation**: `Legacy Collection/Assets/Characters/top-down-shooter-ship/sprites/thrust/`

### Enemies

#### Small Enemies (Fast, Low Health)
- **Asset**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemySmall/enemy-small1.png`
- **Asset**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemySmall/enemy-small2.png`
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/enemy-small.png`

#### Medium Enemies (Moderate Stats)
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/enemy-medium.png`

#### Large Enemies (Slow, High Health)
- **Asset**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemyBig/enemy-big1.png`
- **Asset**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemyBig/enemy-big2.png`
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/enemy-big.png`

#### Organic Enemy (Special Type)
- **Asset**: `Legacy Collection/Assets/Characters/alien-flying-enemy/sprites/`
- **Spritesheet**: `Legacy Collection/Assets/Characters/alien-flying-enemy/spritesheet.png`

#### Boss Enemy
- **Asset**: `Legacy Collection/Assets/Misc/top-down-boss/`
- **Alternative**: Use scaled-up enemy-big with enhanced stats

### Projectiles

#### Player Weapons
- **Standard Shot**: `Legacy Collection/Assets/Misc/Warped shooting fx/Bolt/Sprites/bolt1.png`
- **Laser Bolts**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/laser-bolts.png`
- **Pulse Weapon**: `Legacy Collection/Assets/Misc/Warped shooting fx/Pulse/Sprites/pulse1.png`
- **Crossed Shot**: `Legacy Collection/Assets/Misc/Warped shooting fx/crossed/Sprites/crossed1.png`

#### Enemy Projectiles
- **Asset**: `Legacy Collection/Assets/Misc/EnemyProjectile/`
- **Alternative**: `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/enemy/sprites/`

### Power-Ups
- **Power-Up 1**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up1.png` (Weapon Upgrade)
- **Power-Up 2**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up2.png` (Shield)
- **Power-Up 3**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up3.png` (Score Multiplier)
- **Power-Up 4**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up4.png` (Extra Life)
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/power-up.png`

### Visual Effects

#### Explosions
- **Main Explosion**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Explosion/explosion1.png` (9 frames)
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/explosion.png`
- **Alternative**: `Legacy Collection/Assets/Misc/Explosion/sprites/explosion-animation1.png` (9 frames)

#### Hit Effects
- **Asset**: `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Hit/sprites/hit1.png` (4 frames)
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Hit/hit.png`

#### Flash Effects
- **Asset**: `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/flash/flash.png`

### Backgrounds

#### Space Background (Parallax)
- **Primary Background**: `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/blue-back.png`
- **Stars Layer**: `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/blue-stars.png`
- **Big Planet Prop**: `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/prop-planet-big.png`
- **Small Planet Prop**: `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/prop-planet-small.png`
- **Asteroid 1**: `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/asteroid-1.png`
- **Asteroid 2**: `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/asteroid-2.png`

#### Alternative Backgrounds
- **Classic Space**: `Legacy Collection/Assets/Environments/space_background_pack/Old Version/layers/`
- **Simple Stars**: `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/background/layered/bg-stars.png`

### Environmental Hazards
- **Asteroids**: `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/asteroids/asteroid.png`
- **Small Asteroids**: `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/asteroids/asteroid-small.png`

## Three Playable Milestones

---

## Milestone 1: Core Gameplay Loop
**Goal**: Playable game with basic mechanics and one enemy type

### Features
- [x] Game initialization with Phaser 3
- [x] Player ship with movement controls (arrow keys/WASD)
- [x] Player shooting mechanics (spacebar)
- [x] Single enemy type (small enemies) with basic movement pattern
- [x] Collision detection (player bullets hit enemies, enemies hit player)
- [x] Basic explosion effects
- [x] Simple scrolling space background
- [x] Score counter (UI)
- [x] Lives counter (UI)
- [x] Game over screen
- [x] Restart functionality

### Assets Used (Milestone 1)
- Player: `ship.png` spritesheet
- Enemy: `enemy-small.png` sprites
- Projectiles: `laser-bolts.png`
- Explosions: `explosion.png` spritesheet
- Background: Blue space background layers
- Effects: Hit sprites

### Success Criteria
- Player can move and shoot
- Enemies spawn and move downward
- Collisions register correctly
- Player dies after 3 hits
- Game can be restarted

---

## Milestone 2: Enhanced Gameplay
**Goal**: Multiple enemy types, power-ups, and polished mechanics

### Features (Additional to Milestone 1)
- [x] Three enemy types (small, medium, large) with unique behaviors
- [x] Enemy firing mechanics
- [x] Wave-based enemy spawning system
- [x] Power-up system (4 types)
  - Weapon upgrade (faster/spread shots)
  - Shield (temporary invincibility)
  - Score multiplier
  - Extra life
- [x] Weapon upgrade system
- [x] Main menu screen
- [x] Pause functionality
- [x] High score tracking (localStorage)
- [x] Sound effects (player shoot, explosion, hit, power-up collect)
- [x] Parallax scrolling background
- [x] Progressive difficulty (enemies get faster/more frequent)
- [x] Asteroid hazards

### Assets Used (Milestone 2)
All Milestone 1 assets PLUS:
- Enemies: `enemy-medium.png`, `enemy-big1.png`, `alien-flying-enemy` sprites
- Power-ups: All 4 power-up sprites
- Projectiles: Additional weapon types (bolt, pulse, crossed)
- Enemy projectiles: Enemy bullet sprites
- Background: Additional parallax layers with planets and asteroids
- Hazards: Asteroid sprites

### Success Criteria
- Different enemy types behave distinctly
- Power-ups spawn and grant correct abilities
- Waves become progressively harder
- Menu and pause systems work
- High score persists between sessions

---

## Milestone 3: Boss Fights & Polish
**Goal**: Complete game with boss encounters and final polish

### Features (Additional to Milestone 2)
- [x] Boss fight system
  - Multi-phase attack patterns
  - Health bar UI
  - Special movement patterns
  - Victory animation and rewards
- [x] Level/Wave progression system
- [x] Boss appears every 3-5 waves
- [x] Enhanced visual effects
  - Screen shake on impacts
  - Particle effects
  - Flash effects on damage
- [x] Player death and respawn animation
- [x] Invincibility frames after respawn
- [x] Combo system (bonus for consecutive kills)
- [x] Background music
- [x] Victory screen (after defeating boss)
- [x] Credits screen
- [x] Polish and balancing
  - Tuned difficulty curve
  - Balanced power-up spawn rates
  - Smooth animations
  - Responsive controls

### Assets Used (Milestone 3)
All previous assets PLUS:
- Boss: `top-down-boss` or scaled `enemy-big` with modifications
- Effects: Flash effects, enhanced explosions
- UI: Custom health bars, combo indicators

### Success Criteria
- Boss fights are challenging but fair
- All animations are smooth
- Game feels polished and complete
- Audio enhances gameplay
- Difficulty curve provides good pacing
- Game is fun to replay

---

## Technical Architecture

### Project Structure
```
space-shooter/
├── index.html
├── package.json
├── assets/
│   ├── sprites/
│   ├── backgrounds/
│   ├── effects/
│   ├── audio/
├── src/
│   ├── scenes/
│   │   ├── PreloadScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── GameOverScene.js
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Boss.js
│   │   ├── Projectile.js
│   │   ├── PowerUp.js
│   ├── managers/
│   │   ├── EnemySpawner.js
│   │   ├── ScoreManager.js
│   │   ├── WaveManager.js
│   ├── config.js
│   ├── main.js
```

### Game Constants
- Screen size: 800x600 (or 16:9 ratio)
- Player speed: 200 pixels/second
- Player fire rate: 300ms cooldown
- Enemy spawn rate: Wave-based (dynamic)
- Power-up drop chance: 15%

## Development Timeline

1. **Milestone 1**: Core mechanics (~Foundation)
2. **Milestone 2**: Feature complete (~Enhanced)
3. **Milestone 3**: Polish and bosses (~Complete)

## Testing Checklist

### Milestone 1
- [ ] Player movement smooth and responsive
- [ ] Bullets fire consistently
- [ ] Enemies spawn at regular intervals
- [ ] Collisions detected accurately
- [ ] Score increments correctly
- [ ] Game over triggers at 0 lives

### Milestone 2
- [ ] All enemy types spawn correctly
- [ ] Power-ups grant correct abilities
- [ ] Difficulty increases over time
- [ ] High score saves and loads
- [ ] Pause/resume works correctly
- [ ] All weapons function as intended

### Milestone 3
- [ ] Boss patterns work correctly
- [ ] Boss health depletes properly
- [ ] Victory screen appears after boss
- [ ] All audio plays at appropriate times
- [ ] No performance issues
- [ ] Game is balanced and fun

## Future Enhancements (Post-Launch)
- Multiple levels with different backgrounds
- Co-op multiplayer
- Different playable ships
- Achievement system
- Leaderboard integration
- Mobile touch controls
- Additional boss types
