const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Tool settings
let drawing = false;
let currentColor = document.getElementById('color').value;
let currentThickness = document.getElementById('thickness').value;
let isEraser = false;

// Get the canvas's position relative to the viewport
function getCanvasOffset() {
  const rect = canvas.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
}

// Utility to get the correct position (mouse or touch)
function getPosition(e) {
  const offset = getCanvasOffset();
  if (e.touches) {
    // For touch events
    const touch = e.touches[0];
    return { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
  } else {
    // For mouse events
    return { x: e.clientX - offset.x, y: e.clientY - offset.y };
  }
}

// Event listeners for mouse and touch
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing, { passive: true });
canvas.addEventListener('touchmove', draw, { passive: true });
canvas.addEventListener('touchend', stopDrawing);

document.getElementById('color').addEventListener('input', (e) => {
  currentColor = e.target.value;
  isEraser = false;
});
document.getElementById('thickness').addEventListener('input', (e) => {
  currentThickness = e.target.value;
});
document.getElementById('eraser').addEventListener('click', () => {
  isEraser = true;
});
document.getElementById('save').addEventListener('click', saveCanvas);
document.getElementById('clear').addEventListener('click', clearCanvas);

function startDrawing(e) {
  drawing = true;
  const pos = getPosition(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  const pos = getPosition(e);
  ctx.lineWidth = currentThickness;
  ctx.lineCap = 'round';
  ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDrawing() {
  drawing = false;
  ctx.closePath();
}

function saveCanvas() {
  // Create a temporary canvas to combine background and drawing
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  // Set the size of the temporary canvas
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Draw a white background
  tempCtx.fillStyle = '#FFFFFF';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw the original canvas content over the white background
  tempCtx.drawImage(canvas, 0, 0);

  // Save the image from the temporary canvas
  const link = document.createElement('a');
  link.download = 'whiteboard.png';
  link.href = tempCanvas.toDataURL('image/png');
  link.click();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
