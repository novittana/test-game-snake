document.addEventListener('keydown', onKeyPress, false);

window.onload = function () {
    console.log("load");
    gameCanvas = document.getElementById("gameCanvas");
    ctx = gameCanvas.getContext("2d");
    restartGame();


}

let gameCanvas = null;
let ctx = null;
let appleX = 0;
let appleY = 0;
let snakeBody = [];
let snakeVelocityX = 0;
let snakeVelocityY = -1;
let lastTickTime = 0;
let gameOver = false;
let score = 0;
let level = 1;

function  restartGame (){
    document.getElementById("message").style.visibility="hidden";
    snakeBody = [{x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}];
    snakeVelocityX = 0;
    snakeVelocityY = -1;
    lastTickTime = 0;
    gameOver = false;
    score = 0;
    level = 1;
    generateNewApple();
    drawScene();
    window.requestAnimationFrame(onTick);
    updateScore();
    updateLevel();
}

function drawRectangle(x, y, width, height, color, thickness = 1) {
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fillRect(x + thickness, y + thickness, width - thickness * 2, height - thickness * 2);

}

function drawField() {
    for (let i = 0; i < 80; i++) {
        drawRectangle(i * 10, 0, 10, 10, '#0000ff');
    }
    for (let i = 0; i < 60; i++) {
        drawRectangle(0, i * 10, 10, 10, '#0000ff');
    }
    for (let i = 0; i < 80; i++) {
        drawRectangle(i * 10, 60 * 10 - 10, 10, 10, '#0000ff');
    }
    for (let i = 0; i < 60; i++) {
        drawRectangle(80 * 10 - 10, i * 10, 10, 10, '#0000ff');
    }
}

function generateNewApple() {
    appleX = generateRandom(1, 79);
    appleY = generateRandom(1, 59);
}

function drawApple() {
    drawRectangle(appleX * 10, appleY * 10, 10, 10, '#ff0000');
}

function drawSnake() {
    for (let i = 0; i < snakeBody.length; i++) {
        let position = snakeBody[i];
        if (i === 0) {
            drawRectangle(position.x * 10, position.y * 10, 10, 10, '#fff700');
        } else {
            drawRectangle(position.x * 10, position.y * 10, 10, 10, '#61e963');
        }
    }
}

function checkAppleEat() {
    let headPositionX = snakeBody[0].x;
    let headPositionY = snakeBody[0].y;

    if (headPositionX === appleX && headPositionY === appleY) {
        snakeBody.push({x: snakeBody[snakeBody.length - 1].x, y: snakeBody[snakeBody.length - 1].y});
        generateNewApple();
        score++;
        updateScore();
        level = Math.floor(score / 10)+1;
        updateLevel();
    }
}

function updateSnake() {
    if (gameOver) {
        return;
    }
    let headPositionX = snakeBody[0].x;
    let headPositionY = snakeBody[0].y;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i].x = snakeBody[i - 1].x;
        snakeBody[i].y = snakeBody[i - 1].y;
    }

    snakeBody[0].x = headPositionX + snakeVelocityX;
    snakeBody[0].y = headPositionY + snakeVelocityY;
    checkAppleEat();

    let headPositionNextX = headPositionX + snakeVelocityX;
    let headPositionNextY = headPositionY + snakeVelocityY;

    if (headPositionNextX === 0 || headPositionNextX === 79 || headPositionNextY === 0 || headPositionNextY === 59) {
        gameOver = true;
        document.getElementById("message").style.visibility="visible";

    }

    for (let i = 1; i<snakeBody.length; i++){
        if (headPositionNextX === snakeBody[i].x &&  headPositionNextY === snakeBody[i].y){
            gameOver = true;
            document.getElementById("message").style.visibility="visible";
        }
    }

}

function drawScene() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawField();
    drawApple();
    drawSnake();
}

function onTick() {
    if(gameOver) {
        return;
    }
    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    let duration = Math.max(100 - level*10,10);
    if ((currentTime - lastTickTime) >= duration) {
        lastTickTime = currentTime;
        updateSnake();
        drawScene();
    }
    window.requestAnimationFrame(onTick);
}

function onKeyPress(event) {
    if (event.defaultPrevented) {
        return;
    }
    if (event.code === "ArrowDown") {
        // Handle "down"
        if (snakeVelocityY !== -1){
            snakeVelocityX = 0;
            snakeVelocityY = 1;
        }
    } else if (event.code === "ArrowUp") {
        if (snakeVelocityY !== 1){
            snakeVelocityX = 0;
            snakeVelocityY = -1;
        }
    } else if (event.code === "ArrowLeft") {
        if (snakeVelocityX !== 1){
            snakeVelocityX = -1;
            snakeVelocityY = 0;
        }
    } else if (event.code === "ArrowRight") {
        if (snakeVelocityX !== -1){
            snakeVelocityX = 1
            snakeVelocityY = 0;
        }
    } else if (event.code === "Space" && gameOver){
        restartGame();
    }

    updateSnake();
    drawScene();
}

function updateScore(){
    document.getElementById("scoreValue").innerHTML = score;
}

function updateLevel(){
    document.getElementById("levelValue").innerHTML = level;
}

function generateRandom(min = 0, max = 100) {
    // find diff
    let difference = max - min;
    // generate random number
    let rand = Math.random();
    // multiply with difference
    rand = Math.floor(rand * difference);
    // add with min value
    rand = rand + min;
    return rand;
}


