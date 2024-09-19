class Bird {
  x;
  y;
  width;
  height;
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  move(nextX, nextY) {
    this.x = nextX;
    this.y = nextY;
  }
}
