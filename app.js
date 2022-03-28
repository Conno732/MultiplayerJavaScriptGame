const gameCanvas = document.querySelector("canvas");
const context = gameCanvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
const height = 720; //default 480
const width = 1080; //default 720
const cellSizeInput = 1;
gameContainer.style.width = `${width}px`;
gameContainer.style.height = `${height}px`;
gameContainer.style.display = "block";

const cellSize = 24 * cellSizeInput;
const lineWidth = 3;
gameCanvas.height = height;
gameCanvas.width = width;
const maze = new Maze(width, height, cellSize, lineWidth);
maze.generateEmptyMaze();
maze.generateNewMaze();
maze.drawMaze(context);
const player = new Player(
  cellSize * 3 - cellSize / 2,
  cellSize * 3 - cellSize / 2,
  cellSize / 3,
  "blue",
  "survivor",
  maze.getMazeArray(),
  width,
  height,
  cellSize
);
player.draw(context);

new InputHandler(player);

let lastTime = 0;
function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  //code
  context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  maze.drawMaze(context);
  player.update(deltaTime);
  player.draw(context);
  //after
  requestAnimationFrame(gameLoop);
}

gameLoop();
