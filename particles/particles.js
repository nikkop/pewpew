const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = Math.min(window.innerWidth, 800);
canvas.height = Math.min(window.innerHeight, 600);

const opts = {
    particlesAmount: 15,
    particlesSize: 5,
    particleColor: 'rgb(255, 255, 255)',
    maxDistance: 300
};

let mousePosition = vec2.fromValues(canvas.width / 2, canvas.height / 2);

canvas.addEventListener('mousemove', e => {
    const canvasAABB = canvas.getBoundingClientRect();
    mousePosition = vec2.fromValues(e.clientX - canvasAABB.left, e.clientY - canvasAABB.top);
})

const particles = [];

class Particle {
    constructor(color, size, direction, speed) {
        this.color = color;
        this.size = size;
        this.direction = direction;
        this.speed = speed;
        this.position = vec2.fromValues(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );
        this.vector = vec2.fromValues(
            Math.sin(this.direction) * speed,
            Math.cos(this.direction) * speed
        )
    }
    updatePos() {
        const canvasAABB = canvas.getBoundingClientRect();
        if(this.position[0] + canvasAABB.left - this.size < canvasAABB.left || this.position[0] + canvasAABB.left + this.size > canvasAABB.right) {
            this.vector[0] *= -1;
        }
        if(this.position[1] + canvasAABB.top - this.size < canvasAABB.top || this.position[1] + canvasAABB.top + this.size > canvasAABB.bottom) {
            this.vector[1] *= -1;
        }
        vec2.add(this.position, this.position, this.vector);
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            ...this.position,
            this.size,
            0,
            Math.PI * 2
        );
        ctx.closePath();
        ctx.fill();
    }
    drawLine(target) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.moveTo(
            ...this.position
        );
        ctx.lineTo(
            ...target
        );
        ctx.closePath();
        ctx.stroke();
    }
}

const setup = function() {
    for(let i = 0; i < opts.particlesAmount; i++) {
        particles.push(
            new Particle(
                opts.particleColor,
                opts.particlesSize,
                Math.floor(Math.random() * 360),
                Math.floor(Math.random() * (3 - 1 + 1) + 1)
            )
        )
    }
    render();
}

const render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
            particles.forEach(p2 => {
                if(p2 !== particle) {
                    if(vec2.distance(particle.position, p2.position) < opts.maxDistance) {
                        particle.drawLine(p2.position);
                    }
                }
            });
            particle.draw();
            particle.updatePos();
            ctx.beginPath();
            ctx.moveTo(
                ...particle.position
            );
            ctx.lineTo(
                ...mousePosition
            );
            ctx.closePath();
            ctx.stroke();
        }
    );

    window.requestAnimationFrame(render);
}

setup();