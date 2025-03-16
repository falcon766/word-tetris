class Tetromino {
    constructor(shape, board) {
        this.shape = shape;
        this.board = board;
        this.color = 'blue';
        this.x = Math.floor(COLS / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
        this.letters = this.generateLetters();
    }

    // Generate random letters for each block in the tetromino
    generateLetters() {
        const letters = [];
        
        // Create a weighted distribution of letters based on LETTER_FREQUENCIES
        let weightedLetters = [];
        for (const [letter, frequency] of Object.entries(LETTER_FREQUENCIES)) {
            for (let i = 0; i < frequency; i++) {
                weightedLetters.push(letter);
            }
        }
        
        // Shuffle the weighted letters
        weightedLetters = this.shuffleArray(weightedLetters);
        
        // Assign letters to each block in the tetromino
        for (let row = 0; row < this.shape.length; row++) {
            letters[row] = [];
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    letters[row][col] = weightedLetters.pop();
                } else {
                    letters[row][col] = null;
                }
            }
        }
        
        return letters;
    }
    
    // Fisher-Yates shuffle algorithm
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Draw the tetromino on the board
    draw() {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    const letter = this.letters[row][col];
                    const points = LETTER_POINTS[letter];
                    const pointClass = POINT_CLASSES[points];
                    
                    this.board.drawCell(this.x + col, this.y + row, letter, pointClass);
                }
            }
        }
    }

    // Erase the tetromino from the board
    erase() {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    this.board.clearCell(this.x + col, this.y + row);
                }
            }
        }
    }

    // Move the tetromino down
    moveDown() {
        this.erase();
        this.y++;
        if (this.isCollision()) {
            this.y--;
            this.draw();
            return false;
        }
        this.draw();
        return true;
    }

    // Move the tetromino left
    moveLeft() {
        this.erase();
        this.x--;
        if (this.isCollision()) {
            this.x++;
            this.draw();
            return false;
        }
        this.draw();
        return true;
    }

    // Move the tetromino right
    moveRight() {
        this.erase();
        this.x++;
        if (this.isCollision()) {
            this.x--;
            this.draw();
            return false;
        }
        this.draw();
        return true;
    }

    // Rotate the tetromino
    rotate() {
        this.erase();
        
        // Create a new rotated shape matrix
        const newShape = [];
        for (let col = 0; col < this.shape[0].length; col++) {
            newShape[col] = [];
            for (let row = this.shape.length - 1; row >= 0; row--) {
                newShape[col][this.shape.length - 1 - row] = this.shape[row][col];
            }
        }
        
        // Create a new rotated letters matrix
        const newLetters = [];
        for (let col = 0; col < this.letters[0].length; col++) {
            newLetters[col] = [];
            for (let row = this.letters.length - 1; row >= 0; row--) {
                newLetters[col][this.letters.length - 1 - row] = this.letters[row][col];
            }
        }
        
        // Save the current shape and letters
        const oldShape = this.shape;
        const oldLetters = this.letters;
        
        // Try the new rotated shape
        this.shape = newShape;
        this.letters = newLetters;
        
        // If there's a collision, revert back
        if (this.isCollision()) {
            this.shape = oldShape;
            this.letters = oldLetters;
        }
        
        this.draw();
    }

    // Check if the tetromino collides with the board boundaries or other blocks
    isCollision() {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    const newX = this.x + col;
                    const newY = this.y + row;
                    
                    // Check if out of bounds
                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return true;
                    }
                    
                    // Check if already occupied (and not part of the current tetromino)
                    if (newY >= 0 && this.board.grid[newY][newX] !== EMPTY) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Hard drop the tetromino
    hardDrop() {
        this.erase();
        let dropDistance = 0;
        
        // Keep moving down until collision
        while (!this.isCollision()) {
            this.y++;
            dropDistance++;
        }
        
        // Move back up one step
        this.y--;
        this.draw();
        
        return dropDistance;
    }

    // Lock the tetromino in place on the board
    lock() {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    const boardRow = this.y + row;
                    const boardCol = this.x + col;
                    
                    // Skip if the cell is above the board
                    if (boardRow < 0) continue;
                    
                    // Store the letter and points in the board grid
                    const letter = this.letters[row][col];
                    const points = LETTER_POINTS[letter];
                    
                    this.board.grid[boardRow][boardCol] = {
                        letter: letter,
                        points: points
                    };
                }
            }
        }
    }
}
