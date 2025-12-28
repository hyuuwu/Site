document.addEventListener('DOMContentLoaded', () => {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiIndex = 0;

    const overlay = document.getElementById('game-overlay');
    const screen = document.getElementById('game-screen');
    const player = document.getElementById('player');
    const scoreBoard = document.getElementById('score-board');
    const message = document.getElementById('game-message');

    let gameRunning = false;
    let gameReady = false;
    let score = 0;
    let birdY = 200;
    let velocity = 0;
    let gravity = 0.5;
    let jumpStrength = -8;
    let pipes = [];
    let frameId;
    let pipeInterval;

    document.addEventListener('keydown', (e) => {
        if (!gameRunning && !gameReady) {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    initGame();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
            return;
        }

        if (gameReady && !gameRunning) {
            if (e.key === ' ' || e.key === 'Enter') {
                startGame();
            } else if (e.key === 'Escape') {
                quitGame();
            }
            return;
        }

        if (gameRunning) {
            if (e.key === ' ' || e.key === 'ArrowUp') {
                velocity = jumpStrength;
            } else if (e.key === 'Escape') {
                stopGame();
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
        gameReady = false;
        gameRunning = true;
        resetGameVariables();
        message.style.display = 'none';

        requestAnimationFrame(gameLoop);

        pipeInterval = setInterval(createPipe, 2000);
    }

    function stopGame() {
        gameRunning = false;
        cancelAnimationFrame(frameId);
        clearInterval(pipeInterval);

        message.innerText = `GAME OVER\nSCORE: ${score}\nPRESS SPACE TO RESTART\nESC TO QUIT`;
        message.style.display = 'block';

        gameReady = true;
    }

    function quitGame() {
        gameReady = false;
        gameRunning = false;
        overlay.classList.add('hidden');
        resetGameVariables();
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

        velocity += gravity;
        birdY += velocity;

        if (birdY < 0 || birdY > 380) {
            stopGame();
            return;
        }

        updateBird();

        for (let i = pipes.length - 1; i >= 0; i--) {
            let bg = pipes[i];
            bg.x -= 3;
            bg.top.style.left = bg.x + 'px';
            bg.bottom.style.left = bg.x + 'px';

            if (!bg.passed && bg.x < 50) {
                score++;
                bg.passed = true;
                updateScore();
            }

            if (bg.x < -60) {
                bg.top.remove();
                bg.bottom.remove();
                pipes.splice(i, 1);
                continue;
            }

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

    player.style.left = '50px';
});
