const gameCanvas = document.querySelector("canvas");
const context = gameCanvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
const height = 720; //default 480
const width = 1080; //default 720
const cellFactor = 3;
gameContainer.style.width = `${width}px`;
gameContainer.style.height = `${height}px`;
gameContainer.style.display = "block";

const cellSize = 12 * cellFactor;
const lineWidth = 3;
gameCanvas.height = height;
gameCanvas.width = width;
game = new gameManager(height, width, 12 * cellFactor, cellFactor, lineWidth);
game.start(context);
