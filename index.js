//paddle class

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
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
	
	//position update method
	update(deltaTime){
		if (!deltaTime) return;
		
		this.position.x += this.speed;
		
		if (this.position.x < 0) this.position.x = 0;
		if (this.position.x + this.width > 800) this.position.x = 680;
	}
}





// input handling class

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



// ball class
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
		ctx.drawImage(this.imgBall, this.position.x, this.position.y, this.width, this.height);
	}
	
	//handle the ball	
	handleBall(){
		document.addEventListener('keydown', event => {
			if (event.keyCode == 32) //&& ballTouchesPaddle
				this.shootBall();
		});
	}
	
	//checking if ball touches paddle
	ballTouchesPaddle(){
		this.yMatch = ((this.position.y + this.height) == paddle.position.y);
		this.xMatch1 = (- paddle.position.x + this.position.x) <= (paddle.width - this.width/2);
		this.xMatch2 = (- paddle.position.x + this.position.x) >= -this.width/2;
		
		if (this.xMatch1 && this.xMatch2 && this.yMatch) return true;
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
			if(this.ballTouchesPaddle() && this.speed.y!=0) this.speed.y = - this.maxSpeed;
		}
	}
}


// getting the canvas and the context
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;

ctx.clearRect(0,0,800,600);


// making a paddle
let paddle = new Paddle(GAME_WIDTH, GAME_HEIGHT);

paddle.draw(ctx);

new InputHandler(paddle);

let lastTime = 0;


// ball
let ball = new Ball(GAME_WIDTH, GAME_HEIGHT, 'img_ball', paddle);

ball.draw(ctx);

ball.handleBall();

// the game loop
function gameLoop(timestamp){
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;
	
	ctx.clearRect(0,0,800,600);
	
	paddle.update(deltaTime);
	paddle.draw(ctx);
	
	ball.update(deltaTime);
	ball.draw(ctx);
	
	requestAnimationFrame(gameLoop);
}

gameLoop();