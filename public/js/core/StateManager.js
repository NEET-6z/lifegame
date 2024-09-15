export class State {
  constructor(name, color, canSelect=true, defaultState = 0, transitionRules = []) {
    this.name = name;
    this.color = color;
    this.canSelect = canSelect;
    this.defaultState = defaultState;
    this.transitionRules = transitionRules;
  }

  addTransitionRule(rule) {
    this.transitionRules.push(rule);
  }
}

export class StateManager {
  constructor() {
    this.states = {};
    this.nextStateId = 11;

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
              state: 2,
              min: 3,
              max: 3,
            },
          ],
          nextState: 2,
        },
      ])
    );
    this.setState(
      2,
      new State("Alive", "black", true, 1, [
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

  nextState(id, neighbors) {
    const state = this.getState(id);
    if (state) {
      for (let rule of state.transitionRules) {
        let ok = true;
        for (let c of rule.condition) {
          const cnt = neighbors.filter((e) => e.value === c.state).length;

          let l = c.min;
          if (c.min < 0) {
            l = neighbors.filter((e) => e.value === -c.min).length;
          }
          let r = c.max;
          if (c.max < 0) {
            r = neighbors.filter((e) => e.value === -c.max).length;
          }
          if (!(l <= cnt && cnt <= r)) {
            ok = false;
          }
        }
        if (ok) return rule.nextState;
      }
      return state.defaultState;
    }
    return id;
  }
}
