import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { StateManager } from "../../../js/core/StateManager.js";
import { Life } from "../../../js/data/rule.js";

checkStageAccess();

const config = new Config({
  resize: false,
  editstate: false,
  mode: "stage",
  name: "c5",
});



const board = new RectangularBoard();
const stateManager = new StateManager(Life);
const gameEvaluator = new GameEvaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
