class Wall {
  x;
  y;
  dx;
  dy;
  originalX;
  canvasContext;
  constructor(config) {
    const {
      index,
      x,
      y,
      dx,
      dy,
      speed,
      channelHeight,
      walls,
      interval,
      canvasContext,
    } = config;
    this.speed = speed;
    this.originalX = x;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.channelHeight = channelHeight;
    this.canvasContext = canvasContext;
    this.index = index;
    this.interval = interval;
    this.generateRandomHeightWall();
  }

  setWalls(walls) {
    this.walls = walls;
  }

  generateRandomHeightWall() {
    // canvas 容器宽高
    let canvasHeight = this.canvasContext.canvas.height;
    // 最小高度为 容器的 1/4
    let minHeght = canvasHeight / 4;
    // 最大高度为 容器的3/4
    let maxHeight = (canvasHeight * 2) / 4;
    // 实际高度
    let topHeight = Math.random() * (maxHeight - minHeght) + minHeght;
    let topPartHeight = parseInt(topHeight);

    // 上半部分墙
    this.topX = this.x;
    this.topY = 0;
    this.topPartHeight = topPartHeight;
    // 下半部分墙
    this.bottomX = this.x;
    this.bottomY = topPartHeight + this.channelHeight;
    this.bottomPartHeight = canvasHeight - topPartHeight - this.channelHeight;
  }

  move() {
    this.x -= this.speed;
    this.topX = this.x;
    this.bottomX = this.x;
    // 循环渲染,重新生成高度
    // TODO: 补偿距离
    if (this.x + this.dx <= 0) {
      const preWall =
        this.index - 1 < 0
          ? this.walls[this.walls.length - 1]
          : this.walls[this.index - 1];
      const distanceToEnd =
        this.canvasContext.canvas.width - preWall.x - preWall.dx;
      const offscreenX =
        this.interval - distanceToEnd + this.canvasContext.canvas.width;
      this.x = offscreenX;

      this.generateRandomHeightWall();
    }
  }
  updateDraw() {
    // clean 之前渲染的
    this.canvasContext.clearRect(
      this.topX,
      this.topY,
      this.dx,
      this.topPartHeight
    );
    this.canvasContext.clearRect(
      this.bottomX,
      this.bottomY,
      this.dx,
      this.bottomPartHeight
    );
    // 移动 x 坐标
    this.move();
    // 绘制上半部分
    this.canvasContext.fillRect(
      this.topX,
      this.topY,
      this.dx,
      this.topPartHeight
    );
    // 绘制下半部分
    this.canvasContext.fillRect(
      this.bottomX,
      this.bottomY,
      this.dx,
      this.bottomPartHeight
    );
  }
}
