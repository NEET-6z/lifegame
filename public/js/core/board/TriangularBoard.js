import { drawRegularPolygon } from "../../common/utils.js";
import Board from "./Board.js";


export class TriangularBoard extends Board {
  constructor(defaultsize, defaultCells, lockedCells) {
    super(defaultsize, defaultCells, lockedCells);
    this.shape = "triangle";
  }

  getNeighbors(x, y) {
    const neighbors = [];
    const directions =
      x % 2 === 0
        ? [
            [-2, 0],
            [-1, 0],
            [1, 0],
            [2, 0],

            [-1, 1],
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],

            [-2, -1],
            [-1, -1],
            [-0, -1],
          ]
        : [

            [-2, 0],
            [-1, 0],
            [1, 0],
            [2, 0],
            
            [0, 1],
            [1, 1],
            [2, 1],
            
            [-3, -1],
            [-2, -1],
            [-1, -1],
            [0, -1],
            [1, -1],
          ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      neighbors.push({ y: newY, x: newX, value: this.getCell(newX, newY) });
    }

    return neighbors;
  }

  getWsize(y) {
    return y * 2 + 1;
  }

  //長方形で区切ったあと右か左か
  getCellPosition(rect, clientX, clientY) {
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;

    const cellSize = Math.min(rect.width, rect.height) / this.size;
    const triangleHeight = (cellSize * Math.sqrt(3)) / 2;
    const triangleWidth = cellSize;

    const y = Math.floor(relativeY / triangleHeight);

    const offsetX =
      relativeX - (rect.width / 2 - ((y + 1) * triangleWidth) / 2);
    const offsetY = relativeY - y * triangleHeight;
    const colIndex = Math.floor(offsetX / (triangleWidth / 2));
    const offsetXWithinTriangle = offsetX - colIndex * (triangleWidth / 2);

    let x;
    if (colIndex % 2 === 1) {
      if (offsetXWithinTriangle * Math.sqrt(3) < offsetY) {
        x = colIndex - 1;
      } else {
        x = colIndex;
      }
    } else {
      if (triangleHeight - offsetXWithinTriangle * Math.sqrt(3) < offsetY) {
        x = colIndex;
      } else {
        x = colIndex - 1;
      }
    }

    if (this.isValidCoordinate(x, y)) {
      return { x: x, y: y };
    }

    return { x: -1, y: -1 };
  }

  render(canvas, stateManager, isPlaying) {
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const gridColor = "#555555";
    const gridLineWidth = 1;

    canvas.width = rect.width;
    canvas.height = rect.height;

    const cellSize = Math.min(canvas.width, canvas.height) / this.size;
    const cellHeight = (cellSize * Math.sqrt(3)) / 2;
    const cellWidth = cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x <= y * 2; x++) {
        const stateId = this.getCell(x, y);
        let state = stateManager.getState(stateId);

        if(!state){
          state = stateManager.getState(0);
          this.setCell(x,y,0);
        }

        const xPos =
          (x * cellWidth) / 2 + (canvas.width / 2 - (y * cellWidth) / 2);
        const yPos = y * cellHeight;

        const angle = x % 2 === 0 ? 30 : 210;
        const offset = x % 2 === 0 ? (cellHeight / 3) * 2 : cellHeight / 3;

        ctx.fillStyle = state.color || "#FFFFFF";

        const gridcolor = this.isCellLocked(x,y)? this.lockedgridColor : this.gridColor;

        drawRegularPolygon(
          ctx,
          3,
          cellSize / Math.sqrt(3),
          xPos,
          yPos + offset,
          angle,
          gridcolor,
          state.color || "#FFFFFF",
          this.gridLineWidth
        );
      }
    }
  }
}
