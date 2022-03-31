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

  constructor(pHeight, pWidth, cellSize, cellFactor, borderWidth) {
    this.pHeight = pHeight;
    this.pWidth = pWidth;
    this.cellSize = cellSize;
    this.cellFactor = cellFactor;
    this.borderWidth = borderWidth;
  }

  start(context, host) {
    if (!host) {
      const network = new NetworkProtocols();
      const maze = new Maze(
        this.pWidth,
        this.pHeight,
        this.cellSize,
        this.borderWidth
      );
      this.maze = maze;
      maze.generateEmptyMaze();
      maze.generateNewMaze();
      const keys = this.generateKeys();
      const players = this.generatePlayers();
      const exits = this.generateExits();
      new InputHandler(players[0]);
      network.initGame(players, keys, exits, maze);
      this.startGameLoop(
        keys,
        players,
        exits,
        maze,
        context,
        "survivor",
        network
      );
    } else {
      console.log("Trying to connect to game " + host);
      //uh oh
      setTimeout(() => {
        const maze = new Maze();
        maze.buildFromData(network.gameData[`maze`]);
        const key1 = new Key();
        key1.buildFromData(this.cellSize, network.gameData[`key1`]);
        const key2 = new Key();
        key2.buildFromData(this.cellSize, network.gameData[`key2`]);
        const keys = [key1, key2];
        const survivor = new Player();
        survivor.buildFromData(
          this.cellSize,
          maze,
          this.pWidth,
          this.pHeight,
          network.gameData[`players`][`survivor`].x,
          network.gameData[`players`][`survivor`].y,
          "survivor"
        );
        const hunter = new Player();
        hunter.buildFromData(
          this.cellSize,
          maze,
          this.pWidth,
          this.pHeight,
          network.gameData[`players`][`hunter`].x,
          network.gameData[`players`][`hunter`].y,
          "hunter"
        );
        const players = [survivor, hunter];
        const exit1 = new Exit();
        exit1.buildFromData(
          this.cellSize,
          network.gameData["exit1"].x,
          network.gameData[`exit1`].y
        );
        const exit2 = new Exit();
        exit2.buildFromData(
          this.cellSize,
          network.gameData[`exit2`].x,
          network.gameData[`exit2`].y
        );
        const exists = [exit1, exit2];
        new InputHandler(players[1]);
        this.startGameLoop(
          keys,
          players,
          exists,
          maze,
          context,
          "hunter",
          network
        );
      }, 1000);
      const network = new NetworkProtocols(host);
    }
  }

  startGameLoop(keys, players, exits, maze, context, playerType, network) {
    //Start after all else is initialized
    const width = this.pWidth;
    const height = this.pHeight;
    let lastTime = 0;
    function gameLoop(timeStamp) {
      let deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      //Render loop ??
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
      if (playerType === "survivor") {
        network.uploadSurvivor(players[0].x, players[0].y);
        if (network.players) {
          players[1].x = parseInt(network.players.hunter.x);
          players[1].y = parseInt(network.players.hunter.y);
        }
      } else {
        network.uploadHunter(players[1].x, players[1].y);
        if (network.players) {
          players[0].x = parseInt(network.players.survivor.x);
          players[0].y = parseInt(network.players.survivor.y);
        }
      }
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
      this.cellSize,
      Math.floor(Math.random() * (this.pWidth / this.cellSize - 1)) + 1,
      Math.floor(Math.random() * (this.pHeight / this.cellSize - 1)) + 1,
      this.cellSize
    );
    exits[1] = new Exit(
      this.cellSize,
      Math.floor(Math.random() * (this.pWidth / this.cellSize - 1)) + 1,
      Math.floor(Math.random() * (this.pHeight / this.cellSize - 1)) + 1,
      this.cellSize
    );
    return exits;
  }

  generatePlayers() {
    //0 in array is survivor, 1 is hunter
    let ret = Array(2);
    ret[0] = new Player(
      Math.floor(Math.random() * (this.pWidth / this.cellSize - 1)) + 1,
      Math.floor(Math.random() * (this.pHeight / this.cellSize - 1)) + 1,
      3,
      "blue",
      "survivor",
      this.maze.getMazeArray(),
      this.pWidth,
      this.pHeight,
      this.cellSize
    );
    ret[1] = new Player(
      Math.floor(Math.random() * (this.pWidth / this.cellSize - 1)) + 1,
      Math.floor(Math.random() * (this.pHeight / this.cellSize - 1)) + 1,
      3,
      "red",
      "hunter",
      this.maze.getMazeArray(),
      this.pWidth,
      this.pHeight,
      this.cellSize
    );
    return ret;
  }

  generateKeys() {
    let keys = Array(2);
    keys[0] = new Key(
      this.cellSize,
      Math.floor(Math.random() * (this.pWidth / this.cellSize - 1)) + 1,
      Math.floor(Math.random() * (this.pHeight / this.cellSize - 1)) + 1,
      3
    );
    keys[1] = new Key(
      this.cellSize,
      Math.floor(Math.random() * (this.pWidth / this.cellSize - 1)) + 1,
      Math.floor(Math.random() * (this.pHeight / this.cellSize - 1)) + 1,
      3
    );
    return keys;
  }

  packGameData() {}
}
