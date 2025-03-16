# Word Tetris

A word-based variant of Tetris where each block is a letter. Form words to clear blocks and score points based on Scrabble letter values.

## How to Play

1. **Objective**: Create words by arranging falling letter blocks. When valid words are formed (horizontally or vertically), they disappear and you earn points.

2. **Controls**:
   - **Arrow Left/Right**: Move the current piece left or right
   - **Arrow Up**: Rotate the piece
   - **Arrow Down**: Soft drop (move down faster)
   - **Space**: Hard drop (instantly drop to the bottom)
   - **P**: Pause/Resume the game

3. **Scoring**:
   - Each letter has a point value based on Scrabble:
     - 1 point: A, E, I, O, U, L, N, S, T, R
     - 2 points: D, G
     - 3 points: B, C, M, P
     - 4 points: F, H, V, W, Y
     - 5 points: K
     - 8 points: J, X
     - 10 points: Q, Z
   - When you form a valid word, you earn the sum of all letter points in that word.

4. **Leveling Up**:
   - The game increases in speed as you form more words.
   - Every 5 words, you advance to the next level.

## Features

- Tetris-style gameplay with letter blocks
- Word recognition with Scrabble-based scoring
- Increasing difficulty levels
- Mobile-friendly touch controls
- Next piece preview
- Word history display

## Installation

No installation required! This is a web-based game that runs in any modern browser.

## Hosting on GitHub Pages

To host this game on GitHub Pages:

1. Create a new GitHub repository
2. Upload all the files from this project to your repository
3. Go to the repository settings
4. Scroll down to the GitHub Pages section
5. Select the main branch as the source
6. Your game will be available at `https://[your-username].github.io/[repository-name]/`

## Development

This game is built using vanilla JavaScript, HTML, and CSS. The code is organized into the following files:

- `index.html`: Main HTML structure
- `css/styles.css`: Styling for the game
- `js/constants.js`: Game constants and configurations
- `js/tetromino.js`: Tetromino piece logic
- `js/board.js`: Game board and word detection
- `js/game.js`: Main game logic
- `js/main.js`: Event handling and initialization

## Customization

You can customize the game by modifying the constants in `js/constants.js`:

- Add more words to the `DICTIONARY` array
- Adjust letter frequencies in `LETTER_FREQUENCIES`
- Change point values in `LETTER_POINTS`
- Modify game speeds in `SPEEDS`

## License

This project is open source and available for personal and educational use.

## Acknowledgments

- Inspired by Tetris and word games like Scrabble and Boggle
- Built with vanilla JavaScript, HTML, and CSS
