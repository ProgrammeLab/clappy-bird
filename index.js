(function () {
  let canvasInstance;
  let walls = [];
  let bird;
  const WallWidth = 60;
  const interval = 120;

  function initCanvas() {
    const cvs = document.querySelector("#cvs");
    canvasInstance = cvs.getContext("2d");
  }
  function init() {
    initCanvas();
    startAnimation();
    generateWalls();
    addKeyBoardUpListener();
    bird = new Bird(10, 200, 30, 30);
    // canvasInstance.fillRect(0, 100, 100, 100);
    // canvasInstance.clearRect(0, 100, 50, 50);
  }
  function startAnimation() {
    window.requestAnimationFrame(() => {
      startAnimation();
      paint();
    });
  }
  function paint() {
    notifyWallsUpdate();
    drawBird();
  }
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
        x: (WallWidth + interval) * index,
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
  function notifyWallsUpdate() {
    walls.forEach((w) => {
      w.updateDraw();
    });
  }
  function addKeyBoardUpListener() {
    document.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        canvasInstance.clearRect(bird.x, bird.y, bird.width, bird.height);
        bird.y -= 40;
      }
    });
  }
  init();
})();
