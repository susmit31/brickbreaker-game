const GAMESTATE = {
	
	PAUSED : 0,
	RUNNING : 1,
	MENU : 2,
	GAMEOVER : 3,
	CLEARLEVEL : 4,
	
}



//game class
class Game{
	
	constructor(gameWidth, gameHeight){
		
		this.width = gameWidth;
		this.height = gameHeight;
		
	}
	
	
	start(){
		//running state
		this.gameState = GAMESTATE.RUNNING;
		
		//instantiating game objects
		this.paddle = new Paddle(this);
		
		
		this.ball = new Ball(this, 'img_ball', this.paddle);
		
		
		this.bricks = [];
		this.brickWidth = 50; //brick.width
		this.brickCols = Math.floor(GAME_WIDTH/this.brickWidth);

		for(let i=1; i<this.brickCols; i++){
			for (let j=2; j<=5; j++){
				this.bricks.push(new Brick(this,'img_brick', {x : i*50, y : j*25}));
			}
			
		}
		
	}
	
	draw(ctx){
	
		this.paddle.draw(ctx);
		
		this.ball.draw(ctx);
		
		for(let i=0; i<this.bricks.length; i++){
			this.bricks[i].draw(ctx);
		}
		
		//pause screen
		if (this.gameState == GAMESTATE.PAUSED){
			
			//shading up the game screen
			ctx.fillStyle = 'rgba(0,0,0,0.25)';
			ctx.fillRect(0, 0, this.width, this.height);
			
			//writing 'paused'
			ctx.font = '50px consolas';
			ctx.fillStyle = 'dodgerblue';
			ctx.textAlign = 'center';
			ctx.fillText('Paused', this.width/2, this.height/2);
			
		}
		
		//game over
		if (this.gameState == GAMESTATE.GAMEOVER){
			
			
			//shading up the game screen
			ctx.fillStyle = 'rgba(0,0,0,0.5)';
			ctx.fillRect(0,0, this.width, this.height);
			
			//writing 'game over'
			ctx.fillStyle = 'tomato';
			ctx.font = '50px "Germania One"';
			//ctx.fontWeight = 'bold';
			ctx.textAlign = 'center';
			ctx.fillText('GAME OVER', this.width/2, this.height/2);
			ctx.font = '20px "copperplate gothic bold"';
			ctx.fillText('Press enter to restart', this.width/2, this.height/2+50);
			
		}
		
		//level clear
		if (this.gameState == GAMESTATE.CLEARLEVEL){
			
			//shading up the game screen
			ctx.fillStyle = 'rgba(0,0,0,0.25)';
			ctx.fillRect(0,0, this.width, this.height);
			
			//display 'level clear'
			ctx.fillStyle = 'mediumseagreen';
			ctx.font = '50px acme';
			ctx.textAlign = 'center';
			ctx.fillText('LEVEL', this.width/2, this.height/2);
			ctx.fillText('CLEARED!', this.width/2, this.height/2+50);
		
		}
		
		
	}
	
	update(deltaTime){
		
		//updating paddle
		this.paddle.update(deltaTime);
		
		//updating ball
		this.ball.update(deltaTime);
		
		//updating bricks
		for(let i=0; i<this.bricks.length; i++){
			this.bricks[i].update(deltaTime);
		}
		
		//filtering bricks
		this.bricks = this.bricks.filter(function(brick){
			return brick.markedForDeletion == false;
		});
		
		if(this.bricks.length == 0) {
			this.gameState = GAMESTATE.CLEARLEVEL;
			return;
		}
		
		//pausing the game
		if(this.gameState == GAMESTATE.PAUSED) return;
		
		//checking for game over
		if(this.ball.position.y > this.height) {
			this.gameState = GAMESTATE.GAMEOVER;
			return;
		}
	
	}
	
	togglePause(){
		
		if (this.gameState == GAMESTATE.PAUSED){
			this.gameState = GAMESTATE.RUNNING;
		}
		
		else this.gameState = GAMESTATE.PAUSED;
	
	}
	
}




//paddle class
class Paddle{
	
