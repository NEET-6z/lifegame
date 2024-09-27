import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { StateManager } from "../../../js/core/StateManager.js";
import { Life } from "../../../js/data/templates.js";

checkStageAccess();

const config = new Config({
  mode: "stage",
  name: "a4",
});

class StageA3Evaluator extends GameEvaluator{
  setgameInfo(){
    this.gameInfo["turn"] = 0;
    this.gameInfo["complete"] = 0;

    if(this.board.getValueCount(2)<10){
      this.gameInfo['complete'] = -2;
    }
  }

  evaluateTurn(){
    let ch = false;

    this.gameInfo["turn"]++;
    if(this.cmis0() && this.gameInfo["turn"]>=100){
      this.gameInfo["complete"] = -1;
    }
    
    if(this.cmis0() && this.board.getValueCount(2)===0){
      this.gameInfo["complete"] = 1;
      ch = true;
    }
    this.updateInfo(this.gameInfo);
    return ch
  }
}


const board = new RectangularBoard(10);
const stateManager = new StateManager(Life);
const gameEvaluator = new StageA3Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
