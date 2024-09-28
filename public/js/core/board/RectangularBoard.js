import { drawRegularPolygon } from "../../common/utils.js";
import Board from "./Board.js";


export class RectangularBoard extends Board {
  constructor(defaultsize, defaultCells, lockedCells) {
    super(defaultsize, defaultCells, lockedCells);
    this.shape = "rectangle";
  
  }

  getNeighbors(x, y) {
    const neighbors = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      neighbors.push({ y: newY, x: newX, value: this.getCell(newX, newY) });
    }

    return neighbors;
  }

  getWsize(y) {
    return this.size;
  }

  getCellPosition(rect, clientX, clientY) {
    const cellWidth = rect.width / this.size;
    const cellHeight = rect.height / this.size;
    const x = Math.floor((clientX - rect.left) / cellWidth);
    const y = Math.floor((clientY - rect.top) / cellHeight);

    if (this.isValidCoordinate(x, y)) {
      return { x, y };
    }
    return { x: -1, y: -1 };
  }

  render(canvas, stateManager, isPlaying) {
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    

    canvas.width = rect.width;
    canvas.height = rect.height;

    const cellSize = Math.min(canvas.width, canvas.height) / this.size;
    const halfCellSize = cellSize / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const stateId = this.getCell(x, y);
        let state = stateManager.getState(stateId); 
        
        if(!state){
          state = stateManager.getState(1);
          this.setCell(x,y,0);
        }

        const xPos = x * cellSize + halfCellSize;
        const yPos = y * cellSize + halfCellSize;

        const gridcolor = this.isCellLocked(x,y)? this.lockedgridColor : this.gridColor;
        
        drawRegularPolygon(
          ctx,
          4,
          cellSize / Math.sqrt(2),
          xPos,
          yPos,
          45,
          gridcolor,
          state.color,
          this.gridLineWidth
        );
      }
    }

    
  }
}
