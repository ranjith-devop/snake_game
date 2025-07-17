var canvas;
var ctx;

var head;
var apple;
var ball;

var dots;
var apple_x;
var apple_y;

var leftDirection = false;
var rightDirection = true;
var upDirection = false;
var downDirection = false;
var inGame = true;    
var paused = false;
var gameTimeout = null;

const DOT_SIZE = 10;
const ALL_DOTS = 900;
const MAX_RAND = 29;
const DELAY = 140;
const C_HEIGHT = 600;
const C_WIDTH = 600;    

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

var x = new Array(ALL_DOTS);
var y = new Array(ALL_DOTS);   


function init() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    loadImages();
    createSnake();
    locateApple();
    gameTimeout = setTimeout(gameCycle, DELAY);

    // Mobile swipe controls
    addSwipeControls();
}    

function loadImages() {
    
    head = new Image();
    head.src = 'head.png';    
    
    ball = new Image();
    ball.src = 'dot.png'; 
    
    apple = new Image();
    apple.src = 'apple.png'; 
}

function createSnake() {

    dots = 3;

    for (var z = 0; z < dots; z++) {
        x[z] = 50 - z * 10;
        y[z] = 50;
    }
}

function pauseGame() {
    paused = true;
    clearTimeout(gameTimeout);
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('continueBtn').style.display = '';
}

function continueGame() {
    if (paused && inGame) {
        paused = false;
        document.getElementById('pauseBtn').style.display = '';
        document.getElementById('continueBtn').style.display = 'none';
        gameTimeout = setTimeout(gameCycle, DELAY);
    }
}

function checkApple() {

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
    }
}    

function doDrawing() {
    
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    
    if (inGame) {

        ctx.drawImage(apple, apple_x, apple_y);

        for (var z = 0; z < dots; z++) {
            
            if (z == 0) {
                ctx.drawImage(head, x[z], y[z]);
            } else {
                ctx.drawImage(ball, x[z], y[z]);
            }
        }    
    } else {

        gameOver();
    }        
}

function gameOver() {
    
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
}

function move() {

    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }

    if (leftDirection) {
        x[0] -= DOT_SIZE;
    }

    if (rightDirection) {
        x[0] += DOT_SIZE;
    }

    if (upDirection) {
        y[0] -= DOT_SIZE;
    }

    if (downDirection) {
        y[0] += DOT_SIZE;
    }
}    

function checkCollision() {

    for (var z = dots; z > 0; z--) {

        if ((z > 4) && (x[0] == x[z]) && (y[0] == y[z])) {
            inGame = false;
        }
    }

    if (y[0] >= C_HEIGHT) {
        inGame = false;
    }

    if (y[0] < 0) {
       inGame = false;
    }

    if (x[0] >= C_WIDTH) {
      inGame = false;
    }

    if (x[0] < 0) {
      inGame = false;
    }
}

function locateApple() {

    var r = Math.floor(Math.random() * MAX_RAND);
    apple_x = r * DOT_SIZE;

    r = Math.floor(Math.random() * MAX_RAND);
    apple_y = r * DOT_SIZE;
}    

function gameCycle() {
    if (inGame && !paused) {
        checkApple();
        checkCollision();
        move();
        doDrawing();
        gameTimeout = setTimeout(gameCycle, DELAY);
    }
}

onkeydown = function(e) {
    var key = e.keyCode;
    if (paused) return;
    if ((key == LEFT_KEY) && (!rightDirection)) {
        leftDirection = true;
        upDirection = false;
        downDirection = false;
    }
    if ((key == RIGHT_KEY) && (!leftDirection)) {
        rightDirection = true;
        upDirection = false;
        downDirection = false;
    }
    if ((key == UP_KEY) && (!downDirection)) {
        upDirection = true;
        rightDirection = false;
        leftDirection = false;
    }
    if ((key == DOWN_KEY) && (!upDirection)) {
        downDirection = true;
        rightDirection = false;
        leftDirection = false;
    }
};

// --- Swipe controls for mobile ---
function addSwipeControls() {
    var touchStartX = 0, touchStartY = 0;
    canvas.addEventListener('touchstart', function(e) {
        var touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });
    canvas.addEventListener('touchmove', function(e) {
        if (paused) return;
        var touch = e.touches[0];
        var dx = touch.clientX - touchStartX;
        var dy = touch.clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30 && !leftDirection) {
                rightDirection = true; upDirection = false; downDirection = false; leftDirection = false;
            } else if (dx < -30 && !rightDirection) {
                leftDirection = true; upDirection = false; downDirection = false; rightDirection = false;
            }
        } else {
            if (dy > 30 && !upDirection) {
                downDirection = true; rightDirection = false; leftDirection = false; upDirection = false;
            } else if (dy < -30 && !downDirection) {
                upDirection = true; rightDirection = false; leftDirection = false; downDirection = false;
            }
        }
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });
}

