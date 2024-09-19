import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import GameManager from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { StateManager } from "../../../js/core/StateManager.js";
checkStageAccess();

const config = new Config({
  resize: false,
  editstate: false,
  mode: "stage",
  name: "a1",
});


class StageA1Evaluator extends GameEvaluator{
  constructor(){
    super();
  }
  
  setCustomInfo(){
    this.customInfo["turn"] = 0;
    this.customInfo["complete"] = 0;

    this.preBoard = JSON.parse(JSON.stringify(this.gameManager.board.cells));
  }
  evaluateTurn(){
    let ch = false;

    this.customInfo["turn"]++;
    if(JSON.stringify(this.preBoard) == JSON.stringify(this.gameManager.board.cells)){
      this.customInfo["complete"] = -1;
    }
    
    this.preBoard = JSON.parse(JSON.stringify(this.gameManager.board.cells));
    
    if(this.cmis0() && this.customInfo["turn"]>=10){
      this.customInfo["complete"] = 1;
      ch = true;
    }
    
    this.updateInfo(this.customInfo);
    return ch;
  }
}



const gameEvaluator = new StageA1Evaluator();

const board = new RectangularBoard();
const stateManager = new StateManager();
const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
