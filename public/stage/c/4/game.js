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
  new State(2, "Alive", "black", true, 3, [
    {
      condition: [
        {
          target: {
            type: 'state',
            value: 2,
          },
          min: {
            type: "number",
            value: 2,
          },
          max: {
            type: "number",
            value:3,
          }
        },
      ],
      nextState: 2,
      operation: 'and',
    },
  ])
)

stateManager.setState(
  new State(3, "死骸", "#ccc", false, 3, [
    {
      condition: [
        {
          target: {
            type: 'state',
            value: 2,
          },
          min: {
            type: "number",
            value: 3,
          },
          max: {
            type: "number",
            value:3,
          }
        },
      ],
      nextState: 2,
      operation: 'and',
    },
  ])
)

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
