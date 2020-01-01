var canvasCollection = document.getElementsByClassName("ConvasCollection");
var noOfCanvas = 10
function setCanvas(noOfCanvas){
    var str = '';
    for(var i=0; i < noOfCanvas; i++){
        str += '<canvas class="canvas" width="50" height="50"></canvas>';
    }
    canvasCollection[0].innerHTML = str;
}
setCanvas(noOfCanvas)

var canvas = document.getElementsByClassName("canvas");
var width = []
var height = []
var ctx = []
for(var i=0; i<noOfCanvas; i++){
    width[i] = canvas[i].width;
    height[i] = canvas[i].height;
    ctx[i] = canvas[i].getContext("2d");
}

var snakeSize = 3;
var speed = 2;
var snake = [];
var foodColor = "#f71e5c";
var backgroundColor = "#323032";
var snakeColor = "#ffffff";
var strokeColor = "#000000";
var cellWidth = 10;
var score = 0;
var topScore = 0;
var direction = 0;
var textColor = "#ffffff";
var food = {
    foodX:0,
    foodY:0
};
var populationSize = 100;
var NetworkDimensions = [22,16,8,4];
var ga;
var currentEntityIndex = 0;
var playBestSnake = false;
var bestSnake = {
    network: new NeuralNetwork(NetworkDimensions),
    fitness: 0
};
var distaneToFood;
var environment;
var kill = false;
var bestFitness = 0;
var inputNormalization = true;
var fixedSteps = 500;
var stepcount = fixedSteps;
var steps = stepcount;
var stepMultiplyer = 1.2;
var lives = 3;



function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function init(){
    stepcount = fixedSteps;
    steps = stepcount;
    kill = false;
    direction = 0;
    snake = [];
    snakeSize = 3;
    score = 0;
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = strokeColor;
    ctx.fillRect(0,0,width,height);
    ctx.strokeRect(0,0,width,height);
    var snakeCell = {
        x: Math.floor((width/cellWidth)/2) * cellWidth,
        y: Math.floor((height/cellWidth)/2) * cellWidth
    };
    snake.push(snakeCell);
    for(var i = 1; i<snakeSize; i++){
        var yCord = snakeCell.y - i*cellWidth;
        snake.push({
            x:snakeCell.x,
            y:yCord
        });
    }
    ctx.font = "15px Arial";
    drawFood();
    drawSnake();
    distaneToFood = dist(snake[0].x,snake[0].y,food.foodX,food.foodY); 
    document.addEventListener("keydown", keyInput, false);
    if(typeof game_loop != "undefined") 
        clearInterval(game_loop);
	game_loop = setInterval(game, speed);
}

function drawFood(){
    var foodx = getRandomInteger(0,Math.floor(width/cellWidth)-1);
    var foody = getRandomInteger(0,Math.floor(height/cellWidth)-1);
    food.foodX = foodx * cellWidth;
    food.foodY = foody * cellWidth;
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.foodX, food.foodY, cellWidth, cellWidth);
}

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = strokeColor;
    snake.forEach((snakeCell)=>{
        ctx.fillRect(snakeCell.x, snakeCell.y, cellWidth, cellWidth);
        ctx.strokeRect(snakeCell.x, snakeCell.y, cellWidth, cellWidth);
    });
}

