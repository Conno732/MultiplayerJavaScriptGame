export class Player {
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
    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = 3;
    this.speedBoost = 1;
    this.key = false;
    this.direction = 0;

    if (!x) return;
    this.x = cellSize * x - cellSize / 2;
    this.y = cellSize * y - cellSize / 2;
    this.radius = cellSize / radius;
    this.color = color;
    this.type = type;
    this.mazeHeight = mazeHeight;
    this.mazeWidth = mazeWidth;
    this.cellSize = cellSize;
    this.maze = maze;
  }

  buildFromData(cellSize, maze, mazeWidth, mazeHeight, x, y, type) {
    this.cellSize = cellSize;
    this.maze = maze.maze;
    this.mazeWidth = mazeWidth;
    this.mazeHeight = mazeHeight;
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.type = type;
    this.radius = cellSize / 3;
    if (type === "survivor") this.color = "blue";
    else this.color = "red";
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
    this.direction -= 10;
    this.direction = this.direction % 360;
    // this.speedX = -this.maxSpeed;
  }

  moveRight() {
    this.direction += 10;
    if (this.direction < 0) this.direction += 360;
    this.direction = this.direction % 360;
    //this.speedX = this.maxSpeed;
  }

  moveUp() {
    this.speedY =
      this.maxSpeed * Math.cos((this.direction - 45) * (Math.PI / 180));
    this.speedX =
      -this.maxSpeed * Math.sin((this.direction - 45) * (Math.PI / 180));
  }

  moveDown() {
    this.speedY =
      -this.maxSpeed * Math.cos((this.direction - 45) * (Math.PI / 180));
    this.speedX =
      this.maxSpeed * Math.sin((this.direction - 45) * (Math.PI / 180));
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
    //console.log(this.direction);
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
  }

  determineX(posX, posY, innerX, innerY) {
    if (posX === 0 && innerX < this.cellSize / 2 && this.speedX < 0) return;
    else if (
      posX === 0 &&
      innerX > this.cellSize / 2 &&
      this.maze[posY][posX].right &&
      this.speedX > 0
    )
      return;
    else if (
      this.maze[posY][posX].right &&
      innerX > this.cellSize / 2 &&
      this.speedX > 0
    )
      return;
    else if (
      posX !== 0 &&
      this.maze[posY][posX - 1].right &&
      innerX < this.cellSize / 2 &&
      this.speedX < 0
    )
      return;
    //finer polishing lol
    // else if (
    //   posY !== 0 &&
    //   posX !== 0 &&
    //   this.maze[posY - 1][posX - 1].checkBottom() &&
    //   innerY < this.cellSize / 3 &&
    //   innerX < this.cellSize / 2 &&
    //   this.speedX < 0
    // )
    //   return;
    // else if (
    //   posX !== 0 &&
    //   this.maze[posY][posX - 1].checkBottom() &&
    //   innerY > this.cellSize - this.cellSize / 5 &&
    //   innerX < this.cellSize / 2 &&
    //   this.speedX < 0
    // )
    //   return;
    // else if (
    //   this.maze[posY + 1][posX + 1].checkBottom() &&
    //   innerY > this.cellSize - this.cellSize / 3 &&
    //   innerX > this.cellSize / 2 &&
    //   this.speedX > 0
    // )
    //   return;
    // else if (
    //   posX !== 0 &&
    //   this.maze[posY][posX - 1].checkBottom() &&
    //   innerY > this.cellSize - this.cellSize / 5 &&
    //   innerX < this.cellSize / 2 &&
    //   this.speedX < 0
    // )
    //   return;
    else {
      // console.log(
      //   innerY,
      //   this.maze[posY - 1][posX + 1],
      //   this.cellSize - this.cellSize / 3,
      //   innerX
      // );

      this.x += this.speedX * this.speedBoost;
    }
  }

  determineY(posX, posY, innerX, innerY) {
    if (posY === 0 && innerY < this.cellSize / 2 && this.speedY < 0) return;
    else if (
      posY === 0 &&
      innerY > this.cellSize / 2 &&
      this.maze[posY][posX].bottom &&
      this.speedY > 0
    )
      return;
    else if (
      this.maze[posY][posX].bottom &&
      innerY > this.cellSize / 2 &&
      this.speedY > 0
    )
      return;
    else if (
      posY !== 0 &&
      this.maze[posY - 1][posX].bottom &&
      innerY < this.cellSize / 2 &&
      this.speedY < 0
    )
      return;
    else {
      this.y += this.speedY * this.speedBoost;
    }
  }
}
