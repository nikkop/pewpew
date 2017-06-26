const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let mousePosition = vec2.fromValues(canvas.width / 2, canvas.height / 2);

const opts = {
    particleAmount: 10,
    particleSize: 10,
    particleColor: 'rgb(255, 255, 255)',
    particleSpeed: 3,
    maxDistance: 250
};

const particles = [];

canvas.addEventListener('mousemove', e => {
    mousePosition = vec2.fromValues(
        e.clientX - canvas.getBoundingClientRect().left,
        e.clientY - canvas.getBoundingClientRect().top
    );
    createParticles();
    
})

window.addEventListener('click', e => {
    createParticles();
})

class Particle {
    constructor(color, size, position, vector, speed) {
        this.color = color;
        this.size = size;
        this.position = vec2.clone(position);
        this.impactPosition = vec2.clone(position);
        this.speed = speed;
        this.vector = vec2.fromValues(
            Math.sin(vector) * speed,
            Math.cos(vector) * speed
        )
        this.distance = 0;
    }
    updatePos() {
        vec2.add(this.position, this.position, this.vector);
        this.distance = vec2.distance(this.position, this.impactPosition);
    }
    draw() {
        ctx.fillStyle = `hsla(${(this.distance / opts.maxDistance) * 360}, 50%, 50%, ${1 - (this.distance / opts.maxDistance)})`;
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
}

const createParticles = function() {
    for(let i = 0; i < opts.particleAmount; i++) {
        particles.push(
            new Particle(
                opts.particleColor,
                Math.floor(Math.random() * opts.particleSize),
                mousePosition,
                Math.floor(Math.random() * 360),
                opts.particleSpeed
            )
        )
    }
}

const setup = function() {
    render();
}

const render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var particlesToRemove = [];
    particles.forEach(particle => {
        particle.updatePos();
        particle.draw();
        if(particle.distance > opts.maxDistance) {
            particles.splice(particles.indexOf(particle), 1);
        }
    });
    window.requestAnimationFrame(render);
}

setup();