let elephants = [];
let raindrops = [];
let puddles = [];
let thunder = 0;
let beat = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 4; i++) {
    elephants.push(new Elephant(
      map(i, 0, 3, width * 0.15, width * 0.85),
      height * 0.65,
      random(0.6, 1.0)
    ));
  }
  for (let i = 0; i < 300; i++) {
    raindrops.push(new Raindrop());
  }
}

function draw() {
  beat += 0.03;

  drawSky();

  if (random() < 0.003) thunder = 1;
  if (thunder > 0) {
    background(255, 255, 240, thunder * 80);
    thunder -= 0.02;
  }

  drawGround();

  for (let p of puddles) {
    p.display();
    p.life--;
  }
  puddles = puddles.filter(p => p.life > 0);

  for (let e of elephants) {
    e.update();
    e.display();
  }

  for (let r of raindrops) {
    r.update();
    r.display();
  }

  drawMusicNotes();
}

function drawSky() {
  for (let y = 0; y < height * 0.7; y++) {
    let t = map(y, 0, height * 0.7, 0, 1);
    let r = lerp(20, 40, t);
    let g = lerp(20, 45, t);
    let b = lerp(50, 70, t);
    stroke(r, g, b);
    line(0, y, width, y);
  }

  noStroke();
  for (let i = 0; i < 5; i++) {
    let cx = map(i, 0, 4, width * 0.1, width * 0.9) + sin(frameCount * 0.003 + i) * 30;
    let cy = 60 + i * 25;
    fill(35, 35, 55, 180);
    ellipse(cx, cy, 200 + i * 20, 50 + i * 5);
    ellipse(cx + 60, cy - 15, 160, 45);
    ellipse(cx - 50, cy - 10, 140, 40);
  }
}

function drawGround() {
  noStroke();
  for (let y = height * 0.7; y < height; y++) {
    let t = map(y, height * 0.7, height, 0, 1);
    fill(lerp(30, 20, t), lerp(60, 40, t), lerp(30, 20, t));
    rect(0, y, width, 1);
  }

  fill(40, 70, 90, 60);
  for (let i = 0; i < 8; i++) {
    let px = map(i, 0, 7, -50, width + 50);
    let py = height * 0.72 + sin(frameCount * 0.02 + i) * 2;
    ellipse(px, py, 120 + sin(frameCount * 0.03 + i) * 10, 8);
  }
}

function drawMusicNotes() {
  fill(255, 220, 100, 180);
  noStroke();
  textSize(20);
  for (let i = 0; i < 6; i++) {
    let nx = (width * 0.2 + i * width * 0.12 + frameCount * 0.5) % (width + 40) - 20;
    let ny = height * 0.35 + sin(frameCount * 0.04 + i * 2) * 40;
    let a = map(sin(frameCount * 0.05 + i), -1, 1, 80, 220);
    fill(255, 220, 100, a);
    text(['♪', '♫', '♬', '♩'][i % 4], nx, ny);
  }
}

class Elephant {
  constructor(x, y, s) {
    this.baseX = x;
    this.baseY = y;
    this.s = s;
    this.phase = random(TWO_PI);
    this.color = [
      random(100, 130),
      random(100, 130),
      random(130, 160)
    ];
  }

  update() {
    this.danceX = sin(beat * 2 + this.phase) * 20;
    this.danceY = abs(sin(beat * 4 + this.phase)) * -25;
    this.bodyTilt = sin(beat * 2 + this.phase) * 0.1;
    this.trunkSwing = sin(beat * 3 + this.phase) * 0.6;
    this.earFlap = sin(beat * 4 + this.phase) * 0.2;
    this.legLift = abs(sin(beat * 4 + this.phase));
  }

