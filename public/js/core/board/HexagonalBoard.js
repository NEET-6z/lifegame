import { drawRegularPolygon } from "../../common/utils.js";
import Board from "./Board.js";

export class HexagonalBoard extends Board {
  constructor(defaultsize, defaultCells, lockedCells) {
    super(defaultsize, defaultCells, lockedCells);
    this.shape = "hexagon";
  }

  getNeighbors(x, y) {
    const neighbors = [];
    const directions =
      y % 2 === 0
        ? [
            [1, 0],
            [-1, 0],
            [-1, -1],
            [0, -1],
            [-1, 1],
            [0, 1],
          ]
        : [
            [1, 0],
            [-1, 0],
            [1, -1],
            [0, -1],
            [1, 1],
            [0, 1],
          ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      neighbors.push({ x: newX, y: newY, value: this.getCell(newX, newY) });
    }

    return neighbors;
  }

  getWsize(y) {
    return this.size;
  }

  getCellPosition(rect, clientX, clientY) {
    const posX = clientX - rect.left;
    const posY = clientY - rect.top;

    const hexRadius =
      (Math.min(rect.width, rect.height) / (this.size * 2 + 1) / Math.sqrt(3)) *
      2;
    const hexHeight = (hexRadius * 3) / 2;
    const hexWidth = Math.sqrt(3) * hexRadius;

    const b = (hexRadius * Math.sqrt(3)) / 2;

    const i = Math.floor(posY / hexHeight);
    const offsetX = i % 2 === 1 ? b : 0;
    const j = Math.floor((posX - offsetX) / hexWidth);

    // 近くの六角形の候補
    const candidates = [
      { i, j },
      { i: i - 1, j: j },
      { i: i - 1, j: j - 1 },
      { i: i - 1, j: j + 1 },
      { i: i + 1, j: j },
      { i: i + 1, j: j - 1 },
      { i: i + 1, j: j + 1 },
      { i, j: j - 1 },
      { i, j: j + 1 },
    ];

    // 中心との距離が最短のものを探す
    let closestHex = candidates[0];
    let minDistance = Infinity;

    for (const candidate of candidates) {
      const xCandidate =
        candidate.j * hexWidth + (candidate.i % 2 === 1 ? b : 0) + b;
      const yCandidate = candidate.i * hexHeight + hexRadius;
      const distance = Math.sqrt(
        Math.pow(posX - xCandidate, 2) + Math.pow(posY - yCandidate, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestHex = candidate;
      }
    }

    let x = closestHex.j;
    let y = closestHex.i;

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

    const hexRadius =
      (Math.min(canvas.width, canvas.height) /
        (this.size * 2 + 1) /
        Math.sqrt(3)) *
      2;
    const hexHeight = (hexRadius * 3) / 2;
    const hexWidth = Math.sqrt(3) * hexRadius;

    const b = (hexRadius * Math.sqrt(3)) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let y = i * hexHeight + hexRadius;
        let x = j * hexWidth + (i % 2 == 1) * b + b;

        const stateId = this.getCell(j, i);
        let state = stateManager.getState(stateId);

        if(!state){
          state = stateManager.getState(1);
          this.setCell(x,y,0);
        }

        const gridcolor = this.isCellLocked(x, y) ? this.lockedgridColor : this.gridColor;

        drawRegularPolygon(
          ctx,
          6,
          hexRadius,
          x,
          y,
          30,
          gridcolor,
          state.color,
          this.gridLineWidth
        );
      }
    }
  }
}
