const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = Math.min(window.innerWidth, 800);
canvas.height = Math.min(window.innerHeight, 600);
const canvasAABB = canvas.getBoundingClientRect();

let mousePosition = vec2.fromValues(canvas.width / 2, canvas.height / 2);

canvas.addEventListener('mousemove', e => {
    mousePosition = vec2.fromValues(e.clientX - canvasAABB.left, e.clientY - canvasAABB.top);
})

const points = {
    left: vec2.fromValues(50, canvas.height / 2),
    right: vec2.fromValues(canvasAABB.width - 50, canvas.height / 2)
}

const render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(
        ...points.left
    );
    ctx.bezierCurveTo(
        ...vec2.sub(vec2.create(), mousePosition, [10, 10]),
        ...vec2.add(vec2.create(), mousePosition, [10, 10]),
        ...points.right
    );
    ctx.stroke();

    window.requestAnimationFrame(render);
}

render();