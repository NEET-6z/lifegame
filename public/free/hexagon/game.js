import { Config } from "../../js/config/Config.js";
import { HexagonalBoard } from "../../js/core/board/HexagonalBoard.js";
import { GameManager } from "../../js/core/GameManager.js";
import { GameEvaluator } from "../../js/core/stage/GameEvaluator.js";
import { StateManager } from "../../js/core/StateManager.js";

const config = new Config({
  resize: true,
  editstate: true,
  mode: "free",
  name: "hexagon",
});

const board = new HexagonalBoard();
const stateManager = new StateManager();
const gameEvaluator = new GameEvaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
