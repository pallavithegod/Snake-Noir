let inputDir = {
    x:0,
    y:0
};

const board = document.querySelector('.board');
const highScoreBoard = document.querySelector('#highScore');
let highScoreVal = 0;
const scoreBoard = document.querySelector('#scoreBoard');
const pauseBtn = document.querySelector('#pauseBtn');
const leftsound = new Audio('/assets/left-a.mp3');
const rightsound = new Audio('/assets/right-d.mp3');
const upsound = new Audio('/assets/top-w.mp3')
const downsound = new Audio('/assets/down-s.mp3')
const lostSound = new Audio('/assets/game-lost.mp3')
const appleSound = new Audio('/assets/appleSound.mp3')
let score = 0;
let speed = 6;
let lastPaintTime = 0;
let snakeArr = [
    {x:10, y:10}    
]
apple = {x:15, y:15};

function main(currTime){
    window.requestAnimationFrame(main);

    if(gamePaused) {
        return; 
    }

    if((currTime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = currTime;
    gameEngine();
    
}

function collision(snakeArr){
    for (let i = 1; i < snakeArr.length; i++) {
        if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y){
            return true;
        }
        
    }
    if(snakeArr[0].x < 0 || snakeArr[0].x >= 20 || snakeArr[0].y < 0 || snakeArr[0].y >= 20){
        return true;
    }
    return false;
}

function gameEngine(){

    // if (gamePaused) return;

    if(collision(snakeArr)){
        lostSound.play();
        inputDir = {x:0, y:0}
        score = 0;

        const gameOverMsg = document.getElementById("gameOverMsg");
        gameOverMsg.classList.add("show");

        snakeArr = [{x:10, y:10}];

        setTimeout(() => {
        gameOverMsg.classList.remove("show");
        }, 2500);
    }

    if(snakeArr[0].y === apple.y && snakeArr[0].x === apple.x){
        appleSound.play();
        score ++;

        if(score > highScoreVal){
            highScoreVal = score;
            localStorage.setItem("highScore", JSON.stringify(highScoreVal));
            highScoreBoard.innerHTML = "High Score: " + highScoreVal;
        }


        scoreBoard.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y:snakeArr[0].y + inputDir.y})
        let a =2;
        let b = 17;
        apple ={x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    for (let i = snakeArr.length - 2; i >=0; i--) {
        snakeArr[i+1] = {...snakeArr[i]}
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((ele, index) => {
        const snakeEle = document.createElement('div')
        snakeEle.style.gridRowStart = ele.y;
        snakeEle.style.gridColumnStart =  ele.x;  
        
        if (index === 0){
            snakeEle.classList.add('head')
            snakeEle.style.transform = `rotate(${dirAngle}deg) scale(1.3)`;
        } else {
            snakeEle.style.transform = `rotate(${dirAngle}deg)`;
            snakeEle.classList.add('snake')
            if (index === 1) {
                snakeEle.style.borderBottomLeftRadius = '75%';
                snakeEle.style.borderBottomRightRadius = '75%';
            }
        }

       
    
        board.appendChild(snakeEle);
    
    })


    const appleEle = document.createElement('div')
    appleEle.style.gridRowStart = apple.y;
    appleEle.style.gridColumnStart =  apple.x;  
    appleEle.classList.add('apple')
    board.appendChild(appleEle);

  
    
} 

function restartGame() {
    snakeArr = [{ x: 10, y: 10 }];
    inputDir = { x: 0, y: 0 };
    score = 0;
    scoreBoard.innerHTML = "Score: " + score;
    dirAngle = 0;
}

let speedOptions = [4, 6, 8];
let currentSpeedIndex = 4;

function changeSpeed(newSpeed) {
    speed = newSpeed;
}

let gamePaused = false;
let pauseDebounce = false;

function togglePause() {
    if (pauseDebounce) return;
    pauseDebounce = true;
    
    gamePaused = !gamePaused;
    console.log('Pause button clicked. Paused:', gamePaused);
    pauseBtn.textContent = gamePaused ? 'Play' : 'Pause';
    if (!gamePaused) {
        lastPaintTime = performance.now();
    }
    
    setTimeout(() => {
        pauseDebounce = false;
    }, 200);
}
pauseBtn.addEventListener('click', togglePause);




let gridvar = true;
function toggleGrid(){
    gridvar = !gridvar;
    if(gridvar){
        board.classList.remove('hide-grid')
    } else {
        board.classList.add('hide-grid')
    }
    
}


let highScore = localStorage.getItem("highScore");
if (highScore === null){
    highScoreVal = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreVal));
} else {
    highScoreVal = JSON.parse(highScore);
}
highScoreBoard.innerHTML = "High Score: " + highScoreVal;



window.requestAnimationFrame(main);

let dirAngle = 0;
window.addEventListener('keydown', e => {
    // if (gamePaused) return;
    const key = e.key.toLowerCase();
    inputDir = {x:0, y:1}

    switch (e.key){
        case "ArrowUp":
        case "w":    
            inputDir.x = 0;
            inputDir.y = -1;
            upsound.play();
            dirAngle = 180;
            break; 
        case "ArrowDown":
        case "s":    
            inputDir.x = 0;
            inputDir.y = 1;
            dirAngle = 0;
            downsound.play();
            break;
        case "ArrowRight":
        case "d":
            inputDir.x = 1;
            inputDir.y = 0;
            dirAngle = 270;
            rightsound.play();
            break;
        case "ArrowLeft": 
        case "a":
            inputDir.x = -1;
            inputDir.y = 0;
            dirAngle = 90;
            leftsound.play();
            break;
        default: break;
    }
});
