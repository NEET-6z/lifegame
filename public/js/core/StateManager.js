
//状態を表す
export class State {
  constructor(
    id,
    name,
    color,
    canSelect = true,
    defaultState = 0,
    transitionRules = [],
    params = [0, 0, 0, 0, 0]
  ) {

    this.id = id;
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
  constructor(template) {
    this.states = {};
    this.nextStateId = 11;

    this.paramSlot = [1, 2, 3, 4, 5];
    this.initializeStates();


    if(template){
      this.setTemplate(template);
    }
    
  }

  initializeStates() {
    this.states = {};
    this.setState(new State(0, "Null", "#eee", false, 0, []));
  }

  setState(state) {
    const id = state.id;
    if (0 <= id && id <= 10) {
      this.states[id] = state;
      return true;
    }
    return false;
  }

  addState() {
    this.states[this.nextStateId] = new State(
      this.nextStateId,
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
        return { ...state };
      });
  }

  getParamSlot() {
    return this.paramSlot;
  }

  nextState(id, neighbors) {
    const state = this.getState(id);
    if (state) {
      for (let rule of state.transitionRules) {
        if(rule.operator=='and'){
          
          let ok = true;
          for (let c of rule.condition) {
            let target = this.ruleTypeMatching(c.target, neighbors);
            let min = this.ruleTypeMatching(c.min, neighbors);
            let max = this.ruleTypeMatching(c.max, neighbors);
            
            if (!(min <= target && target <= max)) {
              ok = false;
            }
          }
          if (ok) return rule.nextState;
        }
        
        if(rule.operator=='or'){
          let ok = false;
          for (let c of rule.condition) {
            let target = this.ruleTypeMatching(c.target, neighbors);
            let min = this.ruleTypeMatching(c.min, neighbors);
            let max = this.ruleTypeMatching(c.max, neighbors);
            
            if ((min <= target && target <= max)) {
              ok = true;
              break;
            }
          }
          if (ok) return rule.nextState;
        }
      }
      return state.defaultState;
    }
    return id;
  }

  ruleTypeMatching(item, neighbors) {
    if (item.type == "state") {
      return neighbors.filter((e) => e.value === item.value).length;
    }
    if (item.type == "number") {
      return item.value;
    }
    if (item.type == "param") {
      return neighbors.reduce(
        (sum, e) => sum + this.getState(e.value).params[item.value],
        0
      );
    }
  }

  setTemplate(tp){
    this.initializeStates();
    tp.forEach((s) => {
      this.setState(s);
    });
  }
}

