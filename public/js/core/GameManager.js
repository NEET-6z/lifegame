import { LSGameData } from "../common/LocalStorage.js";
import { InputHandler } from "./dom/InputHandler.js";
import { createStateEditor } from "./dom/StateEditor.js";
import { TemplateRuleModal } from "./dom/TemplateRuleModal.js";

export class GameManager {
  constructor(board, stateManager, gameEvaluator, config) {
    this.config = config;
    this.stateManager = stateManager;
    this.board = board;
    this.gameEvaluator = gameEvaluator;
    gameEvaluator.initialize(this);

    this.canvasId = "canvas";
    this.canvas = document.getElementById(this.canvasId);
    this.canvas.style.userSelect = "none";
    this.isPlaying = false;
    this.animationId = null;
    this.selectedStateId = 2;
    this.speed = 200;

    // フリーモードの場合、前の盤面を引き継げる
    if (this.config.mode === "free") {
      if (localStorage.getItem("shouldClearCache") === "true") {
        localStorage.removeItem("shouldClearCache");
        LSGameData.remove(this.config.name);
      }

      this.loadFromLocalStorage();
      window.addEventListener(
        "beforeunload",
        this.saveToLocalStorage.bind(this)
      );
    }

    this.inputHandler = InputHandler(this);
    this.stateEditor = createStateEditor(this);
    this.templateRuleModal = TemplateRuleModal(this);

    if (this.config.mode === "stage") {
      const data = LSGameData.get(this.config.name);
      if (data) {
        this.gameEvaluator.updateStageComplete();
      }
    }

    this.draw();
  }

  draw() {
    this.board.render(this.canvas, this.stateManager, this.isPlaying);

    if (this.isPlaying) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Running...", canvas.width / 2, canvas.height / 2);
    }
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.board.historyCells.push(
        JSON.parse(JSON.stringify(this.board.cells))
      );
      this.gameEvaluator.start();
      this.gameLoop();
    }
  }

  stopGameLoop() {
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
  }

  undo() {
    this.stop();
    this.board.cells = JSON.parse(
      JSON.stringify(this.board.historyCells.slice(-1)[0])
    );
    if (this.board.historyCells.length >= 2) this.board.historyCells.pop();

    this.draw();
  }

  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.stopGameLoop();

      this.board.cells = JSON.parse(
        JSON.stringify(this.board.historyCells.slice(-1)[0])
      );
      this.gameEvaluator.stop();
      this.draw();
    }
  }

  clear() {
    this.stop();
    this.board.initialize(1);
    this.draw();
  }

  random() {
    if (this.config.mode != "free") return;
    this.stop();
    this.board.random(this.stateManager.getAllState());
    this.draw();
  }

  gameLoop() {
    if (!this.isPlaying) return;
    this.board.nextGeneration(this.stateManager);
    this.draw();

    this.gameEvaluator.evaluateTurn();

    this.animationId = setTimeout(() => this.gameLoop(), this.speed);
  }

  resizeBoard(size) {
    this.clear();
    this.board.resize(size);
    this.draw();
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed;
    if (this.isPlaying) {
      this.stopGameLoop();
      this.gameLoop();
    }
  }

  setCell(x, y, v) {
    if (this.isPlaying) return;
    this.board.setCell(x, y, v);
    this.draw();
  }

  saveToLocalStorage() {
    const data = {
      gameManager: {
        speed: this.speed,
        selectedStateId: this.selectedStateId,
      },
      board: {
        size: this.board.size,
        cells: this.isPlaying
          ? this.board.historyCells.slice(-1)[0]
          : this.board.cells,
      },
      stateManager: {
        states: this.stateManager.states,
        nextStateId: this.stateManager.nextStateId,
      },
    };

    LSGameData.set(data, this.config.name);
    console.log("All data saved to localStorage");
  }

  loadFromLocalStorage() {
    if (this.isPlaying) return;

    const data = LSGameData.get(this.config.name);

    if (data) {
      this.speed = data.gameManager.speed;
      this.selectedStateId = data.gameManager.selectedStateId;

      this.board.resize(data.board.size);
      this.board.cells = JSON.parse(JSON.stringify(data.board.cells));

      this.stateManager.states = data.stateManager.states;
      this.stateManager.nextStateId = data.stateManager.nextStateId;
    }
  }
}
