import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { State, StateManager } from "../../../js/core/StateManager.js";

checkStageAccess();

const config = new Config({
  mode: "stage",
  name: "c1",
});

class StageC1Evaluator extends GameEvaluator {
  setgameInfo() {
    this.gameInfo["turn"] = 0;
    this.gameInfo["complete"] = 0;

    if (this.board.getValueCount(2) > 20) {
      this.gameInfo["complete"] = -2;
    }
  }

  evaluateTurn() {
    let ch = false;

    this.gameInfo["turn"]++;

    if (this.cmis0() && this.board.getValueCount(3) == 49) {
      this.gameInfo["complete"] = 1;
      ch = true;
    }

    this.updateInfo(this.gameInfo);
    return ch;
  }
}


const Alive = new State(1, "Dead", "white", true, 1, [
  {
    condition: [
      {
        target: {
          type: "state",
          value: 2,
        },
        min: {
          type: "number",
          value: 3,
        },
        max: {
          type: "number",
          value: 3,
        },
      },
    ],
    nextState: 2,
    operator: "or",
  },
]);

const Dead = new State(2, "Alive", "black", true, 3, [
  {
    condition: [
      {
        target: {
          type: "state",
          value: 2,
        },
        min: {
          type: "number",
          value: 2,
        },
        max: {
          type: "number",
          value: 3,
        },
      },
    ],
    nextState: 2,
    operator: "or",
  },
])

const Corpse =  new State(3, "死骸", "#ccc", false, 3, [
  {
    condition: [
      {
        target: {
          type: "state",
          value: 2,
        },
        min: {
          type: "number",
          value: 3,
        },
        max: {
          type: "number",
          value: 3,
        },
      },
    ],
    nextState: 2,
    operator: "or",
  },
])

const board = new RectangularBoard(7);
const gameEvaluator = new StageC1Evaluator();
const stateManager = new StateManager();

stateManager.setState(Alive);

stateManager.setState(Dead);

stateManager.setState(Corpse);

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);