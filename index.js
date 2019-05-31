///paddle class
class Paddle{
	
	//constructor
	constructor(gameWidth, gameHeight){
		//size
		this.width = 120;
		this.height = 13;
		
		//speed
		this.maxSpeed = 7.5;
		this.speed = 0;
		
		//position
		this.position = {
			x: gameWidth/2 - this.width/2,
			y: gameHeight - this.height - 10,
		 };
	 }
	
	//move methods
	moveLeft(){
		this.speed = -this.maxSpeed;
	}
	
	moveRight(){
		this.speed = this.maxSpeed;
	}
	
	//stop method
	stop(){
		this.speed = 0;
	}
	
	//draw method
	draw(ctx) {
		ctx.fillStyle = '#0ff';
		ctx.fillRect(this.position.x, this.position.y,
		this.width, this.height);
	}
	
	//position update method
	update(deltaTime){
		if (!deltaTime) return;
		
		this.position.x += this.speed;
		
		if (this.position.x < 0) this.position.x = 0;
		if (this.position.x + this.width > 800) this.position.x = 680;
	}
}




//collision detector
function detectCollision(ball, gameObj){
	
	let xMatch1 = (- gameObj.position.x + ball.position.x) <= (gameObj.width - ball.width/2);
	let xMatch2 = (- gameObj.position.x + ball.position.x) >= -ball.width/2;
	let xMatch = false;
	
	if (xMatch1 && xMatch2) xMatch = true;
	
	let yMatch = false;
	let yMatchFromUp = false;
	let yMatchFromDown = false;
	
	if (ball.position.y > gameObj.position.y){
		yMatchFromDown = (gameObj.position.y + gameObj.height) >= ball.position.y;
	}
	if (ball.position.y <= gameObj.position.y){
		yMatchFromUp = (ball.position.y + ball.height) >= gameObj.position.y;
	}
	
	
	if (yMatchFromUp || yMatchFromDown) yMatch = true;
	
	
	if (xMatch && yMatch) return true;

}




//input handling class
class InputHandler{
	
	// constructor
	constructor(paddle){
		//event listeners
		document.addEventListener('keydown', event => {
			switch(event.keyCode){
				case 37:
					paddle.moveLeft();
					break;
					
				case 39:
					paddle.moveRight();
					break;
			}
		});
		
		document.addEventListener('keyup', event => {
			switch(event.keyCode){
				case 37:
					if(paddle.speed < 0) paddle.stop();
					break;
					
				case 39:
					if (paddle.speed > 0) paddle.stop();
					break;
			}
		});
	}
}



//ball class
class Ball{
	
	//constructor
	constructor(gameWidth, gameHeight, id, paddle){
		
		//size of the ball
		this.width = 25;
		this.height = 20;
		
		//speed of the ball
		this.maxSpeed = 6;
		this.speed = {
			x : 0,
			y : 0
		};
		
		//position of the ball
		this.position = {
			x : paddle.position.x + paddle.width/2 - this.width/2,
			y : paddle.position.y - this.height
		};
			
		// fetching the ball image
		this.imgBall = document.getElementById(id);
		
	}
	
	//shoot the ball
	shootBall(){
		this.speed.x = - this.maxSpeed;
		this.speed.y = - this.maxSpeed;
	}
	
	//draw the ball
	draw(ctx){
		ctx.drawImage(this.imgBall,
		this.position.x, this.position.y,
		this.width, this.height);
	}
	
	//handle the ball events
	handleBall(){
		document.addEventListener('keydown', event => {
			if (event.keyCode == 32) //&& ballTouchesPaddle
				this.shootBall();
		});
	}

	
	//update method
	update(deltaTime){
		if (this.speed.y == 0){
			this.position.x = paddle.position.x + this.width/2;
		}
		
		else {
			this.position.x += this.speed.x;
			this.position.y += this.speed.y;
			
			
			//collision detection
			if(this.position.x < 0) this.speed.x = this.maxSpeed;
			if(this.position.x > 800-25) this.speed.x = - this.maxSpeed;
			if(this.position.y < 0) this.speed.y = this.maxSpeed;
			if(detectCollision(this,paddle) && this.speed.y!=0) this.speed.y = - this.maxSpeed;
		}
	}
}



//brick class
class Brick{
	
	constructor(id, position, ball){
		//fetch the image
		this.imgBrick = document.getElementById(id);
		
		//size of brick
		this.width = 50;
		this.height = 25;
		
		//position of brick
		this.position = position;
		
		//marking for deletion
		this.markedForDeletion = false;
	}
	
	//draw the brick
	draw(ctx){
		ctx.drawImage(this.imgBrick,
		this.position.x, this.position.y,
		this.width, this.height);
	}
	
	//update brick's existence
	update(deltaTime){
		
		if(detectCollision(ball, this)){
			ball.speed.y = -ball.speed.y;
			this.markedForDeletion = true;
		}
	}
	
}




// getting the canvas and the context
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;

ctx.clearRect(0,0,800,600);


//making a paddle
let paddle = new Paddle(GAME_WIDTH, GAME_HEIGHT);

paddle.draw(ctx);

new InputHandler(paddle);

let lastTime = 0;


//ball
let ball = new Ball(GAME_WIDTH, GAME_HEIGHT, 'img_ball', paddle);

ball.draw(ctx);

ball.handleBall();

//bricks
let bricks = [];

for(let i=0; i<16; i++){
	for (let j=0; j<4; j++){
		bricks.push(new Brick('img_brick', {x : i*50, y : j*25}));
	}
}

for(let i=0; i<13; i++){
	bricks[i].draw(ctx);
}


//the game loop
function gameLoop(timestamp){
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;
	
	ctx.clearRect(0,0,800,600);
	
	//updating paddle coordinates
	paddle.update(deltaTime);
	//drawing paddle in new coordinates
	paddle.draw(ctx);
	
	
	//updating bricks
	for(let i=0; i<bricks.length; i++){
		bricks[i].update(deltaTime);
	}
	
	//filtering bricks
	bricks = bricks.filter(function(brick){
		return brick.markedForDeletion == false;
	});

	for(let i=0; i<bricks.length; i++){
		bricks[i].draw(ctx);
	}
	
	//updating ball coordinates
	ball.update(deltaTime);
	//drawing ball in new coordinates
	ball.draw(ctx);
	
	
	requestAnimationFrame(gameLoop);
}

gameLoop();
