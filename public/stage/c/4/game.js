import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { State, StateManager } from "../../../js/core/StateManager.js";

checkStageAccess();

const config = new Config({
  resize: false,
  editstate: false,
  mode: "stage",
  name: "c4",
});

class StageC4Evaluator extends GameEvaluator{
  setCustomInfo(){
    this.customInfo["turn"] = 0;
    this.customInfo["complete"] = 0;

    if(this.board.getValueCount(2)>20){
      this.customInfo["complete"] = -2;
    }
  }

  evaluateTurn(){
    let ch = false;

    this.customInfo["turn"]++;

    if(this.cmis0() && this.board.getValueCount(3)==49){
      this.customInfo["complete"] = 1;
      ch = true;
    }
    
    
    this.updateInfo(this.customInfo);
    return ch
  }
}



const board = new RectangularBoard(7);
const gameEvaluator = new StageC4Evaluator();
const stateManager = new StateManager();

stateManager.setState(
  2,
  new State("Alive", "black", true, 3, [
    {
      condition: [
        {
          state: 2,
          min: 2,
          max: 3,
        },
      ],
      nextState: 2,
    },
  ])
)

stateManager.setState(
  3,
  new State("死骸", "#ccc", false, 3, [
    {
      condition: [
        {
          state: 2,
          min: 3,
          max: 3,
        },
      ],
      nextState: 2,
    },
  ])
)

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
