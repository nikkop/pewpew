const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = Math.min(window.innerWidth, 800);
canvas.height = Math.min(window.innerHeight, 600);
const canvasAABB = canvas.getBoundingClientRect();

let mousePosition = vec2.fromValues(canvas.width / 2, canvas.height / 2);

canvas.addEventListener('mousemove', e => {
    mousePosition = vec2.fromValues(e.clientX - canvasAABB.left, e.clientY - canvasAABB.top);
})

const render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rectangle = new Path2D();
    rectangle.rect(
        50,
        50,
        50,
        50,
    );

    console.log(rectangle);

    const circle = new Path2D();
    circle.arc(
        100,
        100,
        25,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = 'tomato';
    ctx.fill(rectangle)
    ctx.fillStyle = 'teal';
    ctx.fill(circle);

    window.requestAnimationFrame(render);
}

render();