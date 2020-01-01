class Snake{
    constructor(index, ga){
        this.currentEntityIndex = index;
        this.canvas = document.getElementById("canvas"+this.currentEntityIndex);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");
        this.snakeSize = 3;
        this.snake = [];
        this.snakeSize = 3;
        this.speed = 2;
        this.snake = [];
        this.foodColor = "#f71e5c";
        this.backgroundColor = "#323032";
        this.snakeColor = "#ffffff";
        this.strokeColor = "#000000";
        this.cellWidth = 5;
        this.score = 0;
        this.topScore = 0;
        this.direction = 0;
        this.textColor = "#ffffff";
        this.food = {
            foodX:0,
            foodY:0
        };
        this.NetworkDimensions = [22,16,8,4];
        this.ga = ga;
        this.distaneToFood;
        this.environment;
        this.kill = false;
        this.inputNormalization = false;
        this.fixedSteps = 300;
        this.stepcount = this.fixedSteps;
        this.steps = this.stepcount;
        this.stepMultiplyer = 1.2;
        this.lives = 5;
        this.alive = true;
    }
    
    
    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    init(){
        this.stepcount = this.fixedSteps;
        this.steps = this.stepcount;
        this.kill = false;
        this.direction = 0;
        this.snake = [];
        this.snakeSize = 3;
        this.score = 0;
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.strokeRect(0,0,this.width,this.height);
        var snakeCell = {
            x: Math.floor((this.width/this.cellWidth)/2) * this.cellWidth,
            y: Math.floor((this.height/this.cellWidth)/2) * this.cellWidth
        };
        this.snake.push(snakeCell);
        for(var i = 1; i<this.snakeSize; i++){
            var yCord = snakeCell.y - i*this.cellWidth;
            this.snake.push({
                x:snakeCell.x,
                y:yCord
            });
        }
        this.ctx.font = "15px Arial";
        this.drawFood();
        this.drawSnake();
        this.distaneToFood = this.dist(this.snake[0].x,this.snake[0].y,this.food.foodX,this.food.foodY); 
    }

    drawFood(){
        var foodx = this.getRandomInteger(0,Math.floor(this.width/this.cellWidth)-1);
        var foody = this.getRandomInteger(0,Math.floor(this.height/this.cellWidth)-1);
        this.food.foodX = foodx * this.cellWidth;
        this.food.foodY = foody * this.cellWidth;
        this.ctx.fillStyle = this.foodColor;
        this.ctx.fillRect(this.food.foodX, this.food.foodY, this.cellWidth, this.cellWidth);
    }

    drawSnake(){
        this.ctx.fillStyle = this.snakeColor;
        this.ctx.strokeStyle = this.strokeColor;
        this.snake.forEach((snakeCell)=>{
            this.ctx.fillRect(snakeCell.x, snakeCell.y, this.cellWidth, this.cellWidth);
            this.ctx.strokeRect(snakeCell.x, snakeCell.y, this.cellWidth, this.cellWidth);
        });
    }

    game(){
        if(this.alive){
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.strokeStyle = this.strokeColor;
            this.ctx.fillRect(0,0,this.width,this.height);
            this.ctx.strokeRect(0,0,this.width,this.height);
            var env;
            var x = this.snake[0].x;
            var y = this.snake[0].y;
            if(this.direction == 0){
                y += this.cellWidth;
            }else if(this.direction == 11){
                y -= this.cellWidth;
            }else if(this.direction == 1){
                x += this.cellWidth;
            }else{
                x -= this.cellWidth;
            }
            
            if( x<=0 || y<=0 || x>=this.width || y>=this.height|| this.checkCollision(x,y) || this.kill == true || this.steps <= 0){
                this.lives--;
                if(this.lives == 0){
                    this.alive = false;
                    this.lives = 5;
                    nalive--;
                }
                this.init();
                return;
            }
        
            if( x == this.food.foodX && y == this.food.foodY){
                var tail = {
                    x:x,
                    y:y
                };
                this.score++;
                this.stepcount = this.stepcount * this.stepMultiplyer;
                this.steps = this.stepcount;
                if(this.score>2){
                    console.log(this.score + ' ' + this.ga.population[this.currentEntityIndex].fitness);
                    this.ga.population[this.currentEntityIndex].fitness += this.score * this.score;
                }else{
                    this.ga.population[this.currentEntityIndex].fitness += 0; //this.score * this.score;
                }
                this.snakeSize++;
                this.drawFood();
            }else{
                var tail = this.snake.pop();
                tail.x = x;
                tail.y = y;
            }
        
            this.snake.unshift(tail);
            this.drawSnake();
            this.steps--;
            var temp = this.dist(x,y,this.food.foodX,this.food.foodY);
            //ga.population[currentEntityIndex].fitness +=2;
            
            if(temp > this.distaneToFood){
                this.ga.population[this.currentEntityIndex].fitness += 0; //0.05;
            }else{
                this.ga.population[this.currentEntityIndex].fitness += 0;//0.1;
            }
            this.distaneToFood = temp;
            this.ctx.fillStyle = this.foodColor;
            this.ctx.fillRect(this.food.foodX, this.food.foodY, this.cellWidth, this.cellWidth);
            var score_text = "Score: " + this.score;
            this.ctx.fillStyle = this.textColor;
            this.ctx.fillText(score_text, 5, this.height-5);
            var env = this.getSurrounding(x,y);
            this.getOutput(env);
        }
    }

    getOutput(env){
        /*
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
            this.food.foodX,
            this.food.foodY
            
        ]; 
        
        var sum = 0;
        if(this.inputNormalization == true){
            for(var i = 0; i<tempEnv.length; i++){
                tempEnv[i] = tempEnv[i] / this.cellWidth;
            }
        }

        */
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
            env.rightWall,
            env.bottomWall,
            env.leftWall,
            env.topSelf,
            env.leftSelf,
            env.bottomSelf,
            env.rightSelf
        ];

        //if(this.currentEntityIndex == 0) console.log(tempEnv);
        for(var i=0; i<8 ;i++){
            //tempEnv[i] = Math.floor(tempEnv[i] / this.cellWidth)
            if(Math.floor(tempEnv[i] / this.cellWidth) > 0 ){
                tempEnv[i] = 1;
            }else{
                tempEnv[i] = 0;
            }
        }
        

        for(var i=8;i<16;i++){
            //if(this.currentEntityIndex == 0) console.log(i+' '+tempEnv[i] / this.cellWidth)
            if(Math.floor(tempEnv[i] / this.cellWidth) > 1 ){
                tempEnv[i] = 0;
            }else{
                tempEnv[i] = 1;
            }
        }
        
        //if(this.currentEntityIndex == 0) console.log(tempEnv);
        
        this.ga.population[this.currentEntityIndex].network.predict(tempEnv);
        var temp = this.ga.population[this.currentEntityIndex].network.output[0];
        var itemp = 0;
        for(var i=0; i<4; i++){
            if(temp < this.ga.population[this.currentEntityIndex].network.output[i]){
                temp = this.ga.population[this.currentEntityIndex].network.output[i];
                itemp = i;
            }
        }
        //console.log(tempEnv,ga.population[currentEntityIndex].network.output);
        this.networkInput(itemp);
    }

    networkInput(keyValue){
        if(keyValue == 3 && this.direction != 1) this.direction = 10;
        else if(keyValue == 2 && this.direction != 0) this.direction = 11;
        else if(keyValue == 1 && this.direction != 10) this.direction = 1;
        else if(keyValue == 0 && this.direction != 11) this.direction = 0;
    }

    checkCollision(x, y){
        for(var i=1; i<this.snakeSize; i++){
            if(this.snake[i].x == x && this.snake[i].y==y){
                return true;
            }
        }
        return false;
    }
    keyInput(event){
        var keyValue = event.keyCode;
        if(keyValue == 37 && this.direction != 1) this.direction = 10;
        else if(keyValue == 38 && this.direction != 0) this.direction = 11;
        else if(keyValue == 39 && this.direction != 10) this.direction = 1;
        else if(keyValue == 40 && this.direction != 11) this.direction = 0;
    }

    dist(x1,y1,x2,y2){
        return Math.floor(Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2)));
    }
    getSurrounding(x, y){
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
            topSelf: 99,
            rightSelf: 99,
            leftSelf: 99,
            bottomSelf: 99,
        }
        var edgeIntersection = [];
        var fx = this.food.foodX;
        var fy = this.food.foodY;
        var tempx = 999;
        var tempy = 999;
        if(fx == x){
            if(fy > y) surrounding.bottomFood = fy - y;
            else surrounding.topFood = y - fy;
        }else if(fy == y){
            if(fx > x) surrounding.rightFood = fx - x;
            else surrounding.leftFood = x - fx;
        }else if(Math.abs((fy - y) / (fx - x)) == 1){
            var d = this.dist(x,y,fx,fy);
            if(fx > x && fy > y) surrounding.bottomRightFood = d;
            else if(fx > x && fy < y) surrounding.topRightFood = d;
            else if(fx < x && fy < y) surrounding.topLeftFood = d;
            else if(fx < x && fy > y) surrounding.bottomLeftFood = d; 
        }
        surrounding.topWall = y;
        surrounding.bottomWall = this.height - y;
        surrounding.leftWall = x;
        surrounding.rightWall = this.width - x;
        for(var i=0; i<this.snakeSize; i++){
            if(this.snake[i].x != x && this.snake[i].x < tempx){
                tempx = this.snake[i].x;
                break;
            }
        }
        for(var i=0; i<this.snakeSize; i++){
            if(this.snake[i].y != y && this.snake[i].y < tempy){
                tempy = this.snake[i].y;
                break;
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
        edgeIntersection.push([this.width, this.width-x+y]);
        edgeIntersection.push([this.width, x+y-this.width]);
        edgeIntersection.push([this.height+x-y, this.height]);
        edgeIntersection.push([x+y-this.height, this.height]);
        if(edgeIntersection[2][1] >= 0) surrounding.topLeftWall = this.dist(x,y,edgeIntersection[2][0],edgeIntersection[2][1]);
        else  surrounding.topLeftWall = this.dist(x,y,edgeIntersection[0][0],edgeIntersection[0][1]);
        if(edgeIntersection[6][0] >= this.width) surrounding.bottomRightWall = this.dist(x,y,edgeIntersection[4][0],edgeIntersection[4][1]);
        else surrounding.bottomRightWall = this.dist(x,y,edgeIntersection[6][0],edgeIntersection[6][1]);
        if(edgeIntersection[3][1] >= this.height) surrounding.bottomLeftWall = this.dist(x,y,edgeIntersection[7][0],edgeIntersection[7][1]);
        else surrounding.bottomLeftWall = this.dist(x,y,edgeIntersection[3][0],edgeIntersection[3][1]);
        if(edgeIntersection[0][0] >= this.width) surrounding.topRightWall = this.dist(x,y,edgeIntersection[0][0],edgeIntersection[0][1]);
        else surrounding.topRightWall = this.dist(x,y,edgeIntersection[5][0],edgeIntersection[5][1]);
        this.environment = surrounding;
        return surrounding;
    }
    
}

