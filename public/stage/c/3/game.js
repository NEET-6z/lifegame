import { Queue } from "../../../js/common/utils.js";
import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { StateManager } from "../../../js/core/StateManager.js";

checkStageAccess();

const config = new Config({
  resize: false,
  editstate: false,
  mode: "stage",
  name: "c3",
});

class StageC3Evaluator extends GameEvaluator{
  setCustomInfo(){
    this.customInfo["turn"] = 0;
    this.customInfo["complete"] = 0;
    this.customInfo["period length"] = 1;

  
    this.history = new Array(1000000).fill(-1);
    this.queue = new Queue();
    const hash = this.hash(this.gameManager.board.cells);
    this.history[hash] = 0;
    this.queue.push(hash);
  }

  hash(cells){
    let base = this.gameManager.stateManager.getAllState().length;
    let mod = 1000000;
    let ch = 0;
    for(let i = 0;i<this.gameManager.board.size;i++){
      for(let j = 0;j<this.gameManager.board.getWsize(i);j++){
        ch = (ch*base+this.gameManager.board.getCell(j,i))%mod;
      }
    }

    return ch;
  }

  evaluateTurn(){
    let ch = false;

    this.customInfo["turn"]++;

    const hash = this.hash(this.gameManager.board.cells);
    if(this.history[hash]==-1){
      this.history[hash] = this.customInfo["turn"];
    }
    if(this.customInfo["turn"]-this.history[hash]>=1){
      this.customInfo["period length"] = this.customInfo["turn"]-this.history[hash];
    }
    if(this.cmis0() && this.customInfo["turn"]-this.history[hash]==10){
      ch = true;
      this.customInfo["complete"] = 1;
    }

    if(this.customInfo["turn"]>=10){
      const p = this.queue.pop();
      if(this.customInfo['turn']-10>=this.history[p]){
        this.history[p] = -1;
      }
    }
    this.history[hash] = this.customInfo["turn"];
    this.queue.push(hash)

    this.updateInfo(this.customInfo);
    return ch
  }
}

const board = new RectangularBoard();
const stateManager = new StateManager();
const gameEvaluator = new StageC3Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
