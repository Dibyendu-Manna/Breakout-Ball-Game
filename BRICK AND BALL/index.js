
    let board;
    let boardWidth = 500;
    let boardHeight = 500;
    let context;

    // player
    let playerWidth = 80;
    let playerHeight = 10;
    let playerVelocityX = 10;
    let paddleColor = "lightgreen"; // fixed color
    let player = {
        x: boardWidth / 2 - playerWidth / 2,
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    };

    // ball
    let ballWidth = 10;
    let ballHeight = 10;
    let ballVelocityX = 3;
    let ballVelocityY = -2;
    let ball = {
        x: player.x + playerWidth / 2 - ballWidth / 2,
        y: player.y - ballHeight,
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY
    };

    // blocks
    let blockArray = [];
    let blockWidth = 50;
    let blockHeight = 10;
    let blockColumns = 8;
    let blockRows = 3;
    let blockMaxRows = 10;
    let blockCount = 0;
    let blockX = 15;
    let blockY = 45;

    let score = 0;
    let gameOver = false;

    window.onload = function () {
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardWidth;
        context = board.getContext("2d");

        requestAnimationFrame(update);
        document.addEventListener("keydown", movePlayer);
        document.addEventListener("mousemove", mouseMovePlayer);
        board.addEventListener("click", () => {
            if (gameOver) resetGame();
        });

        createBlocks();
    };

    function update() {
        requestAnimationFrame(update);
        if (gameOver) return;

        context.clearRect(0, 0, board.width, board.height);

        // draw player
        context.fillStyle = paddleColor;
        context.fillRect(player.x, player.y, player.width, player.height);

        // update ball
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        // draw ball
        context.fillStyle = "white";
        context.fillRect(ball.x, ball.y, ball.width, ball.height);

        // ball wall collision
        if (ball.y <= 0) {
            ball.velocityY *= -1;
        } else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
            ball.velocityX *= -1;
        } else if (ball.y + ball.height >= boardHeight) {
            context.font = "20px sans-serif";
            context.fillStyle = "white";
            context.fillText("Game Over: Click to Restart", 110, 400);
            gameOver = true;
        }

        // ball + paddle collision
        if (topCollision(ball, player) || bottomCollision(ball, player)) {
            ball.velocityY *= -1;
        } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
            ball.velocityX *= -1;
        }

        // draw and handle blocks
        for (let i = 0; i < blockArray.length; i++) {
            let block = blockArray[i];
            if (!block.break) {
                context.fillStyle = "skyblue";
                context.fillRect(block.x, block.y, block.width, block.height);

                if (topCollision(ball, block) || bottomCollision(ball, block)) {
                    block.break = true;
                    ball.velocityY *= -1;
                    blockCount--;
                    score += 100;
                } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                    block.break = true;
                    ball.velocityX *= -1;
                    blockCount--;
                    score += 100;
                }
            }
        }

        // next level
        if (blockCount === 0) {
            score += 100 * blockRows * blockColumns;
            blockRows = Math.min(blockRows + 1, blockMaxRows);
            createBlocks();
        }

        // draw score
        context.fillStyle = "white";
        context.font = "20px sans-serif";
        context.fillText("Score: " + score, 10, 25);
    }

    function movePlayer(e) {
        if (e.code === "ArrowLeft") {
            let nextX = player.x - player.velocityX;
            if (!outOfBounds(nextX)) player.x = nextX;
        } else if (e.code === "ArrowRight") {
            let nextX = player.x + player.velocityX;
            if (!outOfBounds(nextX)) player.x = nextX;
        }
    }

    function mouseMovePlayer(e) {
        let rect = board.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        player.x = mouseX - player.width / 2;
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > boardWidth) player.x = boardWidth - player.width;
    }

    function outOfBounds(xPosition) {
        return (xPosition < 0 || xPosition + playerWidth > boardWidth);
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    function topCollision(ball, block) {
        return detectCollision(ball, block) && ball.y + ball.height <= block.y + block.height / 2;
    }

    function bottomCollision(ball, block) {
        return detectCollision(ball, block) && ball.y >= block.y + block.height / 2;
    }

    function leftCollision(ball, block) {
        return detectCollision(ball, block) && ball.x + ball.width <= block.x + block.width / 2;
    }

    function rightCollision(ball, block) {
        return detectCollision(ball, block) && ball.x >= block.x + block.width / 2;
    }

    function createBlocks() {
        blockArray = [];
        for (let c = 0; c < blockColumns; c++) {
            for (let r = 0; r < blockRows; r++) {
                let block = {
                    x: blockX + c * blockWidth + c * 10,
                    y: blockY + r * blockHeight + r * 10,
                    width: blockWidth,
                    height: blockHeight,
                    break: false
                };
                blockArray.push(block);
            }
        }
        blockCount = blockArray.length;
    }

    function resetGame() {
        gameOver = false;
        player = {
            x: boardWidth / 2 - playerWidth / 2,
            y: boardHeight - playerHeight - 5,
            width: playerWidth,
            height: playerHeight,
            velocityX: playerVelocityX
        };
        ball = {
            x: player.x + player.width / 2 - ballWidth / 2,
            y: player.y - ballHeight,
            width: ballWidth,
            height: ballHeight,
            velocityX: ballVelocityX,
            velocityY: ballVelocityY
        };
        blockRows = 3;
        blockArray = [];
        score = 0;
        createBlocks();
    }

