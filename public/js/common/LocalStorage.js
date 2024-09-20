//アップデートしたときにばぐらないように

class Type {
  static isNumber(value) {
    return typeof value === "number";
  }

  static isString(value) {
    return typeof value === "string";
  }

  static isBoolean(value) {
    return typeof value === "boolean";
  }

  static isArray(arr, itemType) {
    return Array.isArray(arr) && arr.every((item) => itemType(item));
  }

  static isObject(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj);
  }
}

class LSHelper {
  static name = "default";
  static default = "default";

  static get(param) {
    if (localStorage.getItem(this.getKeyName(param)) === null) {
      this.set(JSON.stringify(this.default), param);
    }

    const datastr = localStorage.getItem(this.getKeyName(param));

    try {
      const data = JSON.parse(datastr);

      if (!this.checkType(data)) throw new Error();
      if (!this.checkValue(data)) throw new Error();

      return data;
    } catch {
      this.set(JSON.stringify(this.default));
      return null;
    }
  }

  static set(data, param) {
    if (this.checkType(data) && this.checkValue(data)) {
      localStorage.setItem(this.getKeyName(param), JSON.stringify(data));
    }
  }

  static remove(param){
    localStorage.removeItem(this.getKeyName(param))
  }

  static getKeyName(param) {
    return this.name;
  }

  static checkType(data) {
    return true;
  }

  static checkValue(data) {
    return true;
  }
}

export class LSGameData extends LSHelper {
  static name = "gameData";
  static default = null;

  static checkType(data) {
    return (
      Type.isObject(data) &&
      Type.isObject(data.gameManager) &&
      Type.isNumber(data.gameManager.speed) &&
      Type.isNumber(data.gameManager.selectedStateId) &&
      Type.isObject(data.board) &&
      Type.isNumber(data.board.size) &&
      Type.isArray(data.board.cells, (row) =>
        Type.isArray(row, Type.isNumber)
      ) &&
      Type.isObject(data.stateManager) &&
      Type.isObject(data.stateManager.states) &&
      Object.values(data.stateManager.states).every(
        (state) =>
          Type.isObject(state) &&
          Type.isString(state.name) &&
          Type.isString(state.color) &&
          Type.isBoolean(state.canSelect) &&
          (Type.isNumber(state.defaultState) ||
            Type.isArray(state.defaultState, Type.isNumber)) &&
          Type.isArray(
            state.transitionRules,
            (rule) =>
              Type.isObject(rule) &&
              Type.isArray(
                rule.condition,
                (cond) =>
                  Type.isObject(cond) &&
                  Type.isNumber(cond.state) &&
                  Type.isNumber(cond.min) &&
                  Type.isNumber(cond.max)
              ) &&
              Type.isNumber(rule.nextState)
          )
      ) &&
      Type.isNumber(data.stateManager.nextStateId)
    );
  }

  static getKeyName(param) {
    return this.name + "_" + param;
  }
}

export class LSStageProgress extends LSHelper {
  static name = "stageProgress";
  static default = { a: 0, b: 0, c: 0};

  static checkType(data) {
    return (
      Type.isObject(data) &&
      Type.isNumber(data.a) &&
      Type.isNumber(data.b) &&
      Type.isNumber(data.c)
    );
  }
}

