// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create a new game instance
    const game = new Game();
    
    // DOM elements
    const startButton = document.getElementById('start-button');
    const pauseButton = document.getElementById('pause-button');
    const resetButton = document.getElementById('reset-button');
    const playAgainButton = document.getElementById('play-again-button');
    
    // Event listeners for buttons
    startButton.addEventListener('click', () => {
        game.start();
    });
    
    pauseButton.addEventListener('click', () => {
        game.togglePause();
        pauseButton.textContent = game.paused ? 'Resume' : 'Pause';
    });
    
    resetButton.addEventListener('click', () => {
        game.start();
    });
    
    playAgainButton.addEventListener('click', () => {
        game.start();
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        if (game.gameOver) return;
        
        switch (event.key) {
            case 'ArrowLeft':
                game.moveLeft();
                event.preventDefault();
                break;
            case 'ArrowRight':
                game.moveRight();
                event.preventDefault();
                break;
            case 'ArrowUp':
                game.rotate();
                event.preventDefault();
                break;
            case 'ArrowDown':
                game.softDrop();
                event.preventDefault();
                break;
            case ' ':
                game.hardDrop();
                event.preventDefault();
                break;
            case 'p':
            case 'P':
                game.togglePause();
                pauseButton.textContent = game.paused ? 'Resume' : 'Pause';
                event.preventDefault();
                break;
        }
    });
    
    // Touch controls for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    // Game board touch events for swipe controls
    const gameBoard = document.getElementById('game-board');
    
    gameBoard.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, false);
    
    gameBoard.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const horizontalDistance = touchEndX - touchStartX;
        const verticalDistance = touchEndY - touchStartY;
        
        // Detect tap (for rotation)
        if (Math.abs(horizontalDistance) < 30 && Math.abs(verticalDistance) < 30) {
            game.rotate();
            return;
        }
        
        // Detect horizontal swipe
        if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
            if (horizontalDistance > 50) {
                game.moveRight();
            } else if (horizontalDistance < -50) {
                game.moveLeft();
            }
        } 
        // Detect vertical swipe
        else {
            if (verticalDistance > 50) {
                game.softDrop();
            } else if (verticalDistance < -50) {
                game.hardDrop();
            }
        }
    }
    
    // Touch button controls
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const rotateButton = document.getElementById('rotate-button');
    const downButton = document.getElementById('down-button');
    const dropButton = document.getElementById('drop-button');
    
    if (leftButton) {
        leftButton.addEventListener('touchstart', (event) => {
            event.preventDefault();
            game.moveLeft();
        });
    }
    
    if (rightButton) {
        rightButton.addEventListener('touchstart', (event) => {
            event.preventDefault();
            game.moveRight();
        });
    }
    
    if (rotateButton) {
        rotateButton.addEventListener('touchstart', (event) => {
            event.preventDefault();
            game.rotate();
        });
    }
    
    if (downButton) {
        downButton.addEventListener('touchstart', (event) => {
            event.preventDefault();
            game.softDrop();
        });
    }
    
    if (dropButton) {
        dropButton.addEventListener('touchstart', (event) => {
            event.preventDefault();
            game.hardDrop();
        });
    }
    
    // Start the game automatically
    game.start();
});
