//状態を表す
export class State {
  constructor(name, color, canSelect=true, defaultState = 0, transitionRules = [], params = [0,0,0,0,0]) {
    this.name = name;
    this.color = color;
    this.canSelect = canSelect;
    this.defaultState = defaultState;
    this.transitionRules = transitionRules;

    this.params = params;
  }

  addTransitionRule(rule) {
    this.transitionRules.push(rule);
  }
}

//すべての状態を管理する
export class StateManager {
  constructor() {
    this.states = {};
    this.nextStateId = 11;
    
    this.paramSlot = [1,2,3,4,5];
    
    this.initializeStates();
  }

  initializeStates() {
    this.setState(0, new State("Null", "#eee", false, 0, []));
    
    this.setState(
      1,
      new State("Dead", "white", true, 1,  [
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
              }
            },
          ],
          nextState: 2,
        },
      ],
      )
    );
    this.setState(
      2,
      new State("Alive", "black", true, 1, [
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
              }
            },
          ],
          nextState: 2,
        },
      ])
    );
  }

  setState(id, state) {
    if (0 <= id && id <= 10) {
      this.states[id] = state;
      return true;
    }
    return false;
  }

  addState() {
    this.states[this.nextStateId] = new State(
      `state${this.nextStateId - 10}`,
      "lime",
      true,
      this.nextStateId,
      []
    );
    this.nextStateId++;
  }

  removeState(id) {
    if (id in this.states) {
      delete this.states[id];
      return true;
    }
    return false;
  }

  getState(id) {
    return this.states[id];
  }

  getAllState() {
    return Object.entries(this.states)
      .filter(([id]) => Number(id) !== 0)
      .map(([id, state]) => {
        return { id: Number(id), ...state };
      });
  }

  getParamSlot(){
    return this.paramSlot;
  }

  nextState(id, neighbors) {
    const state = this.getState(id);
    if (state) {
      for (let rule of state.transitionRules) {
        let ok = true;
        for (let c of rule.condition) {
          let target = this.ruleTypeMatching(c.target,neighbors);
          let min = this.ruleTypeMatching(c.min,neighbors);
          let max = this.ruleTypeMatching(c.max,neighbors);

          if (!(min <= target && target <= max)) {
            ok = false;
          }
        }
        if (ok) return rule.nextState;
      }
      return state.defaultState;
    }
    return id;
  }

  ruleTypeMatching(item, neighbors){
    if(item.type=='state'){
      return neighbors.filter((e) => e.value===item.value).length;
    }
    if(item.type=='number'){
      return item.value;
    }
    if(item.type=='param'){
      return neighbors.reduce((sum, e) => sum+this.getState(e.value).params[item.value], 0)
    }
  }
}

