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
  name: "b3",
});


class StageB3Evaluator extends GameEvaluator{
  setgameInfo(){
    this.gameInfo["turn"] = 0;
    this.gameInfo["complete"] = 0;
  }

  evaluateTurn(){
    let res = false;

    this.gameInfo["turn"]++;

    if(this.cmis0() && this.board.getValueCount(2)==0){
      if(this.gameInfo["turn"]==5){
        this.gameInfo["complete"] = 1;
        res = true;
      }
      else{
        this.gameInfo["complete"] = -1;
      }
    }

    if(this.cmis0() && this.gameInfo["turn"]>=5){
      this.gameInfo["complete"] = -1;
    }
    
    
    this.updateInfo(this.gameInfo);
    return res
  }
}



const board = new RectangularBoard(10);
const stateManager = new StateManager(Life);
const gameEvaluator = new StageB3Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);



