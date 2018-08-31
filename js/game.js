function Game(canvadId) {
  this.canvas = document.getElementById(canvadId);
  this.ctx = this.canvas.getContext("2d");
  this.fps = 60;


  this.reset();
}

Game.prototype.start = function() {
  this.interval = setInterval(function() {
    this.clear();

    this.framesCounter++;

    // controlamos que frameCounter no sea superior a 1000
    if (this.framesCounter > 1000) {
      this.framesCounter = 0;
    }

    // controlamos la velocidad de generación de obstáculos
    if (this.framesCounter % 50 === 0) {
      this.generateObstacle();
    } 

    this.score += 0.01;
    
    this.moveAll();
    this.draw();

    // eliminamos obstáculos fuera del canvas
    this.clearObstacles();

    if (this.isCollision()) {
      this.gameOver();
    }
  }.bind(this), 1000 / this.fps);
};

Game.prototype.stop = function() {
  clearInterval(this.interval);
};

Game.prototype.gameOver = function() {
  this.stop();
  
  if(confirm("GAME OVER. Play again?")) {
    this.reset();
    this.start();
  }
};

Game.prototype.reset = function() {
  this.background = new Background(this);
  this.player = new Player(this);
  this.framesCounter = 0;
  this.obstacles = [];
  this.score = 0;
};

Game.prototype.isCollision = function() {
  // colisiones genéricas 
  // (p.x + p.w > o.x && o.x + o.w > p.x && p.y + p.h > o.y && o.y + o.h > p.y )
  return this.obstacles.some(function(obstacle) {
    return (
      ((this.player.x + this.player.w) >= obstacle.x &&
       this.player.x < (obstacle.x + obstacle.w) &&
       this.player.y + (this.player.h - 20) >= obstacle.y)
    );
  }.bind(this));
};

Game.prototype.clearObstacles = function() {
  this.obstacles = this.obstacles.filter(function(obstacle) {
    return obstacle.x >= 0;
  });
};

Game.prototype.generateObstacle = function() {
  this.obstacles.push(new Obstacle(this));
};

Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}; 

Game.prototype.draw = function() {
  this.background.draw();
  this.player.draw();
  this.obstacles.forEach(function(obstacle) { obstacle.draw(); });
  this.drawScore();  
};

Game.prototype.moveAll = function() {
  this.background.move();
  this.player.move();
  this.obstacles.forEach(function(obstacle) { obstacle.move(); });
};

Game.prototype.drawScore = function() {
  this.ctx.font = "30px sans-serif";
  this.ctx.fillStyle = "green";
  this.ctx.fillText(Math.floor(this.score), 50, 50);
}