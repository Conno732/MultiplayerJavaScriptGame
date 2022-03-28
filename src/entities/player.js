class Player {
  constructor(
    x,
    y,
    radius,
    color,
    type,
    maze,
    mazeWidth,
    mazeHeight,
    cellSize
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.type = type;
    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = 3;
    this.mazeHeight = mazeHeight;
    this.mazeWidth = mazeWidth;
    this.cellSize = cellSize;
    this.maze = maze;
    this.speedBoost = 1;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
  }

  moveLeft() {
    this.speedX = -this.maxSpeed;
  }

  moveRight() {
    this.speedX = this.maxSpeed;
  }

  moveUp() {
    this.speedY = -this.maxSpeed;
  }

  moveDown() {
    this.speedY = +this.maxSpeed;
  }

  stopX() {
    this.speedX = 0;
  }

  stopY() {
    this.speedY = 0;
  }

  boost() {
    this.speedBoost = 1.7;
  }

  stopBoost() {
    this.speedBoost = 1;
  }

  update(deltaTime) {
    if (!deltaTime) return;
    this.determineX(
      Math.floor(this.x / this.cellSize),
      Math.floor(this.y / this.cellSize),
      this.x % this.cellSize,
      this.y % this.cellSize
    );
    this.determineY(
      Math.floor(this.x / this.cellSize),
      Math.floor(this.y / this.cellSize),
      this.x % this.cellSize,
      this.y % this.cellSize
    );
    // console.log(
    //   "Current pos: X-" +
    //     Math.floor(this.x / this.cellSize) +
    //     " Y-" +
    //     Math.floor(this.y / this.cellSize)
    // );
  }

  determineX(posX, posY, innerX, innerY) {
    // console.log(this.maze[posY][posX]);
    if (posX === 0 && innerX < this.cellSize / 2 && this.speedX < 0) return;
    else if (
      posX === 0 &&
      innerX > this.cellSize / 2 &&
      this.maze[posY][posX].checkRight() &&
      this.speedX > 0
    )
      return;
    else if (
      this.maze[posY][posX].checkRight() &&
      innerX > this.cellSize / 2 &&
      this.speedX > 0
    )
      return;
    else if (
      posX !== 0 &&
      this.maze[posY][posX - 1].checkRight() &&
      innerX < this.cellSize / 2 &&
      this.speedX < 0
    )
      return;
    else {
      this.x += this.speedX * this.speedBoost;
    }
  }

  determineY(posX, posY, innerX, innerY) {
    if (posY === 0 && innerY < this.cellSize / 2 && this.speedY < 0) return;
    else if (
      posY === 0 &&
      innerY > this.cellSize / 2 &&
      this.maze[posY][posX].checkBottom() &&
      this.speedY > 0
    )
      return;
    else if (
      this.maze[posY][posX].checkBottom() &&
      innerY > this.cellSize / 2 &&
      this.speedY > 0
    )
      return;
    else if (
      posY !== 0 &&
      this.maze[posY - 1][posX].checkBottom() &&
      innerY < this.cellSize / 2 &&
      this.speedY < 0
    )
      return;
    else {
      this.y += this.speedY * this.speedBoost;
    }
  }
}
