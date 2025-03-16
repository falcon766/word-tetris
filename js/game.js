class Game {
    constructor() {
        this.board = new Board();
        this.score = 0;
        this.level = 1;
        this.wordCount = 0;
        this.currentPiece = null;
        this.nextPiece = null;
        this.gameOver = false;
        this.paused = false;
        this.dropInterval = null;
        this.wordsFound = [];
        
        // DOM elements
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.wordsElement = document.getElementById('words');
        this.nextPieceElement = document.getElementById('next-piece');
        this.wordListElement = document.getElementById('word-list');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.finalScoreElement = document.getElementById('final-score');
        
        // Set up the next piece display
        this.setupNextPieceDisplay();
    }

    // Set up the next piece display
    setupNextPieceDisplay() {
        this.nextPieceElement.innerHTML = '';
        this.nextPieceElement.style.gridTemplateColumns = 'repeat(4, 1fr)';
        this.nextPieceElement.style.gridTemplateRows = 'repeat(4, 1fr)';
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `next-cell-${row}-${col}`;
                this.nextPieceElement.appendChild(cell);
            }
        }
    }

    // Start the game
    start() {
        if (this.dropInterval) {
            clearInterval(this.dropInterval);
        }
        
        this.board.reset();
        this.score = 0;
        this.level = 1;
        this.wordCount = 0;
        this.gameOver = false;
        this.paused = false;
        this.wordsFound = [];
        
        this.updateScore();
        this.updateWordList();
        
        // Hide game over modal if visible
        this.gameOverModal.style.display = 'none';
        
        // Create the first piece
        this.createNewPiece();
        
        // Start the game loop
        this.dropInterval = setInterval(() => this.drop(), SPEEDS[this.level]);
    }

    // Pause or resume the game
    togglePause() {
        this.paused = !this.paused;
        
        if (this.paused) {
            clearInterval(this.dropInterval);
        } else {
            this.dropInterval = setInterval(() => this.drop(), SPEEDS[this.level]);
        }
    }

    // Create a new tetromino piece
    createNewPiece() {
        // If there's a next piece, make it the current piece
        if (this.nextPiece) {
            this.currentPiece = this.nextPiece;
        } else {
            // Create a random piece for the first time
            const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            this.currentPiece = new Tetromino([...randomShape], this.board);
        }
        
        // Create a new next piece
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        this.nextPiece = new Tetromino([...randomShape], this.board);
        
        // Display the next piece
        this.displayNextPiece();
        
        // Draw the current piece
        this.currentPiece.draw();
        
        // Check if the game is over
        if (this.currentPiece.isCollision()) {
            this.gameOver = true;
            clearInterval(this.dropInterval);
            this.showGameOver();
        }
    }

    // Display the next piece in the side panel
    displayNextPiece() {
        // Clear the next piece display
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.getElementById(`next-cell-${row}-${col}`);
                if (cell) {
                    cell.innerHTML = '';
                }
            }
        }
        
        // Draw the next piece
        for (let row = 0; row < this.nextPiece.shape.length; row++) {
            for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                if (this.nextPiece.shape[row][col]) {
                    const letter = this.nextPiece.letters[row][col];
                    const points = LETTER_POINTS[letter];
                    const pointClass = POINT_CLASSES[points];
                    
                    const cell = document.getElementById(`next-cell-${row}-${col}`);
                    if (cell) {
                        const letterBlock = document.createElement('div');
                        letterBlock.className = `letter-block ${pointClass}`;
                        letterBlock.textContent = letter;
                        cell.appendChild(letterBlock);
                    }
                }
            }
        }
    }

    // Move the current piece down
    drop() {
        if (this.gameOver || this.paused) return;
        
        if (!this.currentPiece.moveDown()) {
            // The piece has landed
            this.currentPiece.lock();
            
            // Check for words
            const wordsFound = this.board.checkWords();
            
            if (wordsFound.length > 0) {
                // Add words to the list and update score
                this.processWords(wordsFound);
            }
            
            // Check if the game is over
            if (this.board.isGameOver()) {
                this.gameOver = true;
                clearInterval(this.dropInterval);
                this.showGameOver();
                return;
            }
            
            // Create a new piece
            this.createNewPiece();
        }
    }

    // Process words found and update score
    processWords(wordsFound) {
        let totalScore = 0;
        
        wordsFound.forEach(wordInfo => {
            totalScore += wordInfo.score;
            this.wordCount++;
            
            // Add to words found list
            this.wordsFound.push({
                word: wordInfo.word,
                score: wordInfo.score
            });
        });
        
        // Update score
        this.score += totalScore;
        
        // Update level (every 10 words for slower progression)
        this.level = Math.min(10, Math.floor(this.wordCount / 10) + 1);
        
        // Update the display
        this.updateScore();
        this.updateWordList();
        
        // Update game speed
        clearInterval(this.dropInterval);
        this.dropInterval = setInterval(() => this.drop(), SPEEDS[this.level]);
    }

    // Update the score display
    updateScore() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.wordsElement.textContent = this.wordCount;
    }

    // Update the word list display
    updateWordList() {
        this.wordListElement.innerHTML = '';
        
        // Show the most recent words (up to 10)
        const recentWords = this.wordsFound.slice(-10).reverse();
        
        recentWords.forEach(wordInfo => {
            const wordElement = document.createElement('p');
            wordElement.textContent = `${wordInfo.word} (${wordInfo.score} pts)`;
            this.wordListElement.appendChild(wordElement);
        });
    }

    // Show game over screen
    showGameOver() {
        this.finalScoreElement.textContent = this.score;
        this.gameOverModal.style.display = 'flex';
    }

    // Move the current piece left
    moveLeft() {
        if (this.gameOver || this.paused) return;
        this.currentPiece.moveLeft();
    }

    // Move the current piece right
    moveRight() {
        if (this.gameOver || this.paused) return;
        this.currentPiece.moveRight();
    }

    // Rotate the current piece
    rotate() {
        if (this.gameOver || this.paused) return;
        this.currentPiece.rotate();
    }

    // Soft drop (move down faster)
    softDrop() {
        if (this.gameOver || this.paused) return;
        this.currentPiece.moveDown();
    }

    // Hard drop (drop to the bottom instantly)
    hardDrop() {
        if (this.gameOver || this.paused) return;
        this.currentPiece.hardDrop();
        this.drop(); // Process the landing immediately
    }
}
