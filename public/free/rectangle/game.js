import { Config } from "../../js/config/Config.js";
import { RectangularBoard } from "../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../js/core/GameManager.js";
import { GameEvaluator } from "../../js/core/stage/GameEvaluator.js";
import { StateManager } from "../../js/core/StateManager.js";
import { Life } from "../../js/data/templates.js";


const config = new Config({
  mode: "free",
  name: "rectangle",
});
const board = new RectangularBoard();
const stateManager = new StateManager(Life);
const gameEvaluator = new GameEvaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
