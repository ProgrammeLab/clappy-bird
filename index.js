(function () {
  let canvasInstance;
  let walls = [];
  let bird;

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
    let count = 5;
    // 墙与墙之间的间距
    let interval = 20;
    walls = new Array(count).fill(1).map((_, index) => {
      return new Wall({
        speed: 1,
        x: 0 + index * 100 + interval,
        y: 200,
        dx: 30,
        dy: 200,
        canvasContext: canvasInstance,
      });
    });
    notifyWallsUpdate();
    // setInterval(() => {
    //   notifyWallsUpdate();
    // }, 500);
  }
  function notifyWallsUpdate() {
    walls.forEach((w) => {
      w.move();
    });
  }
  function addKeyBoardUpListener() {
    document.addEventListener("keyup", (event) => {
      console.log(event);
      if (event.code === "Space") {
        canvasInstance.clearRect(bird.x, bird.y, bird.width, bird.height);
        bird.y -= 50;
      }
    });
  }
  init();
})();
