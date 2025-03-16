class Board {
    constructor() {
        this.grid = this.createEmptyGrid();
        this.element = document.getElementById('game-board');
        this.setupBoard();
    }

    // Create an empty grid
    createEmptyGrid() {
        const grid = [];
        for (let row = 0; row < ROWS; row++) {
            grid[row] = [];
            for (let col = 0; col < COLS; col++) {
                grid[row][col] = EMPTY;
            }
        }
        return grid;
    }

    // Set up the board DOM elements
    setupBoard() {
        this.element.innerHTML = '';
        this.element.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
        this.element.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${row}-${col}`;
                this.element.appendChild(cell);
            }
        }
    }

    // Reset the board
    reset() {
        this.grid = this.createEmptyGrid();
        this.setupBoard();
    }

    // Draw a cell with a letter
    drawCell(x, y, letter, pointClass) {
        if (y < 0) return; // Don't draw above the board
        
        const cell = document.getElementById(`cell-${y}-${x}`);
        if (cell) {
            const letterBlock = document.createElement('div');
            letterBlock.className = `letter-block ${pointClass}`;
            letterBlock.textContent = letter;
            
            // Clear the cell first
            cell.innerHTML = '';
            cell.appendChild(letterBlock);
        }
    }

    // Clear a cell
    clearCell(x, y) {
        if (y < 0) return; // Don't clear above the board
        
        const cell = document.getElementById(`cell-${y}-${x}`);
        if (cell) {
            cell.innerHTML = '';
        }
    }

    // Draw the entire board based on the grid
    drawBoard() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = this.grid[row][col];
                if (cell !== EMPTY) {
                    const letter = cell.letter;
                    const points = cell.points;
                    const pointClass = POINT_CLASSES[points];
                    this.drawCell(col, row, letter, pointClass);
                } else {
                    this.clearCell(col, row);
                }
            }
        }
    }

    // Check if a row is full
    isRowFull(row) {
        for (let col = 0; col < COLS; col++) {
            if (this.grid[row][col] === EMPTY) {
                return false;
            }
        }
        return true;
    }

    // Check for and clear completed words (horizontal and vertical)
    checkWords() {
        const potentialWords = [];
        
        // Find all potential horizontal words
        for (let row = 0; row < ROWS; row++) {
            let startCol = 0;
            while (startCol < COLS) {
                // Skip empty cells
                if (this.grid[row][startCol] === EMPTY) {
                    startCol++;
                    continue;
                }
                
                // Find the end of this continuous sequence
                let endCol = startCol;
                while (endCol < COLS - 1 && this.grid[row][endCol + 1] !== EMPTY) {
                    endCol++;
                }
                
                // If we have at least MIN_WORD_LENGTH letters, check for words
                if (endCol - startCol + 1 >= MIN_WORD_LENGTH) {
                    // Check all possible subwords of this sequence
                    for (let subStart = startCol; subStart <= endCol - MIN_WORD_LENGTH + 1; subStart++) {
                        for (let subEnd = subStart + MIN_WORD_LENGTH - 1; subEnd <= endCol; subEnd++) {
                            // Extract the word
                            let word = '';
                            let score = 0;
                            const cells = [];
                            
                            for (let col = subStart; col <= subEnd; col++) {
                                word += this.grid[row][col].letter;
                                score += this.grid[row][col].points;
                                cells.push({ row, col });
                            }
                            
                            // Check if it's a valid word
                            if (DICTIONARY.includes(word)) {
                                potentialWords.push({
                                    word: word,
                                    score: score,
                                    cells: cells,
                                    length: word.length,
                                    direction: 'horizontal'
                                });
                            }
                        }
                    }
                }
                
                // Move to the next sequence
                startCol = endCol + 1;
            }
        }
        
        // Find all potential vertical words
        for (let col = 0; col < COLS; col++) {
            let startRow = 0;
            while (startRow < ROWS) {
                // Skip empty cells
                if (this.grid[startRow][col] === EMPTY) {
                    startRow++;
                    continue;
                }
                
                // Find the end of this continuous sequence
                let endRow = startRow;
                while (endRow < ROWS - 1 && this.grid[endRow + 1][col] !== EMPTY) {
                    endRow++;
                }
                
                // If we have at least MIN_WORD_LENGTH letters, check for words
                if (endRow - startRow + 1 >= MIN_WORD_LENGTH) {
                    // Check all possible subwords of this sequence
                    for (let subStart = startRow; subStart <= endRow - MIN_WORD_LENGTH + 1; subStart++) {
                        for (let subEnd = subStart + MIN_WORD_LENGTH - 1; subEnd <= endRow; subEnd++) {
                            // Extract the word
                            let word = '';
                            let score = 0;
                            const cells = [];
                            
                            for (let row = subStart; row <= subEnd; row++) {
                                word += this.grid[row][col].letter;
                                score += this.grid[row][col].points;
                                cells.push({ row, col });
                            }
                            
                            // Check if it's a valid word
                            if (DICTIONARY.includes(word)) {
                                potentialWords.push({
                                    word: word,
                                    score: score,
                                    cells: cells,
                                    length: word.length,
                                    direction: 'vertical'
                                });
                            }
                        }
                    }
                }
                
                // Move to the next sequence
                startRow = endRow + 1;
            }
        }
        
        // Sort potential words by length (descending) and then by score (descending)
        potentialWords.sort((a, b) => {
            if (a.length !== b.length) {
                return b.length - a.length; // Longer words first
            }
            return b.score - a.score; // Higher scoring words first
        });
        
        // Process words and remove overlapping ones
        const wordsFound = [];
        const cellsToRemove = new Set();
        const cellsUsed = new Set();
        
        for (const wordInfo of potentialWords) {
            // Check if any of the cells are already used
            let hasOverlap = false;
            for (const cell of wordInfo.cells) {
                const cellKey = `${cell.row}-${cell.col}`;
                if (cellsUsed.has(cellKey)) {
                    hasOverlap = true;
                    break;
                }
            }
            
            // If no overlap, add this word
            if (!hasOverlap) {
                wordsFound.push({
                    word: wordInfo.word,
                    score: wordInfo.score,
                    cells: wordInfo.cells
                });
                
                // Mark cells as used
                for (const cell of wordInfo.cells) {
                    const cellKey = `${cell.row}-${cell.col}`;
                    cellsUsed.add(cellKey);
                    cellsToRemove.add(cellKey);
                }
            }
        }
        
        // Animate and remove the cells
        if (cellsToRemove.size > 0) {
            this.animateAndRemoveCells(Array.from(cellsToRemove).map(coord => {
                const [row, col] = coord.split('-').map(Number);
                return { row, col };
            }));
        }
        
        return wordsFound;
    }

    // Animate and remove cells
    animateAndRemoveCells(cells) {
        // First animate the cells
        cells.forEach(({ row, col }) => {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (cell && cell.firstChild) {
                cell.firstChild.classList.add('clearing');
            }
        });
        
        // Then remove them after animation
        setTimeout(() => {
            // Remove the cells from the grid
            cells.forEach(({ row, col }) => {
                this.grid[row][col] = EMPTY;
                this.clearCell(col, row);
            });
            
            // Make blocks fall after clearing with a slower animation
            setTimeout(() => {
                this.fallBlocks();
                
                // Redraw the entire board to ensure consistency
                this.drawBoard();
                
                // Check for new words that may have formed after blocks fell
                this.checkForNewWords();
            }, 300); // Delay the falling to make it more visible
        }, 800); // Longer animation duration
    }
    
    // Check for new words that may have formed after blocks fell
    checkForNewWords() {
        // Check for new words
        const newWordsFound = this.checkWords();
        
        // If new words were found, process them
        if (newWordsFound.length > 0) {
            // First highlight the words
            const cellsToHighlight = [];
            newWordsFound.forEach(wordInfo => {
                wordInfo.cells.forEach(cell => {
                    cellsToHighlight.push(cell);
                });
            });
            
            // Add highlighting animation
            cellsToHighlight.forEach(({ row, col }) => {
                const cell = document.getElementById(`cell-${row}-${col}`);
                if (cell && cell.firstChild) {
                    cell.firstChild.classList.add('highlighting');
                }
            });
            
            // Wait for the highlight animation before clearing
            setTimeout(() => {
                // Update score
                let scoreGain = 0;
                newWordsFound.forEach(wordInfo => {
                    scoreGain += wordInfo.score;
                    
                    // Add to word list
                    const wordListElement = document.getElementById('word-list');
                    const wordElement = document.createElement('p');
                    wordElement.textContent = `${wordInfo.word} (+${wordInfo.score})`;
                    wordListElement.prepend(wordElement);
                });
                
                // Update the score display
                const scoreElement = document.getElementById('score');
                const currentScore = parseInt(scoreElement.textContent);
                scoreElement.textContent = currentScore + scoreGain;
                
                // Update the word count
                const wordCountElement = document.getElementById('words');
                const currentWordCount = parseInt(wordCountElement.textContent);
                wordCountElement.textContent = currentWordCount + newWordsFound.length;
                
                // Check if we should increase the level
                const wordCount = parseInt(wordCountElement.textContent);
                const levelElement = document.getElementById('level');
                const currentLevel = parseInt(levelElement.textContent);
                const newLevel = Math.floor(wordCount / 10) + 1;
                
                if (newLevel > currentLevel) {
                    levelElement.textContent = newLevel;
                    // Update game speed based on level
                    const gameSpeed = Math.max(900 - (newLevel - 1) * 50, 450);
                    document.dispatchEvent(new CustomEvent('levelUp', { detail: { level: newLevel, speed: gameSpeed } }));
                }
                
                // Now clear the highlighted words
                this.animateAndRemoveCells(cellsToHighlight);
            }, 1000); // Wait 1 second to show the highlighted words
            
            // Return true to indicate we're handling the words separately
            return true;
        }
        
        return false;
    }

    // Make blocks fall after clearing
    fallBlocks() {
        let blocksMoved;
        
        // We may need multiple passes to ensure all blocks fall properly
        do {
            blocksMoved = false;
            
            // Start from the bottom row and work up
            for (let col = 0; col < COLS; col++) {
                // Process each column from bottom to top
                for (let row = ROWS - 2; row >= 0; row--) {
                    if (this.grid[row][col] !== EMPTY && this.grid[row + 1][col] === EMPTY) {
                        // Move the block down one position
                        this.grid[row + 1][col] = this.grid[row][col];
                        this.grid[row][col] = EMPTY;
                        blocksMoved = true;
                    }
                }
            }
            
            // Continue until no more blocks can fall
        } while (blocksMoved);
    }

    // Check if the game is over (blocks stacked to the top)
    isGameOver() {
        // Check if any blocks in the top row
        for (let col = 0; col < COLS; col++) {
            if (this.grid[0][col] !== EMPTY) {
                return true;
            }
        }
        return false;
    }
}
