document.addEventListener('DOMContentLoaded', () => {
    // --- Konami Code Logic ---
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiIndex = 0;

    // --- Game Logic Top Scope ---
    const overlay = document.getElementById('game-overlay');
    const screen = document.getElementById('game-screen');
    const player = document.getElementById('player');
    const scoreBoard = document.getElementById('score-board');
    const message = document.getElementById('game-message');

    let gameRunning = false;
    let gameReady = false; // New state for "Overlay Open but waiting"
    let score = 0;
    let birdY = 200;
    let velocity = 0;
    let gravity = 0.5;
    let jumpStrength = -8;
    let pipes = [];
    let frameId;
    let pipeInterval;

    // Global listener for Konami code AND Game Input
    document.addEventListener('keydown', (e) => {
        // 1. Check Konami Code (only if game is closed)
        if (!gameRunning && !gameReady) {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    initGame(); // Prepare game
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
            return;
        }

        // 2. Handle Game Ready State (Waiting for Start)
        if (gameReady && !gameRunning) {
            if (e.key === ' ' || e.key === 'Enter') {
                startGame();
            } else if (e.key === 'Escape') {
                quitGame();
            }
            return;
        }

        // 3. Handle Running Game Input
        if (gameRunning) {
            if (e.key === ' ' || e.key === 'ArrowUp') {
                velocity = jumpStrength;
            } else if (e.key === 'Escape') {
                stopGame(); // Pause or Die? Let's just die/quit for now
            }
        }
    });

    function initGame() {
        gameReady = true;
        overlay.classList.remove('hidden');
        resetGameVariables();

        message.innerText = "PRESS SPACE TO START";
        message.style.display = 'block';
    }

    function startGame() {
        gameReady = false; // We are now running
        gameRunning = true;
        resetGameVariables();
        message.style.display = 'none'; // Hide message

        // Start Loop
        requestAnimationFrame(gameLoop);

        // Pipe Spawning
        pipeInterval = setInterval(createPipe, 2000);
    }

    function stopGame() {
        gameRunning = false;
        // logic to stay in "died" state or return to "gameReady"? 
        // Let's go to "Ended" state which waits for reset or quit
        cancelAnimationFrame(frameId);
        clearInterval(pipeInterval);

        message.innerText = `GAME OVER\nSCORE: ${score}\nPRESS SPACE TO RESTART\nESC TO QUIT`;
        message.style.display = 'block';

        // We set gameReady true so the main listener catches Space(Restart) or Escape(Quit)
        gameReady = true;
    }

    function quitGame() {
        gameReady = false;
        gameRunning = false;
        overlay.classList.add('hidden');
        resetGameVariables();
        // Remove pipes visual
        pipes.forEach(p => {
            if (p.top) p.top.remove();
            if (p.bottom) p.bottom.remove();
        });
        pipes = [];
    }

    function resetGameVariables() {
        score = 0;
        birdY = 200;
        velocity = 0;
        // Clear pipes logic
        pipes.forEach(p => {
            if (p.top) p.top.remove();
            if (p.bottom) p.bottom.remove();
        });
        pipes = [];
        updateScore();
        updateBird();
    }

    function createPipe() {
        if (!gameRunning) return;

        const gapHeight = 120;
        const minHeight = 50;
        const maxHeight = 400 - gapHeight - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        const topPipe = document.createElement('div');
        topPipe.classList.add('pipe');
        topPipe.style.left = '800px';
        topPipe.style.top = '0px';
        topPipe.style.height = topHeight + 'px';

        const bottomPipe = document.createElement('div');
        bottomPipe.classList.add('pipe');
        bottomPipe.style.left = '800px';
        bottomPipe.style.bottom = '0px';
        bottomPipe.style.height = (400 - topHeight - gapHeight) + 'px';

        screen.appendChild(topPipe);
        screen.appendChild(bottomPipe);

        pipes.push({ top: topPipe, bottom: bottomPipe, x: 800, passed: false });
    }

    function updateScore() {
        scoreBoard.innerText = `SCORE: ${score}`;
    }

    function updateBird() {
        player.style.top = birdY + 'px';
    }

    function gameLoop(time) {
        if (!gameRunning) return;

        // Physics
        velocity += gravity;
        birdY += velocity;

        // Floor/Ceiling collision
        if (birdY < 0 || birdY > 380) {
            stopGame();
            return;
        }

        updateBird();

        // Pipe Logic
        // We iterate backwards or just handle carefully to avoid index issues with splice
        for (let i = pipes.length - 1; i >= 0; i--) {
            let bg = pipes[i];
            bg.x -= 3; // speed
            bg.top.style.left = bg.x + 'px';
            bg.bottom.style.left = bg.x + 'px';

            // Score
            if (!bg.passed && bg.x < 50) {
                score++;
                bg.passed = true;
                updateScore();
            }

            // Clean up
            if (bg.x < -60) {
                bg.top.remove();
                bg.bottom.remove();
                pipes.splice(i, 1);
                continue;
            }

            // Collision
            const birdRect = player.getBoundingClientRect();
            const topRect = bg.top.getBoundingClientRect();
            const bottomRect = bg.bottom.getBoundingClientRect();

            if (checkCollision(birdRect, topRect) || checkCollision(birdRect, bottomRect)) {
                stopGame();
                return;
            }
        }

        if (gameRunning) {
            frameId = requestAnimationFrame(gameLoop);
        }
    }

    function checkCollision(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }

    // Set initial bird left
    player.style.left = '50px';
});
