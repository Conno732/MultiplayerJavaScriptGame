import { Maze } from "./mazeGen.js";
import { Player } from "./entities/player.js";
import { Key } from "./entities/key.js";
import { Exit } from "./entities/exit.js";
import { InputHandler } from "./input.js";
import { NetworkProtocols } from "./networkProtocol.js";

export class gameManager {
  inputHandler;
  maze;
  lastTime = 0;
  context;
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
    const network = new NetworkProtocols();

    const maze = new Maze(
      this.settings.pWidth,
      this.settings.pHeight,
      this.settings.cellSize,
      this.settings.borderWidth
    );
    this.maze = maze;
    maze.generateEmptyMaze();
    maze.generateNewMaze();
    const keys = this.generateKeys();
    const players = this.generatePlayers();
    const exits = this.generateExits();

    new InputHandler(players[0]);
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
      //game logic for all keys
      keys.forEach((key) => {
        key.draw(context);
        if (
          key.enabled &&
          Math.floor(players[0].x / maze.cellSize) ==
            Math.floor(key.x / maze.cellSize) &&
          Math.floor(players[0].y / maze.cellSize) ==
            Math.floor(key.y / maze.cellSize)
        ) {
          key.enabled = false;
          players[0].key = true;
          console.log("survivor has key!");
        }
      });

      //game logic for exits
      exits.forEach((exit) => {
        exit.draw(context);
        if (
          players[0].key &&
          Math.floor(players[0].x / maze.cellSize) ==
            Math.floor(exit.x / maze.cellSize) &&
          Math.floor(players[0].y / maze.cellSize) ==
            Math.floor(exit.y / maze.cellSize)
        ) {
          alert("you have one the game");
          // context.clearRect(0, 0, width, height);
          // return;
        } else if (
          Math.floor(players[0].x / maze.cellSize) ==
            Math.floor(exit.x / maze.cellSize) &&
          Math.floor(players[0].y / maze.cellSize) ==
            Math.floor(exit.y / maze.cellSize)
        )
          console.log("Need the key!!!");
      });

      //game logic for players
      players.forEach((player) => {
        player.update(deltaTime);
        player.draw(context);
      });

      //after
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }

  generateExits() {
    let exits = Array(2);
    exits[0] = new Exit(
      this.settings.cellSize,
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      this.settings.cellSize
    );

    exits[1] = new Exit(
      this.settings.cellSize,
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      this.settings.cellSize
    );
    return exits;
  }

  generatePlayers() {
    //0 in array is survivor, 1 is hunter
    let ret = Array(2);
    ret[0] = new Player(
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      3,
      "blue",
      "survivor",
      this.maze.getMazeArray(),
      this.settings.pWidth,
      this.settings.pHeight,
      this.settings.cellSize
    );
    ret[1] = new Player(
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      3,
      "red",
      "hunter",
      this.maze.getMazeArray(),
      this.settings.pWidth,
      this.settings.pHeight,
      this.settings.cellSize
    );
    return ret;
  }

  generateKeys() {
    let keys = Array(2);
    keys[0] = new Key(
      this.settings.cellSize,
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      3
    );
    keys[1] = new Key(
      this.settings.cellSize,
      Math.floor(
        Math.random() * (this.settings.pWidth / this.settings.cellSize - 1)
      ) + 1,
      Math.floor(
        Math.random() * (this.settings.pHeight / this.settings.cellSize - 1)
      ) + 1,
      3
    );
    return keys;
  }
}
