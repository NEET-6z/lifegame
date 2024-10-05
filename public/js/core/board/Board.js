

//ボードの状態と描画
export default class Board {
  constructor(defaultsize, defaultCells, lockedCells) {
    this.size = defaultsize || 20;
    this.defaultCells = defaultCells || undefined;
    this.lockedCells = lockedCells || undefined;
    this.historyCells = [this.generateCells(1)];
    this.startCells = undefined;
    this.cells = undefined;

    this.initialize();


    this.gridColor = "#555555";
    this.lockedgridColor = "red";
    this.gridLineWidth = 1;

  }
  
  // 初期化する
  initialize(history) {
    
    
    if(this.defaultCells){
      this.cells = JSON.parse(JSON.stringify(this.defaultCells));
    }
    else{
      this.cells = this.generateCells(1);
    }
    
    if(history){
      this.historyCells.push(JSON.parse(JSON.stringify(this.cells)))
    }
    else{ 
      this.historyCells = [JSON.parse(JSON.stringify(this.cells))];
    }
  }

  isCellLocked(x, y) {
    if (this.lockedCells && this.isValidCoordinate(x,y)) {
      return this.lockedCells[y][x];
    }
    return 0;
  }

  generateCells(value) {
    const cells = [];
    for (let y = 0; y < this.size; y++) {
      const row = [];
      for (let x = 0; x < this.getWsize(y); x++) {
        row.push(value);
      }
      cells.push(row);
    }
    return cells;
  }

  setCell(x, y, v) {
    if (this.isValidCoordinate(x, y)) {
      if (this.isCellLocked(x,y) === 1) {
        console.log("locked cell");
      } else {
        this.cells[y][x] = v;
      }
    }
  }

  nextGeneration(stateManager) {
    const newCells = [];
    for (let y = 0; y < this.size; y++) {
      const row = [];
      for (let x = 0; x < this.getWsize(y); x++) {
        const neighbors = this.getNeighbors(x, y);
        const nextcell = stateManager.nextState(this.cells[y][x], neighbors);
        row.push(nextcell);
      }
      newCells.push(row);
    }


    this.cells = newCells;
  }

  getCell(x, y) {
    if (this.isValidCoordinate(x, y)) {
      return this.cells[y][x];
    }
    return 0;
  }

  getValueCount(value){
    let count = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.getWsize(y); x++) {
        if(this.getCell(x,y)===value) count++;
      }
    }
    return count;
  }

  
  
  random(allState){
    const c = allState.length;
    if(c===0) return;
    
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.getWsize(y); x++) {
        const stateid = allState[Math.floor(Math.random() * c)].id;
        this.setCell(x,y,stateid);
      }
    }
  }
  
  isValidCoordinate(x, y) {
    return 0 <= y && y < this.size && 0 <= x && x < this.getWsize(y);
  }

  resize(newSize) {
    this.size = newSize;
    this.initialize();
  }
  
  //近傍のセルをを取得
  getNeighbors(x, y) {
    throw new Error("getNeighbors must be overridden in a subclass");
  }
  
  // 座標からセルの添字を特定
  getCellPosition(rect, clientX, clientY) {
    throw new Error("getCellPosition must be overridden in a subclass");
  }
  
  getWsize(y) {
    throw new Error("getWsize must be overridden in a subclass");
  }

  render(canvas, stateManager, isPlaying) {
    throw new Error("render must be overridden in a subclass");
  }
}
