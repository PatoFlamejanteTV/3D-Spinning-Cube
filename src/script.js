const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const size = 100;
const points = [
  [-size, -size, size],
  [size, -size, size],
  [size, size, size],
  [-size, size, size],
  [-size, -size, -size],
  [size, -size, -size],
  [size, size, -size],
  [-size, size, -size]
];
const edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7]
];
const angle = 0.01;
let x = 0;
let y = 0;
let z = 0;

function project(point) {
  const x = point[0];
  const y = point[1];
  const z = point[2];
  const perspective = 500;
  return [
    (x * perspective) / (z + perspective),
    (y * perspective) / (z + perspective)
  ];
}

function drawLine(p1, p2) {
  const [x1, y1] = project(p1);
  const [x2, y2] = project(p2);
  ctx.beginPath();
  ctx.moveTo(x1 + width / 2, y1 + height / 2);
  ctx.lineTo(x2 + width / 2, y2 + height / 2);
  ctx.stroke();
}

function rotateX(point) {
  const y = point[1];
  const z = point[2];
  return [
    point[0],
    y * Math.cos(x) - z * Math.sin(x),
    y * Math.sin(x) + z * Math.cos(x)
  ];
}

function rotateY(point) {
  const x = point[0];
  const z = point[2];
  return [
    x * Math.cos(y) + z * Math.sin(y),
    point[1],
    -x * Math.sin(y) + z * Math.cos(y)
  ];
}

function rotateZ(point) {
  const x = point[0];
  const y = point[1];
  return [
    x * Math.cos(z) - y * Math.sin(z),
    x * Math.sin(z) + y * Math.cos(z),
    point[2]
  ];
}

// ASCII character sets to loop through
const asciiSets = [
  ["@", "#", "%", "&", "*", "=", "+", "~"],
  ["$", "!", "?", "/", "|", "<", ">", "^"],
  ["[", "]", "{", "}", ":", ";", "-", "_"]
];
let currentAsciiSet = 0;

const asciiElements = [];
for (let i = 0; i < points.length; i++) {
  const span = document.createElement("span");
  span.textContent = asciiSets[currentAsciiSet][i];
  span.style.position = "absolute";
  span.style.fontSize = "20px";
  asciiElements.push(span);
  document.body.appendChild(span);
}

// Function to switch ASCII characters every 2 seconds
function switchAscii() {
  currentAsciiSet = (currentAsciiSet + 1) % asciiSets.length;
  for (let i = 0; i < asciiElements.length; i++) {
    asciiElements[i].textContent = asciiSets[currentAsciiSet][i];
  }
}
setInterval(switchAscii, 2000);

// Random effects
let effects = {
  blurEffect: false,
  shakeEffect: false,
  dotEffect: false,
  invertEffect: false,
  shadowEffect: false,
  rotateCharsEffect: false,
  boldEffect: false,
  lineDashEffect: false,
  scaleEffect: false,
  fadeEffect: false,
  glowEffect: false,
  gridEffect: false,
  lineColorEffect: false
};

// Function to toggle random effects every half-second
function applyRandomEffects() {
  for (let effect in effects) {
    effects[effect] = Math.random() < 0.5;
  }

  // Apply specific CSS effects
  ctx.filter = effects.blurEffect ? "blur(4px)" : "none";
  document.body.style.filter = effects.invertEffect ? "invert(1)" : "invert(0)";

  for (let i = 0; i < asciiElements.length; i++) {
    asciiElements[i].style.fontSize = effects.dotEffect ? "5px" : "20px";
    asciiElements[i].style.fontWeight = effects.boldEffect ? "bold" : "normal";
    asciiElements[i].style.color = effects.fadeEffect
      ? "rgba(0, 0, 0, 0.3)"
      : "black";
    asciiElements[i].style.textShadow = effects.glowEffect
      ? "0 0 5px cyan"
      : "none";
    asciiElements[i].style.transform = effects.rotateCharsEffect
      ? "rotate(20deg)"
      : "rotate(0deg)";
  }

  ctx.setLineDash(effects.lineDashEffect ? [10, 5] : []);
}
setInterval(applyRandomEffects, 500);

function updateAsciiPositions() {
  for (let i = 0; i < asciiElements.length; i++) {
    const rotatedPoint = rotateZ(rotateY(rotateX(points[i])));
    const [x, y] = project(rotatedPoint);
    asciiElements[i].style.left = x + width / 2 - 10 + "px";
    asciiElements[i].style.top = y + height / 2 - 10 + "px";
  }
}

function drawWithAscii() {
  ctx.clearRect(0, 0, width, height);
  if (effects.lineColorEffect) {
    ctx.strokeStyle = "hsl(" + Math.floor(Math.random() * 360) + ", 50%, 50%)";
  } else {
    ctx.strokeStyle = "black";
  }

  // Apply shake effect
  if (effects.shakeEffect) {
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;
    ctx.save();
    ctx.translate(offsetX, offsetY);
  }

  // Apply grid effect by drawing horizontal and vertical lines across the canvas
  if (effects.gridEffect) {
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
  }

  // Draw edges of the cube
  for (const edge of edges) {
    const p1 = rotateZ(rotateY(rotateX(points[edge[0]])));
    const p2 = rotateZ(rotateY(rotateX(points[edge[1]])));
    drawLine(p1, p2);
  }

  if (effects.shakeEffect) {
    ctx.restore();
  }

  x += effects.scaleEffect ? angle * 2 : angle;
  y += effects.scaleEffect ? angle * 2 : angle;
  z += angle;
  updateAsciiPositions();
  requestAnimationFrame(drawWithAscii);
}

drawWithAscii();