function game(){
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = strokeColor;
    ctx.fillRect(0,0,width,height);
    ctx.strokeRect(0,0,width,height);
    var env;
    var x = snake[0].x;
    var y = snake[0].y;
    if(direction == 0){
        y += cellWidth;
    }else if(direction == 11){
        y -= cellWidth;
    }else if(direction == 01){
        x += cellWidth;
    }else{
        x -= cellWidth;
    }
    
    if( x<0 || y<0 || x>width || y>height|| checkCollision(x,y) || kill == true || steps <= 0){
        if(playBestSnake == false){
            if(ga.population[currentEntityIndex].fitness > bestFitness) {
                bestFitness = ga.population[currentEntityIndex].fitness;
                bestSnake = ga.population[currentEntityIndex];
            }
            lives--;
            if(lives == 0){
                lives = 3;
                currentEntityIndex++;
            }
            
            if(currentEntityIndex == ga.populationSize){
                currentEntityIndex = 0;
                ga.SortByFitness();
                ga.selectionAndBreeding();
                ga.mutation();
                GenerationH3.textContent = ga.generationNumber;
            }
            EntityH3.textContent = currentEntityIndex;
        }
        init();
        return;
    }

    if( x == food.foodX && y == food.foodY){
        var tail = {
            x:x,
            y:y
        };
        score++;
        stepcount = stepcount * stepMultiplyer;
        steps = stepcount;
        if(playBestSnake == false){
            ga.population[currentEntityIndex].fitness += 10;
        }
        if(score > topScore && playBestSnake == false){
            topScore = score;
            scoreH3.textContent = topScore;
        }
        snakeSize++;
        drawFood();
    }else{
        var tail = snake.pop();
        tail.x = x;
        tail.y = y;
    }

    snake.unshift(tail);
    drawSnake();
    steps--;
    stepsH3.textContent = steps;
    if(playBestSnake == false){
        var temp = dist(x,y,food.foodX,food.foodY);
        //ga.population[currentEntityIndex].fitness +=2;
        
        if(temp > distaneToFood){
            ga.population[currentEntityIndex].fitness += 1;
        }else{
            ga.population[currentEntityIndex].fitness +=2;
        }
        distaneToFood = temp;
    }
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.foodX, food.foodY, cellWidth, cellWidth);
    var score_text = "Score: " + score;
    ctx.fillStyle = textColor;
    ctx.fillText(score_text, 5, height-5);
    env = getSurrounding(x,y);
    getOutput(env);
}
function getOutput(env){
    var tempEnv = [
        env.topFood,
        env.topRightFood,
        env.rightFood,
        env.bottomRightFood,
        env.bottomFood,
        env.bottomLeftFood,
        env.leftFood,
        env.topLeftFood,
        env.topWall,
        env.topRightWall,
        env.rightWall,
        env.bottomRightWall,
        env.bottomWall,
        env.bottomLeftWall,
        env.leftWall,
        env.topLeftWall,
        env.topSelf,
        env.rightSelf,
        env.bottomSelf,
        env.rightSelf,
        food.foodX,
        food.foodY
    ];
    var sum = 0;
    if(inputNormalization == true){
        for(var i = 0; i<tempEnv.length; i++){
            tempEnv[i] = tempEnv[i] / cellWidth;
        }
    }
    if(playBestSnake == false){
        ga.population[currentEntityIndex].network.predict(tempEnv);
        var temp = ga.population[currentEntityIndex].network.output[0];
        var itemp = 0;
        for(var i=0; i<4; i++){
            if(temp < ga.population[currentEntityIndex].network.output[i]){
                temp = ga.population[currentEntityIndex].network.output[i];
                itemp = i;
            }
        }
    }else{
        bestSnake.network.predict(tempEnv);
        var temp = bestSnake.network.output[0];
        var itemp = 0;
        for(var i=0; i<4; i++){
            if(temp < bestSnake.network.output[i]){
                temp = bestSnake.network.output[i];
                itemp = i;
            }
        }
    }
    //console.log(tempEnv,ga.population[currentEntityIndex].network.output);
    networkInput(itemp);
}
function networkInput(keyValue){
    if(keyValue == 3 && direction != 01) direction = 10;
    else if(keyValue == 2 && direction != 0) direction = 11;
    else if(keyValue == 1 && direction != 10) direction = 01;
    else if(keyValue == 0 && direction != 11) direction = 0;
}
function checkCollision(x, y){
    for(var i=1; i<snakeSize; i++){
        if(snake[i].x == x && snake[i].y==y){
            return true;
        }
    }
    return false;
}
function keyInput(event){
    var keyValue = event.keyCode;
    if(keyValue == 37 && direction != 01) direction = 10;
    else if(keyValue == 38 && direction != 0) direction = 11;
    else if(keyValue == 39 && direction != 10) direction = 01;
    else if(keyValue == 40 && direction != 11) direction = 0;
}
function dist(x1,y1,x2,y2){
    return Math.floor(Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2)));
}
function getSurrounding(x, y){
    var surrounding = {
        topFood: 0,
        topRightFood: 0,
        topLeftFood: 0,
        rightFood: 0,
        leftFood: 0,
        bottomFood: 0,
        bottomLeftFood: 0,
        bottomRightFood: 0,
        topWall: 0,
        topRightWall: 0,
        rightWall: 0,
        bottomRightWall: 0,
        leftWall: 0,
        bottomWall: 0,
        bottomLeftWall: 0,
        topLeftWall: 0,
        topSelf: 0,
        rightSelf: 0,
        leftSelf: 0,
        bottomSelf: 0,
    }
    var edgeIntersection = [];
    var fx = food.foodX;
    var fy = food.foodY;
    var tempx = 999;
    var tempy = 999;
    if(fx == x){
        if(fy > y) surrounding.bottomFood = fy - y;
        else surrounding.topFood = y - fy;
    }else if(fy == y){
        if(fx > x) surrounding.rightFood = fx - x;
        else surrounding.leftFood = x - fx;
    }else if(Math.abs((fy - y) / (fx - x)) == 1){
        var d = dist(x,y,fx,fy);
        if(fx > x && fy > y) surrounding.bottomRightFood = d;
        else if(fx > x && fy < y) surrounding.topRightFood = d;
        else if(fx < x && fy < y) surrounding.topLeftFood = d;
        else if(fx < x && fy > y) surrounding.bottomLeftFood = d; 
    }
    surrounding.topWall = y;
    surrounding.bottomWall = height - y;
    surrounding.leftWall = x;
    surrounding.rightWall = width - x;
    for(var i=0; i<snakeSize; i++){
        if(snake[i].x == x && snake[i].x < tempx){
            tempx = snake[i].x;
        }
        if(snake[i].y == y && snake[i].y < tempy){
            tempy = snake[i].y;
        }
    }
    if(tempx != 999){
        if(tempx > x) surrounding.rightSelf = tempx - x;
        else surrounding.leftSelf = x - tempx;
    }
    if(tempy != 999){
        if(tempy > y) surrounding.bottomSelf = tempy - y;
        else surrounding.topSelf = y - tempy;
    }
    edgeIntersection.push([x-y, 0]);
    edgeIntersection.push([x+y, 0]);
    edgeIntersection.push([0, y-x]);
    edgeIntersection.push([0, x+y]);
    edgeIntersection.push([width, width-x+y]);
    edgeIntersection.push([width, x+y-width]);
    edgeIntersection.push([height+x-y, height]);
    edgeIntersection.push([x+y-height, height]);
    if(edgeIntersection[2][1] >= 0) surrounding.topLeftWall = dist(x,y,edgeIntersection[2][0],edgeIntersection[2][1]);
    else  surrounding.topLeftWall = dist(x,y,edgeIntersection[0][0],edgeIntersection[0][1]);
    if(edgeIntersection[6][0] >= width) surrounding.bottomRightWall = dist(x,y,edgeIntersection[4][0],edgeIntersection[4][1]);
    else surrounding.bottomRightWall = dist(x,y,edgeIntersection[6][0],edgeIntersection[6][1]);
    if(edgeIntersection[3][1] >= height) surrounding.bottomLeftWall = dist(x,y,edgeIntersection[7][0],edgeIntersection[7][1]);
    else surrounding.bottomLeftWall = dist(x,y,edgeIntersection[3][0],edgeIntersection[3][1]);
    if(edgeIntersection[0][0] >= width) surrounding.topRightWall = dist(x,y,edgeIntersection[0][0],edgeIntersection[0][1]);
    else surrounding.topRightWall = dist(x,y,edgeIntersection[5][0],edgeIntersection[5][1]);
    environment = surrounding;
    return surrounding;
}
function initializeGeneticAlgorithm(){
    ga = new GeneticAlgorithm(populationSize,NetworkDimensions);
    init();
}


initializeGeneticAlgorithm()



