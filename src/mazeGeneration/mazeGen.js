import { Cell } from "./cell.js";

export class Maze {
  //Set the size of the cells. Height and width are determined by cell size
  constructor(pWidth, pHeight, cellSize, lineWidth) {
    if (!pWidth) return;
    this.width = pWidth / cellSize;
    this.height = pHeight / cellSize;
    this.cellSize = cellSize;
    this.maze;
    this.lineWidth = lineWidth;
    this.walls = [];
  }

  buildFromData(maze) {
    this.width = maze.width;
    this.height = maze.height;
    this.cellSize = maze.cellSize;
    this.lineWidth = maze.lineWidth;
    this.maze = new Array(this.height);
    this.walls = [];
    for (let m = 0; m < this.height; m++) {
      this.maze[m] = new Array(this.width);
      for (let n = 0; n < this.width; n++) {
        this.maze[m][n] = new Cell(n, m);
        if (!maze.maze[m][n].bottom) this.maze[m][n].eraseBottom();
        if (!maze.maze[m][n].right) this.maze[m][n].eraseRight();
      }
    }
  }

  setMaze(maze) {
    this.maze = maze;
  }
  //Generate an empty maze (actually a FULL maze)
  generateEmptyMaze() {
    this.maze = new Array(this.height);
    for (let m = 0; m < this.height; m++) {
      this.maze[m] = new Array(this.width);
      for (let n = 0; n < this.width; n++) {
        this.maze[m][n] = new Cell(n, m);
      }
    }
  }

  getMazeArray() {
    return this.maze;
  }

  //Potentially add parameters for different maze generation algorithms
  //Chooses a random spot for the exit (either a wall or hatch?), chooses a random spot for the maze algorithm to start?
  generateNewMaze() {
    let coordX = Math.floor(Math.random() * this.width);
    let coordY = Math.floor(Math.random() * this.height);
    let stack = [];
    let direction;
    let current;
    stack.push(this.maze[coordY][coordX]);
    while (stack.length != 0) {
      current = stack[stack.length - 1];
      coordX = current.getX();
      coordY = current.getY();
      direction = Math.floor(Math.random() * 4); // 0 left, 1 right, 2 up, 3 down
      //check if direction is in bounds
      if (
        (direction == 0 && coordX - 1 < 0) ||
        (direction == 1 && coordX + 1 >= this.width) ||
        (direction == 2 && coordY - 1 < 0) ||
        (direction == 3 && coordY + 1 >= this.height)
      ) {
        continue;
      }
      current.setVisited();
      switch (direction) {
        case 0:
          if (this.maze[coordY][coordX - 1].getVisited()) break;
          stack.push(this.maze[coordY][coordX - 1]);
          stack[stack.length - 1].eraseRight();
          if (
            Math.floor(Math.random() * 10) <= 1 &&
            coordY != this.height - 1
          ) {
            current.eraseBottom();
          }
          break;
        case 1:
          if (this.maze[coordY][coordX + 1].getVisited()) break;
          stack.push(this.maze[coordY][coordX + 1]);
          current.eraseRight();
          if (
            Math.floor(Math.random() * 10) <= 1 &&
            coordY != this.height - 1
          ) {
            current.eraseBottom();
          }
          break;
        case 2:
          if (this.maze[coordY - 1][coordX].getVisited()) break;
          stack.push(this.maze[coordY - 1][coordX]);
          stack[stack.length - 1].eraseBottom();
          if (Math.floor(Math.random() * 10) <= 1 && coordX != this.width - 1) {
            current.eraseRight();
          }
          break;
        case 3:
          if (this.maze[coordY + 1][coordX].getVisited()) break;
          stack.push(this.maze[coordY + 1][coordX]);
          current.eraseBottom();
          if (Math.floor(Math.random() * 10) <= 1 && coordX != this.width - 1) {
            current.eraseRight();
          }
          break;
      }

      //check if has valid moves left
      if (
        (coordY == this.height - 1 ||
          this.maze[coordY + 1][coordX].getVisited()) &&
        (coordY == 0 || this.maze[coordY - 1][coordX].getVisited()) &&
        (coordX == this.width - 1 ||
          this.maze[coordY][coordX + 1].getVisited()) &&
        (coordX == 0 || this.maze[coordY][coordX - 1].getVisited())
      ) {
        stack.pop();
      }
    }
  }

  getWalls() {
    this.walls.push([0, 0, this.width * this.cellSize, 0]);
    this.walls.push([0, 0, 0, this.height * this.cellSize]);
    for (let m = 0; m < this.height; m++) {
      for (let n = 0; n < this.width; n++) {
        if (this.maze[m][n].checkRight()) {
          this.walls.push([
            n * this.cellSize + this.cellSize,
            m * this.cellSize - this.lineWidth / 2,
            n * this.cellSize + this.cellSize,
            m * this.cellSize + this.cellSize + this.lineWidth / 2,
          ]);
        }

        if (this.maze[m][n].checkBottom()) {
          this.walls.push([
            n * this.cellSize - this.lineWidth / 2,
            m * this.cellSize + this.cellSize,
            n * this.cellSize + this.cellSize + this.lineWidth / 2,
            m * this.cellSize + this.cellSize,
          ]);
        }
      }
    }
    return this.walls;
  }

  drawMaze(context, color) {
    if (color) {
      context.fillStyle = "#373737";
      context.fillRect(
        0,
        0,
        this.width * this.cellSize,
        this.height * this.cellSize
      );
    } else {
      context.fillStyle = "#D3D3D3";
      context.fillRect(
        0,
        0,
        this.width * this.cellSize,
        this.height * this.cellSize
      );
    }
    context.strokeStyle = "black";
    context.lineWidth = this.lineWidth;
    for (let m = 0; m < this.height; m++) {
      for (let n = 0; n < this.width; n++) {
        if (this.maze[m][n].checkRight()) {
          context.beginPath();
          context.moveTo(
            n * this.cellSize + this.cellSize,
            m * this.cellSize - this.lineWidth / 2
          );
          context.lineTo(
            n * this.cellSize + this.cellSize,
            m * this.cellSize + this.cellSize + this.lineWidth / 2
          );
          context.stroke();
        }

        if (this.maze[m][n].checkBottom()) {
          context.beginPath();
          context.moveTo(
            n * this.cellSize - this.lineWidth / 2,
            m * this.cellSize + this.cellSize
          );
          context.lineTo(
            n * this.cellSize + this.cellSize + this.lineWidth / 2,
            m * this.cellSize + this.cellSize
          );
          context.stroke();
        }
      }
    }
  }
}
