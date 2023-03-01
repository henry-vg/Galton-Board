const numChannels = 10,
  numBalls = 1000,
  margin = 100;

let channelSize,
  nailSize,
  ballSize,
  nailGap,
  angle,
  balls = [],
  ys = [],
  channels,
  vInterval;

function setup() {
  createCanvas(windowWidth, windowHeight);

  console.log(`${pow((numChannels + 1), 2) + numBalls} iterations per frame.`);

  channelSize = [(width - (2 * margin)) / (numChannels), height / 3];
  nailSize = channelSize[0] / 4;
  ballSize = nailSize / 2;
  nailGap = (height - channelSize[1] - nailSize * (numChannels + 1) - margin) / (numChannels + 1);
  vInterval = [nailGap / 10, nailGap / 1.5];
  angle = atan2(channelSize[0] / 2, nailGap + nailSize);
  channels = new Array(numChannels).fill(0);

  for (let i = 0; i < numChannels + 1; i++) {
    ys.push(height - channelSize[1] - nailGap * (i + 1) - nailSize / 2 - (nailSize) * i);
  }

  createBalls();
}

function draw() {
  background(255);

  if (balls.length == 0) {
    done = true;
    noLoop();
    console.log('Done.');
  }

  board();

  ballAnimation();
}

function board() {
  for (let i = 0; i < numChannels + 1; i++) {
    const weightRatio = 0.03;
    noFill();
    stroke(0);
    strokeWeight(channelSize[0] * weightRatio);
    const x0 = width / 2 - (numChannels * channelSize[0]) / 2 + i * channelSize[0],
      y0 = height - channelSize[1];
    if (i <= numChannels) {
      line(x0, y0, x0, y0 + channelSize[1]);
      noStroke();
      fill(0, 120);
      if (i < numChannels) {
        rect(x0, height, channelSize[0], -map(channels[i], 0, max(channels), 0, channelSize[1]));
      }
    }

    for (let j = 0; j < numChannels + 1; j++) {
      noFill();
      stroke(0);
      strokeWeight(channelSize[0] * weightRatio);
      const y1 = y0 - nailGap * (j + 1) - nailSize / 2 - (nailSize) * j;
      if (j % 2 == 0) {
        circle(x0, y1, nailSize);
      }
      else if (i != numChannels) {
        circle(x0 + channelSize[0] / 2, y1, nailSize);
      }
    }
  }
}

function ballObject() {
  this.x = width / 2;
  this.y = margin - ballSize;
  this.a = 0;
  this.v = random(vInterval[0], vInterval[1]);
  this.row = numChannels;
  this.c = 0;
  this.randomize = function () {
    this.a = random([angle, -angle]);
  }
  this.yCheck = function () {
    const column = floor((this.x - (width / 2 - (numChannels * channelSize[0]) / 2)) / channelSize[0]);
    if (this.y >= ys[this.row] && this.row == 0) {
      if (column <= 0) {
        this.a = angle;
      }
      else if (column >= numChannels - 1) {
        this.a = -angle;
      }
      else {
        this.randomize();
      }
      this.row--;
    }
    else if (this.y >= ys[this.row] && this.row > 0) {
      this.randomize();
      this.row--;
    }
    else if (this.y >= height - channelSize[1]) {
      balls.splice(balls.indexOf(this), 1);
      channels[column]++;
    }
  }
  this.show = function () {
    noStroke();
    fill(0, 100);
    circle(this.x, this.y, ballSize);
  }
}

function createBalls() {
  for (let i = 0; i < numBalls; i++) {
    balls.push(new ballObject());
  }
}

function ballAnimation() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].v * sin(balls[i].a);
    balls[i].y += balls[i].v * cos(balls[i].a);
    balls[i].show();
    balls[i].yCheck();
  }
}