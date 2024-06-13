const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const speedDisplay = document.getElementById("speed");

let speed = 1.0;
let angle = 270;
const timerInterval = 100; // 100ms
const crankRadius = 80;
const pistonWidth = 50;
const pistonHeight = 80;
const cylinderWidth = 220;
const cylinderHeight = 80;
const initialCylinderX = 450;
const initialCylinderY = 200 - cylinderHeight / 2;

const origin = { x: 200, y: 200 };

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrankshaft(ctx, origin, crankRadius, angle);
  let pistonX = calculatePistonX(origin, crankRadius, angle, initialCylinderX);
  pistonX = constrainPistonX(
    pistonX,
    initialCylinderX,
    cylinderWidth,
    pistonWidth
  );

  drawPistonAndCylinder(
    ctx,
    pistonX,
    pistonWidth,
    pistonHeight,
    initialCylinderX,
    initialCylinderY,
    cylinderWidth,
    cylinderHeight
  );

  angle += speed * 10;
  if (angle >= 360) {
    angle = 0;
  }
}

function calculatePistonX(origin, crankRadius, angle, cylinderX) {
  const loc = calculatePointOnCircle(crankRadius, angle, origin);
  return cylinderX + (loc.x - origin.x) + crankRadius;
}

function constrainPistonX(pistonX, cylinderX, cylinderWidth, pistonWidth) {
  const minPistonX = cylinderX;
  const maxPistonX = cylinderX + cylinderWidth - pistonWidth;
  return Math.max(minPistonX, Math.min(pistonX, maxPistonX));
}

function calculatePointOnCircle(radius, angleInDegrees, origin) {
  const angleInRadians = angleInDegrees * (Math.PI / 180);
  const x = origin.x + radius * Math.cos(angleInRadians);
  const y = origin.y + radius * Math.sin(angleInRadians);
  return { x, y };
}

function drawCrankshaft(ctx, origin, crankRadius, angle) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, crankRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, 5, 0, Math.PI * 2);
  ctx.fill();

  const loc = calculatePointOnCircle(crankRadius, angle, origin);
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(loc.x, loc.y, 5, 0, Math.PI * 2);
  ctx.fill();

  const oppositeLoc = calculatePointOnCircle(crankRadius, angle + 180, origin);
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(oppositeLoc.x, oppositeLoc.y, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(loc.x, loc.y);
  ctx.lineTo(oppositeLoc.x, oppositeLoc.y);
  ctx.stroke();
}

function drawPistonAndCylinder(
  ctx,
  pistonX,
  pistonWidth,
  pistonHeight,
  cylinderX,
  cylinderY,
  cylinderWidth,
  cylinderHeight
) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(cylinderX, cylinderY);
  ctx.lineTo(cylinderX + cylinderWidth, cylinderY);
  ctx.lineTo(cylinderX + cylinderWidth, cylinderY + cylinderHeight);
  ctx.lineTo(cylinderX, cylinderY + cylinderHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cylinderX, cylinderY);
  ctx.lineTo(cylinderX, cylinderY - 20);
  ctx.moveTo(cylinderX, cylinderY + cylinderHeight);
  ctx.lineTo(cylinderX, cylinderY + cylinderHeight + 20);
  ctx.stroke();

  const pistonY = cylinderY + (cylinderHeight - pistonHeight) / 2;
  ctx.fillStyle = "black";
  ctx.fillRect(pistonX, pistonY, (pistonWidth = 56), pistonHeight);

  const loc = calculatePointOnCircle(crankRadius, angle, origin);
  const pistonCenter = {
    x: pistonX + pistonWidth / 2,
    y: pistonY + pistonHeight / 2,
  };
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(loc.x, loc.y);
  ctx.lineTo(pistonCenter.x, pistonCenter.y);
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(pistonCenter.x, pistonCenter.y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function updateSpeedDisplay() {
  speedDisplay.textContent = speed.toFixed(1);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    speed += 1.0;
    updateSpeedDisplay();
  } else if (e.key === "ArrowDown") {
    speed = Math.max(0, speed - 1.0);
    updateSpeedDisplay();
  } else if (e.key === "Escape") {
    window.close();
  }
});

setInterval(draw, timerInterval);
