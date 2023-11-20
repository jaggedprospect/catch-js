/**
CatchJS
@author jaggedprospect
@date November 2023
@version 0.0.1
*/

// Document variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Paddle
const paddleWidth = 80;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball
let radius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 2;
let ballSpeedY = -2;

// Input listeners
var keysPressed = []
document.addEventListener("keydown", keyDownListener, false);
function keyDownListener(event){
    keysPressed[e.key] = true;
}
document.addEventListener("keyup", keyUpListener, false)
function keyUpListener(event){
    keysPressed[event.key] = false;
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
    ctx.fillStyle("#0095DD");
    ctx.fill();
    ctx.closePath();
}

/**
 * Check if ball has collided with side wall
 */
function wallCollision(){
    return ballX + radius > canvas.width || ballX - radius < 0;
}

/**
 * Check if ball has collided with paddle
 */
function paddleCollision(){
    return ballY + radius > canvas.height - paddleHeight &&
    ballX > paddleX &&
    ballX < paddleX + paddleWidth;
}

/**
 * Check if game over conditions are met
 */
function isGameOver(){
    return ballY + radius > canvas.height;
}

/**
 * Update the game state
 */
function update(){
    // move the paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // check ball collision with walls
    if (wallCollision()){
        ballSpeedX *= -1;
    }

    // check ball collision with paddle
    if (paddleCollision()){
        ballSpeedY *= -1;
    }

    // check for game over
    if (isGameOver()){
        alert("Game Over!");
        document.location.reload();
    }
}

/**
 * Draws everything on the canvas
 */
function draw(){
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawPaddle();
    drawBall();
}

/**
 * Main game loop
 */
function gameLoop(){
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}

/**
 * Starts the game on html body load complete
 */
function loadComplete(){
    console.log("Load is complete.");
    
    window.requestAnimationFrame(gameLoop);
}