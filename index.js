(function () {
  /** canvas 2d 实例 */
  let canvasInstance;
  /** 墙体 */
  let walls = [];
  /** 操控的鸟 */
  let bird;
  /** 鸟的宽度 */
  const birdWidth = 30;
  /** 鸟的高度 */
  const birdHeight = 30;
  /** 鸟的 x 坐标 */
  const birdPostionX = 10;
  /** 分数 dom 元素 */
  let scoreEle;
  /** 分数 */
  let score = 0;
  /** 当前距离 鸟最近的墙，用于得分检测 */
  let preNearestWall;
  /** 每一道墙的宽度 */
  const WallWidth = 60;
  /** 墙与墙之间的间隔 */
  const interval = 140;
  /** animation frame Id */
  let animationFrameId;
  /** 小鸟单次跳跃的高度 */
  const birdJumpHeight = 80;

  /**
   * 初始化 canvas 对象，寻找 canvas dom 节点
   */
  function initCanvas() {
    const cvs = document.querySelector("#cvs");
    canvasInstance = cvs.getContext("2d");
    scoreEle = document.querySelector("#score");
  }

  /**
   * 初始化游戏
   */
  function init() {
    initCanvas();
    startAnimation();
    generateWalls();
    addKeyBoardUpListener();
    bird = new Bird(birdPostionX, 200, birdWidth, birdHeight);
  }

  /**
   * 开时无限调用帧动画
   */
  function startAnimation() {
    animationFrameId = window.requestAnimationFrame(() => {
      startAnimation();
      paint();
      detectScore();
      if (detectCollision()) {
        cancelAnimationFrame(animationFrameId);
        removeKeyup();
        // const confirm = window.confirm("Game Over");
        // if (confirm) {
        //   reStartGame();
        // }
      }
    });
  }

  /**
   * 每一帧的绘制操作
   */
  function paint() {
    notifyWallsUpdate();
    drawBird();
  }

  /**
   * 绘制 bird
   * @returns
   */
  function drawBird() {
    if (!bird) {
      return;
    }
    if (canvasInstance) {
      canvasInstance.clearRect(bird.x, bird.y, bird.width, bird.height);
      bird.y += 1;
      canvasInstance.fillRect(bird.x, bird.y, bird.width, bird.height);
      if (bird.y > 400) {
        bird.y = 200;
      }
    }
  }

  /**
   * 初始化墙体数组
   */
  function generateWalls() {
    // 墙与墙之间的间距
    const channelHeight = canvasInstance.canvas.height / 4;
    const count = Math.ceil(
      canvasInstance.canvas.width / (WallWidth + interval)
    );
    walls = new Array(count).fill(1).map((_, index) => {
      return new Wall({
        index: index,
        speed: 1,
        x: interval + (WallWidth + interval) * index,
        y: 200,
        dx: WallWidth,
        canvasContext: canvasInstance,
        channelHeight: channelHeight,
        interval,
      });
    });
    // 在 new 时传 walls 会获取到空数组，故用此方式
    walls.forEach((w) => {
      w.setWalls(walls);
    });
    notifyWallsUpdate();
  }

  /** 更新墙位置 */
  function notifyWallsUpdate() {
    walls.forEach((w) => {
      w.updateDraw();
    });
  }

  /** 得分检测 */
  function detectScore() {
    let nearestWall = walls?.[0];
    walls.forEach((w) => {
      if (w?.x + w?.dx <= nearestWall?.x + nearestWall?.dx) {
        nearestWall = w;
      }
    });
    const nearestX = nearestWall?.x + nearestWall?.dx;

    if (
      nearestX < birdPostionX &&
      nearestWall?.originalX !== preNearestWall?.originalX
    ) {
      preNearestWall = nearestWall;
      scoreEle.innerHTML = ++score;
    }
  }

  /**
   * 添加空格监听事件
   */
  function addKeyBoardUpListener() {
    document.addEventListener("keyup", throllteKeyHandler);
  }

  function removeKeyup() {
    document.removeEventListener("keyup", throllteKeyHandler);
  }

  const throllteKeyHandler = throttle(handleKeyup, true, 300);

  function handleKeyup(event) {
    if (event.code === "Space") {
      canvasInstance.clearRect(bird.x, bird.y, bird.width, bird.height);
      bird.y -= birdJumpHeight;
    }
  }

  /**
   * 碰撞检测
   */
  function detectCollision() {
    const birdRightX = bird.x + bird.width;
    const birdLeftX = bird.x;
    const birdTopY = bird.y;
    const birdBottomY = bird.y + bird.height;
    return walls.some((w) => {
      const wallRightX = w.x + w.dx;
      const wallLeftX = w.x;
      const topWallTopY = w.topY;
      const topWallBottomY = w.topY + w.topPartHeight;
      const bottomWallTopY = w.bottomY;
      const bottomWallBottomY = w.bottomY + w.bottomPartHeight;
      // 上半部分
      const isTopCollision =
        birdRightX >= wallLeftX && // 如果矩形1的右边界大于等于矩形2的左边界，
        birdLeftX <= wallRightX && //且矩形1的左边界小于等于矩形2的右边界，
        birdBottomY >= topWallTopY && //且矩形1的下边界大于等于矩形2的上边界
        birdTopY <= topWallBottomY; //且矩形1的上边界小于等于矩形2的下边界
      // 下半部分
      const isBottomCollision =
        birdRightX >= wallLeftX && // 如果矩形1的右边界大于等于矩形2的左边界，
        birdLeftX <= wallRightX && //且矩形1的左边界小于等于矩形2的右边界，
        birdBottomY >= bottomWallTopY && //且矩形1的下边界大于等于矩形2的上边界
        birdTopY <= bottomWallBottomY; //且矩形1的上边界小于等于矩形2的下边界
      return isBottomCollision || isTopCollision;
    });
  }

  /** 重新开始游戏 */
  function reStartGame() {
    score = 0;
    scoreEle.innerHTML = score;
    if (animationFrameId) {
      canvasInstance.clearRect(0, 0, 600, 400);
      cancelAnimationFrame(animationFrameId);
      bird = new Bird(birdPostionX, 200, birdWidth, birdHeight);
      generateWalls();
      startAnimation();
    }
  }
  init();
})();
