class Wall {
  x;
  y;
  dx;
  dy;
  originalX;
  canvasContext;
  constructor(config) {
    const { x, y, dx, dy, speed, canvasContext } = config;
    this.speed = speed;
    this.originalX = x;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.canvasContext = canvasContext;
  }

  move() {
    let clearRectStartX = this.x + this.dx - this.speed;
    let clearRectEndX = this.x + this.dx;
    let clearRectStartY = this.y;
    let clearReactEndY = this.y + this.dy;

    this.x = this.x - this.speed;
    this.updateDraw({
      clearRectStartX,
      clearRectEndX,
      clearRectStartY,
      clearReactEndY,
    });
  }
  updateDraw(clearRectConfig, drawRectConfig) {
    const { clearRectStartX, clearRectEndX, clearRectStartY, clearReactEndY } =
      clearRectConfig;
    this.canvasContext.clearRect(
      clearRectStartX,
      clearRectStartY,
      this.speed,
      this.dy
    );
    this.canvasContext.fillRect(this.x - this.speed, this.y, this.dx, this.dy);
    if (clearRectEndX <= 0) {
      this.x = this.canvasContext?.canvas?.width;
    }
  }
}
