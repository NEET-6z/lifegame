import { Array2 } from "../../../js/common/utils.js";
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
  name: "c1",
});

class StageC1Evaluator extends GameEvaluator{
  setCustomInfo(){
    this.customInfo["turn"] = 0;
    this.customInfo["complete"] = 0;
  }

  evaluateTurn(){
    let ch = false;

    this.customInfo["turn"]++;

    if(this.cmis0() && this.customInfo["turn"]==30){
      if(this.board.getValueCount(2)>=1){
        this.customInfo["complete"] = 1;
        ch = true;
      }
      else{
        this.customInfo["complete"] = -1;
      }
    }
    
    this.updateInfo(this.customInfo);
    return ch
  }
}




let n = 35;

let defaultCells = Array2(n,n,1);

let lockedCells = Array2(n,n,0);
for(let i = 0;i<3;i++){
  for(let j = 0;j<3;j++){
    defaultCells[Math.ceil(n/2)-2+i][Math.ceil(n/2)-2+j] = 3;
    lockedCells[Math.ceil(n/2)-2+i][Math.ceil(n/2)-2+j] = 1;
  }
}

for(let i = 0;i<n;i++){
  for(let j = 0;j<n;j++){
    if(i<5 || j<5 || n-i<=5 || n-j<=5){
      lockedCells[i][j] = 1;
    }
  }
}


const Dead = new State(1, "Dead","white",true,1,[
  {
    "condition": [
      {
        "min": { "type": "number", "value": 1 },
        "target": { "type": "state", "value": 3 },
        "max": { "type": "number", "value": 2 }
      },
      {
        "min": { "type": "number", "value": 4 },
        "target": { "type": "state", "value": 3 },
        "max": { "type": "number", "value": 4 }
      }
    ],
    "nextState": 3,
    "operator": "or"
  },
  {
    "condition": [
      {
        "min": { "type": "number", "value": 3 },
        "target": { "type": "state", "value": 2 },
        "max": { "type": "number", "value": 3 }
      }
    ],
    "nextState": 2,
    "operator": "or"
  }
])

const Alive = new State(2, "Alive","black",true,1,[
  {
    "condition": [
      {
        "min": { "type": "number", "value": 5 },
        "target": { "type": "state", "value": 3 },
        "max": { "type": "number", "value": 8 }
      }
    ],
    "nextState": 3,
    "operator": "or"
  },
  {
    "condition": [
      {
        "min": { "type": "number", "value": 2 },
        "target": { "type": "state", "value": 2 },
        "max": { "type": "number", "value": 3 }
      }
    ],
    "nextState": 2,
    "operator": "or"
  }
])

const Virus = new State(3, "Virus","lime",true,1 ,[
  {
    "condition": [
      {
        "min": { "type": "number", "value": 2  },
        "target": { "type": "state", "value": 3 },
        "max": { "type": "number", "value": 2 }
      },
      {
        "min": { "type": "number", "value": 4  },
        "target": { "type": "state", "value": 3 },
        "max": { "type": "number", "value": 5 }
      },
    ],
    "nextState": 3,
    "operator": "or"
  },
  {
    "condition": [
      {
        "min": { "type": "number", "value": 3 },
        "target": { "type": "state", "value": 2 },
        "max": { "type": "number", "value": 3 }
      }
    ],
    "nextState": 2,
    "operator": "or"
  }
])


const stateManager = new StateManager();
stateManager.setState(Dead);
stateManager.setState(Alive);
stateManager.setState(Virus);


const board = new RectangularBoard(n,defaultCells,lockedCells);


const gameEvaluator = new StageC1Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