	//constructor
	constructor(game){
		//size
		this.width = 120;
		this.height = 13;
		
		//speed
		this.maxSpeed = 10;
		this.speed = 0;
		
		//position
		this.position = {
			x: game.width/2 - this.width/2,
			y: game.height - this.height - 10,
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
		if (this.position.x + this.width > game.width) this.position.x = game.width - this.width;
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




//input handling function for desktop
function DesktopInputHandler(game){
	
	//event listeners for paddle
	document.addEventListener('keydown', event => {
		switch(event.keyCode){
			case 37:
				game.paddle.moveLeft();
				break;
					
			case 39:
				game.paddle.moveRight();
				break;
					
			case 27:
				game.togglePause();
				break;
					
			case 13:
				if (game.gameState == GAMESTATE.GAMEOVER){
					game.gameState = GAMESTATE.RUNNING;
				}
			}
		});
		
	document.addEventListener('keyup', event => {
		switch(event.keyCode){
			case 37:
				if(game.paddle.speed < 0) game.paddle.stop();
				break;
					
			case 39:
				if (game.paddle.speed > 0) game.paddle.stop();
				break;
		}
	});
	
	//event listeners for ball
	//handle the ball events on desktop	
	document.addEventListener('keydown', event => {
			
		if (event.keyCode == 32) //&& ballTouchesPaddle
			game.ball.shootBall();
		
	});

}




//input handler for phones
function TouchInputHandler(game){
	
	//handle paddle
	document.addEventListener('touchmove', event => {	
		//easing constant
		const EASING = 0.25;
		//touch point
		var touchX = event.targetTouches[0].pageX - canvas.offsetLeft;
		//distance of paddle from touch point
		var vx = touchX - game.paddle.position.x - game.paddle.width/2;
		//move paddle if more than 1px away from the touch point
		if (vx > 1 || vx < 1) game.paddle.position.x += vx*EASING;
		else game.paddle.position.x = touchX;
		
		
		//preventing selection on tap
		event.preventDefault();
	});
	

	//handle ball
	document.addEventListener('touchstart', event => {
		if(game.ball.speed.y == 0){
			game.ball.maxSpeed = 4
			game.ball.shootBall();
		}
	});
		
}





//ball class
class Ball{
	
	//constructor
	constructor(game, id){
		
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
			x : game.paddle.position.x + game.paddle.width/2 - this.width/2,
			y : game.paddle.position.y - this.height
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
	
	
	//update method
	update(deltaTime){
		if (this.speed.y == 0){
			this.position.x = game.paddle.position.x + this.width/2;
		}
		
		else {
			this.position.x += this.speed.x;
			this.position.y += this.speed.y;
			
			
			//collision detection
			if(this.position.x < 0 || this.position.x > game.width - this.width){
				this.speed.x = -this.speed.x;
			}
			
			if(this.position.y < 53) this.speed.y = -this.speed.y;
			if(detectCollision(this,game.paddle) && this.speed.y!=0) this.speed.y = - this.maxSpeed;
		}
	}
}



//brick class
class Brick{
	
	constructor(game, id, position){
		//fetch the image
		this.imgBrick = document.getElementById(id);
		
		//size of brick
		this.width = 50; //game.brickWidth
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
		
		if(detectCollision(game.ball, this)){
			game.ball.speed.y = -game.ball.speed.y;
			this.markedForDeletion = true;
		}
	}
	
}



// getting the canvas and the context
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');


//setting the height and width of the canvas and the game
canvas.width = window.innerWidth*0.95;
canvas.height = window.innerHeight*0.95;

let GAME_HEIGHT = canvas.height;
let GAME_WIDTH = canvas.width;

ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);



//starting the game
let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();


//starting event handlers
if('ontouchstart' in canvas) TouchInputHandler(game);

else DesktopInputHandler(game);


//drawing game objects
game.draw(ctx);


let lastTime = 0;


//the game loop
function gameLoop(timestamp){
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;
	
	ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
	
	
	game.update(deltaTime);
	game.draw(ctx);
	
	
	requestAnimationFrame(gameLoop);
}

gameLoop();
