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

   const world = Mat4.rotateZ(Math.PI / 2);
   const view = Mat4.inverse(Mat4.translate([0, 0, 10]));
   const projection = Mat4.perspective(Math.PI / 2, 1, 0.1, 100);
   const transform = Mat4.multiply(world, Mat4.multiply(view, projection));

   let v1 = Mat4.transformVector4(triangle.v1.concat(1), transform);
   let v2 = Mat4.transformVector4(triangle.v2.concat(1), transform);
   let v3 = Mat4.transformVector4(triangle.v3.concat(1), transform);

   v1 = Vec4.scale(v1, 1/v1[3]);
   v2 = Vec4.scale(v2, 1/v2[3]);
   v3 = Vec4.scale(v3, 1/v3[3]);
   

   ctx.fillStyle = `hsla(${counter}, 50%, 50%, 1)`;
   ctx.strokeStyle = 'teal';

   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.translate(canvas.width / 2, canvas.height / 2);
   ctx.scale(canvas.width / 2, -canvas.height / 2);
   ctx.beginPath();
   ctx.moveTo(...v1);
   ctx.lineTo(...v2);
   ctx.lineTo(...v3);
   ctx.closePath();
   ctx.fill();
   ctx.setTransform(1, 0, 0, 1, 0, 0);


   counter++;
   window.requestAnimationFrame(render);
}

render();