import { Config } from "../../js/config/Config.js";
import { TriangularBoard } from "../../js/core/board/TriangularBoard.js";
import { GameManager } from "../../js/core/GameManager.js";
import { GameEvaluator } from "../../js/core/stage/GameEvaluator.js";
import { StateManager } from "../../js/core/StateManager.js";
import { Life } from "../../js/data/rule.js";


const config = new Config({
  resize: true,
  editstate: true,
  mode: "free",
  name: "triangle",
});
const board = new TriangularBoard();

const stateManager = new StateManager(Life);
const gameEvaluator = new GameEvaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
