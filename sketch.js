let angleY = 0;

let distortionSlider;
let speedSlider;
let sizeSlider;

const vertices = [
  [-1,-1,-1],
  [ 1,-1,-1],
  [ 1, 1,-1],
  [-1, 1,-1],
  [-1,-1, 1],
  [ 1,-1, 1],
  [ 1, 1, 1],
  [-1, 1, 1]
];

const edges = [
  [0,1],[1,2],[2,3],[3,0],
  [4,5],[5,6],[6,7],[7,4],
  [0,4],[1,5],[2,6],[3,7]
];

function setup() {

  createCanvas(windowWidth, windowHeight);

  // ----------------------------
  // スマホ用：大きなスライダー
  // ----------------------------

  distortionSlider =
    createSlider(0.4, 1.3, 0.72, 0.01);

  speedSlider =
    createSlider(0, 0.05, 0.012, 0.001);

  sizeSlider =
    createSlider(40, 180, 95, 1);

  // CSSで操作しやすくする
  let sliders = [
    distortionSlider,
    speedSlider,
    sizeSlider
  ];

  for (let s of sliders) {
    s.style("width", "55vw");
    s.style("height", "28px");
  }

  positionControls();
}


function positionControls() {

  // 画面下側にまとめる
  let x = 25;

  distortionSlider.position(
    x,
    height - 155
  );

  speedSlider.position(
    x,
    height - 105
  );

  sizeSlider.position(
    x,
    height - 55
  );
}


function draw() {

  background(0);

  angleY += speedSlider.value();

  let cx = width / 2;

  // 操作部分を除いた領域の中心
  let usableHeight = height - 180;

  let cy = usableHeight / 2;

  // 4つの像の配置距離
  let d =
    min(width, usableHeight) * 0.28;


  // ===================================
  // 上
  // ===================================

  drawCube(
    cx,
    cy - d,
    PI,
    angleY
  );


  // ===================================
  // 下
  // ===================================

  drawCube(
    cx,
    cy + d,
    0,
    angleY + PI
  );


  // ===================================
  // 左
  // ===================================

  drawCube(
    cx - d,
    cy,
    HALF_PI,
    angleY + HALF_PI
  );


  // ===================================
  // 右
  // ===================================

  drawCube(
    cx + d,
    cy,
    -HALF_PI,
    angleY - HALF_PI
  );


  // ===================================
  // 中央：ピラミッド設置位置
  // ===================================

  noFill();

  stroke(70);

  strokeWeight(2);

  let centerSize =
    min(width, usableHeight) * 0.12;

  rectMode(CENTER);

  rect(
    cx,
    cy,
    centerSize,
    centerSize
  );


  // ===================================
  // 操作用表示
  // ===================================

  noStroke();

  fill(255);

  textSize(16);

  textAlign(LEFT);

  text(
    "Distortion  " +
    distortionSlider.value().toFixed(2),
    25,
    height - 160
  );

  text(
    "Rotation speed  " +
    speedSlider.value().toFixed(3),
    25,
    height - 110
  );

  text(
    "Cube size  " +
    sizeSlider.value(),
    25,
    height - 60
  );
}


// ===================================================
// 立方体
// ===================================================

function drawCube(
  centerX,
  centerY,
  screenRotation,
  cubeRotation
) {

  push();

  translate(
    centerX,
    centerY
  );

  rotate(
    screenRotation
  );

  let projected = [];

  let distortion =
    distortionSlider.value();

  let scaleFactor =
    sizeSlider.value();


  for (let v of vertices) {

    let x = v[0];

    let y = v[1];

    let z = v[2];


    // ===================================
    // Y軸回転
    // ===================================

    let xr =
      x * cos(cubeRotation)
      +
      z * sin(cubeRotation);


    let zr =
      -x * sin(cubeRotation)
      +
      z * cos(cubeRotation);


    // ===================================
    // 上下方向の傾き
    // ===================================

    let tilt = -0.35;


    let yr =
      y * cos(tilt)
      -
      zr * sin(tilt);


    let zr2 =
      y * sin(tilt)
      +
      zr * cos(tilt);


    // ===================================
    // 透視投影
    // ===================================

    let cameraDistance = 5;


    let perspective =
      cameraDistance /
      (cameraDistance + zr2);


    let px =
      xr * perspective;


    let py =
      yr * perspective;


    // ===================================
    // ペッパーズゴースト用補正
    // ===================================

    py *= distortion;


    projected.push({

      x:
        px *
        scaleFactor,

      y:
        py *
        scaleFactor

    });
  }


  // ===================================
  // 太い発光部分
  // ===================================

  stroke(
    0,
    100,
    255,
    110
  );

  // 以前 9 → 16
  strokeWeight(16);

  drawEdges(projected);


  // ===================================
  // メインの線
  // ===================================

  stroke(
    120,
    230,
    255
  );

  // 以前 3 → 7
  strokeWeight(7);

  drawEdges(projected);


  // ===================================
  // 頂点
  // ===================================

  stroke(255);

  // 頂点も大きく
  strokeWeight(11);


  for (let p of projected) {

    point(
      p.x,
      p.y
    );
  }


  pop();
}


// ===================================================
// 辺を描画
// ===================================================

function drawEdges(p) {

  for (let e of edges) {

    let a =
      p[e[0]];

    let b =
      p[e[1]];


    line(
      a.x,
      a.y,
      b.x,
      b.y
    );
  }
}


// ===================================================
// スマホ画面サイズ変更
// ===================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  positionControls();
}