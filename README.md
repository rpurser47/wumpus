# Hunt the Wumpus (React + TypeScript)

A graphical, single-page web version of the classic Hunt the Wumpus game, using an irregular 16-room cave map, medieval fantasy theme, and immersive sound effects.

## Features
- **Interactive Cave Map**: 16-room irregular cave layout with visual indicators for movement and shooting
- **Random Starting Room**: Each game begins in a different room (always safe from hazards)
- **Classic Wumpus Rules**: 1 Wumpus, 2 pits, 2 bats, 5 arrows
- **Atmospheric Room Descriptions**: Each room has a unique description to enhance immersion
- **Immersive Sound Effects**: Audio feedback for all game actions (movement, shooting, hazards, win/lose conditions)
- **Victory Celebration**: Confetti animation when you successfully slay the Wumpus
- **Medieval Fantasy Theme**: Decorative title and cave background for a cohesive fantasy experience
- **MVC Architecture**: Clean separation of concerns for maintainability
- **Modern UI**: Responsive layout with intuitive controls

## Game Rules
1. **Objective**: Hunt and kill the Wumpus without falling into pits or getting eaten
2. **Movement**: Click on connected rooms to move (highlighted in green)
3. **Hazards**:
   - **Wumpus**: If you enter its room, it eats you
   - **Pits**: If you fall in, you lose
   - **Bats**: Transport you to a random room
4. **Warnings**:
   - "You smell a terrible stench..." (Wumpus nearby)
   - "You feel a cold draft..." (Pit nearby)
   - "You hear rustling..." (Bats nearby)
5. **Shooting**: Enter shoot mode and select a connected room to fire an arrow
6. **Winning**: Successfully shoot the Wumpus

## Getting Started
1. Install dependencies: `npm install`
2. Start the dev server: `npm start`
3. Place your cave background image as `public/cave-bg.jpg`
4. Sound effects are included in `public/sounds/`:
   - `move.wav` - Moving between rooms
   - `shoot.wav` - Shooting an arrow
   - `bat.wav` - Encountering bats
   - `pit.wav` - Falling into a pit
   - `wumpus_eats.wav` - Getting eaten by the Wumpus
   - `wumpus_dies.wav` - Successfully killing the Wumpus
   - `win.mp3` - Victory celebration
   - `lose.wav` - Game over

## Project Structure
- `src/model/` — Game logic and state (GameModel.ts)
- `src/view/` — Presentational components (CaveMap, StatusPanel, ActionPanel, MessageLog)
- `src/styles/` — Theme CSS
- `public/` — Static assets (background, sounds)

## Implementation Details
- **Model**: Handles game state, hazard placement, room descriptions, and game rules
- **View**: Pure presentational components for the UI with atmospheric styling
- **Controller**: Connects the model and view, handling user interactions and sound effects
- **Random Starting Room**: Each game begins in a different room with no hazards
- **Sound Sequence**: When killing the Wumpus, the death sound plays first, followed by victory music
- **Background Image**: Fills the entire window while maintaining aspect ratio
- **Decorative Title**: Medieval-style font with golden glow effects

## Future Enhancements
- Difficulty levels
- High score system
- Animations for movement and shooting
- Mini-map or fog of war mechanic

---

Developed on April 28, 2025

Enjoy your adventure hunting the Wumpus!
