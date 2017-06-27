const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let counter = 0;

function vec3Dot(v1, v2) {
   return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function getMatrixColumn(m, columnIndex) {
   const rowLength = 3;

   const x = m[rowLength * 0 + columnIndex];
   const y = m[rowLength * 1 + columnIndex];
   const z = m[rowLength * 2 + columnIndex];

   return [x, y, z];  
}

function rotateZ(angle) {
   return [
      Math.cos(angle), Math.sin(angle), 0,
      -Math.sin(angle), Math.cos(angle), 0,
      0, 0, 1
   ]
}

function transformVector(v, m) {
   const x = vec3Dot(v, getMatrixColumn(m, 0));
   const y = vec3Dot(v, getMatrixColumn(m, 1));
   const z = vec3Dot(v, getMatrixColumn(m, 2));

   return [x, y, z];
}

function degToRad(deg) {
   return deg * Math.PI / 180;
}

function update() {
}

function render() {
   const triangle = {
      v1: [0, 1, 0],
      v2: [-1, -1, 0],
      v3: [1, -1, 0]
   };

   const matrix = rotateZ(degToRad(counter));
   counter++;
   
   triangle.v1 = transformVector(triangle.v1, matrix);
   triangle.v2 = transformVector(triangle.v2, matrix);
   triangle.v3 = transformVector(triangle.v3, matrix);
   
   ctx.fillStyle = 'lightgray';
   ctx.strokeStyle = 'teal';

   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.translate(canvas.width / 2, canvas.height / 2);
   ctx.scale(canvas.width / 2, -canvas.height / 2);
   ctx.beginPath();
   ctx.moveTo(...triangle.v1);
   ctx.lineTo(...triangle.v2);
   ctx.lineTo(...triangle.v3);
   ctx.closePath();
   ctx.fill();
   ctx.setTransform(1, 0, 0, 1, 0, 0);

   window.requestAnimationFrame(render);
}

render();