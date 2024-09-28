class Wall {
  /** 当前绘制在 canvas 中的 x 坐标 */
  x;
  /** 宽度 */
  dx;
  /** 第一次渲染时的 x 坐标 */
  originalX;
  /** 当前的 canvas context 对象，用于绘制操作 */
  canvasContext;
  /** 每一帧移动的距离 */
  speed;
  /** 当前墙体在所有墙体中的下标 */
  index;
  /** 每一道墙的安全通道高度 */
  channelHeight;
  /** 墙与墙之间的间隔 */
  interval;
  /** 上半墙体开始绘制的 x 坐标 */
  topX;
  /** 上半墙体开始绘制的 y 坐标 */
  topY;
  /** 上半墙体的高度 */
  topPartHeight;
  /** 下半墙体开始绘制的 x 坐标 */
  bottomX;
  /** 下半墙体开始绘制的 y 坐标 */
  bottomY;
  /** 下半墙体的高度 */
  bottomPartHeight;
  constructor(config) {
    const { index, x, dx, speed, channelHeight, interval, canvasContext } =
      config;
    this.speed = speed;
    this.originalX = x;
    this.x = x;
    this.dx = dx;
    this.channelHeight = channelHeight;
    this.canvasContext = canvasContext;
    this.index = index;
    this.interval = interval;
    this.generateRandomHeightWall();
  }

  setWalls(walls) {
    this.walls = walls;
  }

  /**
   * 在移动到可视区域外时，更新墙的上下部分高度并移动到最后形成循环移动
   */
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

  /**
   * 移动墙体，改变 x、topX、bottomX 坐标
   */
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

  /**
   * 更新墙体的绘制，即绘制下一帧墙体，包含如下步骤
   * 1. 清除当前绘制的部分
   * 2. 移动墙体，改变 x 坐标
   * 3. 绘制移动后的墙体（上下部分）
   */
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
