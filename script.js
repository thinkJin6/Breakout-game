'use strict';

const btnRules = document.getElementById('btn--rules');
const btnClose = document.getElementById('btn--close');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsexY: 60,
  visible: true,
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsexY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
const drawBall = function () {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
};

// Drawa paddle on canvas
const drawPaddle = function () {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
};

// Draw Score
const drawScore = function () {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
};

// Draw bricks on canvas
const drawBricks = function () {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
};

// Move paddle on canvas
const movePaddle = function () {
  paddle.x += paddle.dx;

  // Wall detection
  // Right side
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  // Left side
  if (paddle.x < 0) {
    paddle.x = 0;
  }
};

// Move ball on canvas
const moveBall = function () {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision(x, right & left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  // Wall collision(y, top & botton)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // Left brick side check
          ball.x + ball.size < brick.x + brick.w && // Right brick side check
          ball.y + ball.size > brick.y && // Top brick side check
          ball.y - ball.size < brick.y + brick.h // Bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
};

// Increase Score
const increaseScore = function () {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
};

// Make all Bricks appear
const showAllBricks = function () {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
};

const draw = function () {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
};

// Update canvas drawing and animation
const update = function () {
  movePaddle();
  moveBall();
  // Draw every thing
  draw();

  requestAnimationFrame(update);
};

// init
const init = (function () {
  update();
})();

// Key board event handlers
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    paddle.dx = paddle.speed;
  }

  if (e.key === 'ArrowLeft' || e.key === 'Left') {
    paddle.dx = -paddle.speed;
  }
});

document.addEventListener('keyup', function (e) {
  if (
    e.key === 'ArrowRight' ||
    e.key === 'Right' ||
    e.key === 'ArrowLeft' ||
    e.key === 'Left'
  )
    paddle.dx = 0;
});

// Rules and close event handler
btnRules.addEventListener('click', function () {
  rules.classList.add('show');
});

btnClose.addEventListener('click', function () {
  rules.classList.remove('show');
});