  display() {
    push();
    translate(this.baseX + this.danceX, this.baseY + this.danceY);
    scale(this.s);
    rotate(this.bodyTilt);

    let [cr, cg, cb] = this.color;

    // legs
    this.drawLeg(-35, 40, sin(beat * 4 + this.phase));
    this.drawLeg(-15, 40, sin(beat * 4 + this.phase + PI));
    this.drawLeg(15, 40, sin(beat * 4 + this.phase + PI));
    this.drawLeg(35, 40, sin(beat * 4 + this.phase));

    // body
    fill(cr, cg, cb);
    stroke(cr - 20, cg - 20, cb - 20);
    strokeWeight(1.5);
    ellipse(0, 0, 110, 80);

    // head
    push();
    translate(55, -25);
    fill(cr + 5, cg + 5, cb + 5);
    ellipse(0, 0, 55, 50);

    // ears
    push();
    translate(-15, -5);
    rotate(this.earFlap);
    fill(cr - 10, cg - 10, cb + 10);
    ellipse(-15, 0, 30, 40);
    pop();

    push();
    translate(10, -5);
    rotate(-this.earFlap);
    fill(cr - 10, cg - 10, cb + 10);
    ellipse(10, 0, 25, 35);
    pop();

    // eyes
    fill(255);
    noStroke();
    ellipse(8, -8, 12, 12);
    fill(30);
    ellipse(9, -8, 6, 7);
    fill(255);
    ellipse(10, -9, 2, 2);

    // trunk
    push();
    translate(25, 5);
    rotate(this.trunkSwing);
    noFill();
    stroke(cr, cg, cb);
    strokeWeight(10);
    beginShape();
    vertex(0, 0);
    bezierVertex(15, 10, 20, 25, 10 + sin(beat * 5 + this.phase) * 8, 40);
    endShape();
    strokeWeight(1.5);
    pop();

    // smile
    noFill();
    stroke(cr - 30, cg - 30, cb - 30);
    strokeWeight(1.5);
    arc(12, 2, 12, 8, 0, PI);

    pop();

    // tail
    push();
    translate(-55, -10);
    noFill();
    stroke(cr - 10, cg - 10, cb - 10);
    strokeWeight(3);
    let tailSwing = sin(beat * 5 + this.phase) * 0.5;
    beginShape();
    vertex(0, 0);
    bezierVertex(-15, -10, -20 + sin(beat * 3) * 5, -20, -15 + tailSwing * 10, -30);
    endShape();
    strokeWeight(1);
    fill(cr - 10, cg - 10, cb - 10);
    ellipse(-15 + tailSwing * 10, -32, 8, 6);
    pop();

    pop();
  }

  drawLeg(x, y, phase) {
    let [cr, cg, cb] = this.color;
    let lift = max(0, phase) * 12;
    push();
    translate(x, y);
    fill(cr - 15, cg - 15, cb - 15);
    stroke(cr - 30, cg - 30, cb - 30);
    strokeWeight(1);
    rect(-8, -lift, 16, 35 - lift + lift * 0.3, 5);

    if (lift < 2) {
      noStroke();
      fill(40, 70, 90, 40);
      ellipse(0, 36, 20, 5);
    }
    pop();
  }
}

class Raindrop {
  constructor() {
    this.reset();
    this.y = random(-height, height);
  }

  reset() {
    this.x = random(-50, width + 50);
    this.y = random(-100, -10);
    this.speed = random(8, 15);
    this.len = random(10, 25);
    this.alpha = random(80, 180);
  }

  update() {
    this.y += this.speed;
    this.x -= 1.5;
    if (this.y > height * 0.72) {
      if (random() < 0.3) {
        puddles.push(new Splash(this.x, height * 0.72));
      }
      this.reset();
    }
  }

  display() {
    stroke(150, 180, 220, this.alpha);
    strokeWeight(1.5);
    line(this.x, this.y, this.x - 1.5, this.y + this.len);
  }
}

class Splash {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 15;
    this.maxLife = 15;
  }

  display() {
    let t = 1 - this.life / this.maxLife;
    noFill();
    stroke(150, 180, 220, this.life * 12);
    strokeWeight(1);
    let r = t * 15;
    ellipse(this.x, this.y, r, r * 0.3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let i = 0; i < elephants.length; i++) {
    elephants[i].baseX = map(i, 0, elephants.length - 1, width * 0.15, width * 0.85);
    elephants[i].baseY = height * 0.65;
  }
}
