const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

// Kích thước canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mảng lưu pháo hoa
let fireworks = [];

// Lớp pháo hoa
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 3;
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.opacity = 1;
        this.particles = [];
        this.exploded = false;
    }

    explode() {
        for (let i = 0; i < 200; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 8 + 3;

            let particle = {
                x: this.x,
                y: this.y,
                radius: Math.random() * 4 + 2,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                opacity: 1
            };
            this.particles.push(particle);
        }
        this.exploded = true;
    }

    update() {
        if (!this.exploded) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.02;
            if (this.opacity <= 0) {
                this.explode();
            }
        }
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        if (this.exploded) {
            this.particles.forEach((particle, index) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.opacity -= 0.015;
                particle.radius *= 0.98;

                ctx.globalAlpha = particle.opacity;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                ctx.closePath();

                if (particle.opacity <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }
}

// Tạo pháo hoa
function createFireworks(x, y) {
    fireworks.push(new Firework(x, y));
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.opacity <= 0 && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(updateCanvas);
}

canvas.addEventListener("click", (event) => {
    createFireworks(event.clientX, event.clientY);
});

setInterval(() => {
    createFireworks(Math.random() * canvas.width, Math.random() * canvas.height);
}, 500);

updateCanvas();
