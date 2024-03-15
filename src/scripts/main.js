/**
 * @file This is the main JS file for the project.
 * @author jaggedprospect
 * @version 0.0.1
 * @since November 2023
 * @description Contains the main logic for CatchJS.
*/

import * as constants from './constants.js'

//# Config
const HITBOXES = true;

//# Document constants
const CANVAS = document.getElementById("gameCanvas");
const CTX = CANVAS.getContext("2d");
const CANVAS_W = CANVAS.width;
const CANVAS_H = CANVAS.height;

//# Paddle
let paddleWidth = 80;
let paddleX = (CANVAS_W - paddleWidth) / 2;
let paddle = {
  x: paddleX,
  y: 0,
  width: paddleWidth,
  height: 15,
  speed: 6,
}
let paddleOrigin = [paddle.x, 0]; // x,y coordinate

//# Ball
let ball = {
  x: CANVAS_W / 2,
  y: CANVAS_H - 30,
  radius: 10,
  speed: 5,
  vX: 5,
  vY: -5,
}
let ballOrigin = [ball.x, ball.y];

//# Game variables
let isRunning = false;

//# Input listeners
var keysPressed = [];
document.addEventListener("keydown", keyDownListener, false);
function keyDownListener(event) {
  keysPressed[event.key] = true;
}
document.addEventListener("keyup", keyUpListener, false);
function keyUpListener(event) {
  keysPressed[event.key] = false;
}

function drawPaddle() {
  CTX.beginPath();
  CTX.rect(paddleX, CANVAS_H - paddleHeight, paddleWidth, paddleHeight);
  CTX.fillStyle = constants.COLOR_PADDLE;
  CTX.fill();

  if (HITBOXES) {
    CTX.strokeStyle = constants.COLOR_HITBOX
    CTX.stroke();
  }

  CTX.closePath();
}

function drawBall() {
  CTX.beginPath();
  CTX.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  CTX.fillStyle = constants.COLOR_BALL;
  CTX.fill();

  if (HITBOXES) {
    CTX.strokeStyle = constants.COLOR_HITBOX
    CTX.stroke();
  }


  CTX.closePath();
}

/**
 * Check if ball has collided with side wall
 */
function wallCollision() {
  return ballX + ballRadius > CANVAS_W || ballX - ballRadius < 0;
}

/**
 * Check if ball has collided with ceiling
 */
function ceilingCollision() {
  return ballY - ballRadius < 0;
}

/**
 * Check if ball has collided with paddle
 */
function collisionDetected() {
  return ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height;
}

/**
 * Update ball's direction and speed after collision with paddle
 */
function updateBallAfterCollision(ball, paddle) {
  // Reverse the direction of the ball's vertical velocity
  ball.velocityY = -ball.velocityY;

  // Optionally, adjust the ball's horizontal velocity based on where it hits the paddle
  let relativeIntersectX = ball.x - (paddle.x + paddle.width / 2);
  ball.velocityX = relativeIntersectX / (paddle.width / 2) * ball.speed;
}

/**
 * Check if game over conditions are met
 */
function isGameOver() {
  return ballY + ballRadius > CANVAS_H;
}

/** 
 * Update the game state
 */
function update() {
  let rightPressed = keysPressed[constants.RIGHT];
  let leftPressed = keysPressed[constants.LEFT];

  // move the paddle
  if (rightPressed && paddleX < CANVAS_W - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  // move the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // check ball collision with walls
  if (wallCollision()) {
    ballSpeedX *= -1;
  }

  // check ball collision with paddle/ceiling
  if (paddleCollision() || ceilingCollision()) {
    ballSpeedY *= -1;
  }

  // check for game over
  if (isGameOver()) {
    alert("Game Over!");
    reset();
    document.location.reload();
  }
}

/**
 * Draws everything on the CANVAS
 */
function draw() {
  // clear CANVAS
  CTX.clearRect(0, 0, CANVAS_W, CANVAS_H);

  drawPaddle();
  drawBall();
}

/**
 * Check if game has been started
 */
function checkStart() {
  let startPressed = keysPressed[constants.SPACE];
  if (startPressed) {
    isRunning = true;
    console.log("Start!")
  }
}

/**
 * Reset the game state
 */
function reset() {
  paddleX = paddleOrigin[0];
  ballX = ballOrigin[0];
  ballY = ballOrigin[1];
  isRunning = false;
}

/**
 * Main game loop
 */
function gameLoop() {
  if (isRunning) {
    update();
    draw();
  } else {
    checkStart();
  }

  window.requestAnimationFrame(gameLoop);
}

/**
 * Initialize the game
 */
function init() {
  //todo add logic
}

/**
 * Starts the game on html body load complete
 */
function loadComplete() {
  console.log("Load is complete.");
  init();
  window.requestAnimationFrame(gameLoop);
}
