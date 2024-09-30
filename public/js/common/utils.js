//二次元配列初期化
export function Array2(rows, cols, initialValue = null) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => initialValue)
  );
}

//正多角形を描画
export function drawRegularPolygon(
  ctx,
  sides,
  sideLength,
  startX,
  startY,
  initialAngle,
  strokeStyle = "black",
  fillStyle = "white",
  lineWidth = 1
) {
  if (sides < 3) {
    console.error("Polygon must have at least 3 sides.");
    return;
  }
  // スタイルを設定
  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = fillStyle;
  ctx.lineWidth = lineWidth;

  const angleStep = (2 * Math.PI) / sides;
  const startAngle = initialAngle * (Math.PI / 180);

  const points = [];

  sideLength -= lineWidth;

  for (let i = 0; i < sides; i++) {
    const angle = startAngle + i * angleStep;
    const x = startX + sideLength * Math.cos(angle);
    const y = startY + sideLength * Math.sin(angle);

    points.push({ x, y });
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}


// 簡易queue
export class Queue {
  constructor() {
    this.map = new Map();
    this.head = 0;
    this.tail = 0;
  }

  push(value) {
    this.map.set(this.tail, value);
    this.tail++;
  }

  pop() {
    if (this.head === this.tail) {
      return undefined;
    }
    const value = this.map.get(this.head);
    this.map.delete(this.head);
    this.head++;
    return value;
  }

  size() {
    return this.tail - this.head;
  }
}


