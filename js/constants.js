// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const EMPTY = 0;

// Game speeds (in milliseconds) - more gradual progression
const SPEEDS = {
    1: 900,  // Starting speed (slower)
    2: 850,
    3: 800,
    4: 750,
    5: 700,
    6: 650,
    7: 600,
    8: 550,
    9: 500,
    10: 450  // Final speed (not as fast as before)
};

// Letter frequencies (based on Scrabble distribution)
const LETTER_FREQUENCIES = {
    'A': 9,
    'B': 2,
    'C': 2,
    'D': 4,
    'E': 12,
    'F': 2,
    'G': 3,
    'H': 2,
    'I': 9,
    'J': 1,
    'K': 1,
    'L': 4,
    'M': 2,
    'N': 6,
    'O': 8,
    'P': 2,
    'Q': 1,
    'R': 6,
    'S': 4,
    'T': 6,
    'U': 4,
    'V': 2,
    'W': 2,
    'X': 1,
    'Y': 2,
    'Z': 1
};

// Scrabble point values for each letter
const LETTER_POINTS = {
    'A': 1, 'E': 1, 'I': 1, 'O': 1, 'U': 1, 'L': 1, 'N': 1, 'S': 1, 'T': 1, 'R': 1,
    'D': 2, 'G': 2,
    'B': 3, 'C': 3, 'M': 3, 'P': 3,
    'F': 4, 'H': 4, 'V': 4, 'W': 4, 'Y': 4,
    'K': 5,
    'J': 8, 'X': 8,
    'Q': 10, 'Z': 10
};

// CSS class mapping for point values
const POINT_CLASSES = {
    1: 'points-1',
    2: 'points-2',
    3: 'points-3',
    4: 'points-4',
    5: 'points-5',
    8: 'points-8',
    10: 'points-10'
};

// Tetromino shapes (standard Tetris shapes)
const SHAPES = [
    // I shape
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // J shape
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // L shape
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // O shape
    [
        [1, 1],
        [1, 1]
    ],
    // S shape
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    // T shape
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // Z shape
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
];

// Minimum word length to be considered valid
const MIN_WORD_LENGTH = 3;

// Dictionary of valid words (simplified version - would be replaced with a more comprehensive dictionary)
// Dictionary will be loaded from JSON file
let DICTIONARY = [];

// Load the dictionary from the JSON file
fetch('js/dictionary.json')
    .then(response => response.json())
    .then(data => {
        DICTIONARY = data.words;
        console.log(`Dictionary loaded with ${DICTIONARY.length} words`);
    })
    .catch(error => {
        console.error('Error loading dictionary:', error);
        // Fallback to some basic words if dictionary fails to load
        DICTIONARY = ["CAT", "DOG", "RUN", "JUMP", "PLAY", "HORN", "RUST"];
    });
// This is just a sample of common 3-letter words
