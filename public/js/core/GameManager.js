import { LSGameData, LSStageProgress } from "../common/LocalStorage.js";
import { InputHandler } from "./ui/InputHandler.js";
import { createStateEditor } from "./ui/StateEditor.js";
import { TemplateRuleModal } from "./ui/TemplateRuleModal.js";

export class GameManager {
  constructor(board, stateManager, gameEvaluator, config) {
    this.config = config;
    this.stateManager = stateManager;
    this.board = board;
    this.gameEvaluator = gameEvaluator;

    this.canvasId = "canvas";
    this.canvas = document.getElementById(this.canvasId);
    this.isPlaying = false;
    this.animationId = null;
    this.selectedStateId = 2;
    this.speed = 200;
    this.completeFlag = false;

    // フリーモードの場合、前の盤面を引き継げる
    if (this.config.mode == "free") {
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
    this.draw();

    this.inputHandler = InputHandler(this);
    this.stateEditor = createStateEditor(this);
    this.templateRuleModal = TemplateRuleModal(this);

    if (this.config.mode == "stage") {
      const data = LSGameData.get(this.config.name);
      if (data) {
        this.updateStageComplete();
      }
    }

    gameEvaluator.initialize(this);

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
      this.startGameLoop();
    }
  }

  startGameLoop() {
    this.gameLoop();
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
    this.board.initializeBoard(1);
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

    if (
      this.gameEvaluator.evaluateTurn() &&
      !this.completeFlag &&
      this.config.mode == "stage"
    ) {
      this.stageComplete();
      this.completeFlag = true;
    }

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
      this.startGameLoop();
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

  stageComplete() {
    this.saveToLocalStorage();
    if (!this.completeFlag) {
      this.completeFlag = true;
      this.showCompletionScreen();
    }

    if (!localStorage.getItem("stageProgress")) {
      localStorage.setItem(
        "stageProgress",
        JSON.stringify({ a: 0, b: 0, c: 0 })
      );
    }
    const progress = LSStageProgress.get();
    const url = window.location.pathname;

    const path = url.split("/").filter((segment) => segment);
    progress[path[1]] = Math.max(parseInt(progress[path[1]], 10), path[2]);

    LSStageProgress.set(progress);
  }

  updateStageComplete() {
    document.getElementById("clearStatus").innerHTML = "クリア済み";
    document.getElementById("lastClearData").hidden = false;
    document.getElementById("lastClearData").addEventListener("click", (e) => {
      this.loadFromLocalStorage();
      this.draw();
    });

    document.getElementById("nextStage").classList.remove("disabled");
    this.draw();
  }

  showCompletionScreen(message = "Stage Completed!") {
    this.updateStageComplete();

    document.getElementById("stageClearMessage").textContent = message;

    var stageClearModal = new bootstrap.Modal(
      document.getElementById("stageClearModal")
    );
    stageClearModal.show();
  }
}