var canvasCollection = document.getElementsByClassName("ConvasCollection");
var noOfCanvas = 1000;
var snakes = [];
var populationSize = noOfCanvas;
var NetworkDimensions = [16,8,4];
var ga;
var speed = 0;
var nalive = noOfCanvas;
function setCanvas(noOfCanvas){
    var str = '';
    for(var i=0; i < noOfCanvas; i++){
        str += '<canvas id="canvas'+i+'" width="150" height="150"></canvas>';
    }
    canvasCollection[0].innerHTML = str;
}

function onStart(n){
    ga = new GeneticAlgorithm(populationSize,NetworkDimensions);
    for(var i=0; i<n;i ++){
        snakes[i] = new Snake(i, ga);
        snakes[i].init();
    }
}
function gameLoop(){
    if(nalive>0){
        snakes.forEach((snake)=>{
            snake.game();
        });
    }else if(nalive == 0){
        nalive = noOfCanvas;
        ga.SortByFitness();
        ga.selectionAndBreeding();
        ga.mutation();
        snakes.forEach((snake)=>{
            snake.alive = true;;
        });
        clearInterval(game_loop);
        game_loop = setInterval(gameLoop, speed);
    }
}

function gameStart(){
    if(typeof game_loop != "undefined") 
        clearInterval(game_loop);
	game_loop = setInterval(gameLoop, speed);
}

setCanvas(noOfCanvas);
onStart(noOfCanvas);
gameStart()