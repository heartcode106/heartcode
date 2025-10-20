const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];
const PARTICLE_COUNT = 500;
const heartPoints = [];

function heartShape(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
  return {x, y};
}

// Tăng kích thước trái tim để có chỗ cho ảnh
for (let i = 0; i < PARTICLE_COUNT; i++) {
  let t = Math.random() * Math.PI * 2;
  let {x, y} = heartShape(t);
  x += (Math.random() - 0.5) * 2;
  y += (Math.random() - 0.5) * 2;
  heartPoints.push({x: x * 22, y: -y * 22});
}

// Hạt sáng (hiệu ứng tim đập)
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    color: "rgba(255, 150, 180, 0.8)",
    target: heartPoints[i],
    speed: 0.05 + Math.random() * 0.02
  };
  particles.push(p);
}

// === ẢNH TRONG TIM ===
const imagePaths = [
  "images/05102024.jpg",
  "images/08082025.jpg",
  "images/14092025.jpg",
  "images/20102024.jpg",
  "images/21012025.jpg"
];
const images = [];
let loadedImages = 0;

function loadImages(callback) {
  imagePaths.forEach(path => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      loadedImages++;
      if (loadedImages === imagePaths.length) callback();
    };
    images.push({ img, opacity: 0 });
  });
}

let imageIndex = 0;
function revealNextImage() {
  if (imageIndex < images.length) {
    const target = images[imageIndex];
    let opacity = 0;
    const fade = setInterval(() => {
      opacity += 0.03;
      target.opacity = Math.min(opacity, 1);
      if (opacity >= 1) {
        clearInterval(fade);
        imageIndex++;
        setTimeout(revealNextImage, 700); // ảnh tiếp theo xuất hiện
      }
    }, 50);
  }
}

// === VẼ CẢ TIM, HẠT, ẢNH ===
function animateHeart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - 50;
  const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;

  // Clip vùng hình trái tim để chỉ hiển thị ảnh bên trong
  ctx.save();
  ctx.beginPath();
  for (let t = 0; t < Math.PI * 2; t += 0.01) {
    const {x, y} = heartShape(t);
    ctx.lineTo(cx + x * 22 * scale, cy - y * 22 * scale);
  }
  ctx.closePath();
  ctx.clip();

  // Tính vị trí lưới ảnh
  const cols = 3;
  const rows = Math.ceil(images.length / cols);
  const imgSize = 120;
  const startX = cx - (cols * imgSize) / 2;
  const startY = cy - (rows * imgSize) / 2;

  images.forEach((item, i) => {
    const { img, opacity } = item;
    if (opacity > 0) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * imgSize;
      const y = startY + row * imgSize;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, x, y, imgSize - 10, imgSize - 10);
      ctx.restore();
    }
  });
  ctx.restore();

  // Hạt sáng phía trên
  for (let p of particles) {
    p.x += (cx + p.target.x * scale - p.x) * p.speed;
    p.y += (cy + p.target.y * scale - p.y) * p.speed;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }

  requestAnimationFrame(animateHeart);
}

// === Tin nhắn ===
const messages = [
  "Tình yêu là khi chỉ cần nghĩ về ai đó...",
  "Trái tim bỗng nhiên đập nhanh hơn một nhịp 💓",
  "Cảm ơn vì đã xuất hiện trong cuộc đời anh...",
  "Dù mai này thế nào, vẫn mong em mỉm cười thật tươi 🌹"
];

let currentMsg = 0;

function showNextMessage() {
  if (currentMsg < messages.length) {
    const msgDiv = document.createElement("p");
    msgDiv.textContent = "";
    document.getElementById("message-box").appendChild(msgDiv);

    let i = 0;
    const interval = setInterval(() => {
      msgDiv.textContent += messages[currentMsg][i];
      i++;
      if (i >= messages[currentMsg].length) {
        clearInterval(interval);
        currentMsg++;
        setTimeout(showNextMessage, 1000);
      }
    }, 80);
  }
}

// === Bắt đầu ===
loadImages(() => {
  animateHeart();
  revealNextImage(); // ảnh lần lượt xuất hiện trong tim
});
showNextMessage();
