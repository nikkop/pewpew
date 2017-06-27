const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let counter = 0;
let cameraPosition = [0, 1, 3];
let cameraRotationY = 0;

window.addEventListener('keydown', e => {
   if(e.keyCode === 38) {
      cameraPosition[2] -= 0.1;
   }
   else if(e.keyCode === 40) {
      cameraPosition[2] += 0.1;
   }
   else if(e.keyCode === 37) {
      cameraPosition[0] -= 0.1;
      cameraRotationY -= 0.01;
   }
   else if(e.keyCode === 39) {
      cameraRotationY += 0.01;
      cameraPosition[0] += 0.1;
   }
})


function degToRad(deg) {
   return deg * Math.PI / 180;
}

function update() {
}

function drawMesh(mesh, transform) {
   const points = mesh
   .map(vertex => {
      return Mat4.transformVector4(vertex.concat(1), transform);
   })
   .map(vertex => {
      return Vec4.scale(vertex, 1/vertex[3]);         
   })
   .map(vertex => {
      return [vertex[0], vertex[1]]
   });

   ctx.beginPath();
   ctx.moveTo(...points[0]);
   points.slice(1).forEach(point => {
      ctx.lineTo(...point);   
   })
   ctx.closePath();
   ctx.fill();
}

function render() {
   const quad = [
      [-1, 1, 0],
      [1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0] 
   ];

   const triangle = [
      [0, 1, 0],
      [-1, -1, 0],
      [1, -1, 0]
   ];

   const view = Mat4.inverse(Mat4.translate(cameraPosition));
   const projection = Mat4.perspective(Math.PI / 2, 1, 0.1, 100);
   const viewProjection = Mat4.multiply(view, projection);
   
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.translate(canvas.width / 2, canvas.height / 2);
   ctx.scale(canvas.width / 2, -canvas.height / 2);
   

   ctx.fillStyle = `hsla(${counter}, 100%, 100%, 1)`;
   drawMesh(triangle, Mat4.multiply(Mat4.translate([-1, 1, -1]), viewProjection));
   ctx.fillStyle = `hsla(${counter}, 50%, 50%, 1)`;
   drawMesh(quad.map(vertex => Vec3.scale(vertex, 1)), Mat4.multiply(Mat4.rotateX(degToRad(90)), viewProjection));

   ctx.setTransform(1, 0, 0, 1, 0, 0);

   counter++;
   window.requestAnimationFrame(render);
}

render();