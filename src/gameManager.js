import { Maze } from "./mazeGen.js";
import { Player } from "./entities/player.js";
import { Key } from "./entities/key.js";
import { Exit } from "./entities/exit.js";
import { InputHandler } from "./input.js";

export class gameManager {
  inputHandler;
  maze;
  lastTime = 0;
  context;
  players = {
    survivor: null,
    hunter: null,
  };
  keys = {};
  inputHandler;
  settings = {
    pHeight: null,
    pWidth: null,
    cellSize: null,
    cellFactor: null,
    borderWidth: null,
  };

  constructor(pHeight, pWidth, cellSize, cellFactor, borderWidth) {
    this.settings.pHeight = pHeight;
    this.settings.pWidth = pWidth;
    this.settings.cellSize = cellSize;
    this.settings.cellFactor = cellFactor;
    this.settings.borderWidth = borderWidth;
  }

  start(context) {
    const maze = new Maze(
      this.settings.pWidth,
      this.settings.pHeight,
      this.settings.cellSize,
      this.settings.borderWidth
    );
    maze.generateEmptyMaze();
    maze.generateNewMaze();

    const survivor = new Player(
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      3,
      "blue",
      "survivor",
      maze.getMazeArray(),
      this.settings.pWidth,
      this.settings.pHeight,
      this.settings.cellSize
    );

    const key1 = new Key(
      this.settings.cellSize,
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      3
    );

    const exit1 = new Exit(
      this.settings.cellSize,
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      this.settings.cellSize
    );

    new InputHandler(survivor);
    //Start after all else is initialized
    const width = this.settings.pWidth;
    const height = this.settings.pHeight;
    let lastTime = 0;
    function gameLoop(timeStamp) {
      let deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      //code
      context.clearRect(0, 0, width, height);
      maze.drawMaze(context);
      key1.draw(context);
      survivor.update(deltaTime);
      survivor.draw(context);
      exit1.draw(context);
      if (
        key1.enabled &&
        Math.floor(survivor.x / maze.cellSize) ==
          Math.floor(key1.x / maze.cellSize) &&
        Math.floor(survivor.y / maze.cellSize) ==
          Math.floor(key1.y / maze.cellSize)
      ) {
        key1.enabled = false;
        survivor.key = true;
        console.log("survivor has key!");
      }

      if (
        survivor.key &&
        Math.floor(survivor.x / maze.cellSize) ==
          Math.floor(exit1.x / maze.cellSize) &&
        Math.floor(survivor.y / maze.cellSize) ==
          Math.floor(exit1.y / maze.cellSize)
      ) {
        alert("you have one the game");
        context.clearRect(0, 0, width, height);
        return;
      } else if (
        Math.floor(survivor.x / maze.cellSize) ==
          Math.floor(exit1.x / maze.cellSize) &&
        Math.floor(survivor.y / maze.cellSize) ==
          Math.floor(exit1.y / maze.cellSize)
      )
        console.log("Need the key!!!");
      //after
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }
}
