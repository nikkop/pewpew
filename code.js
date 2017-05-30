const Vec2 = (function(){
   function sub(v1, v2) {
      return [
         v1[0] - v2[0],
         v1[1] - v2[1]
      ];
   }

   function dot(v1, v2) {
      return v1[0] * v2[0] + v1[1] * v2[1];
   }

   function normalize(v) {
      const len = length(v);
      return [
         v[0] / len,
         v[1] / len
      ];
   }

   function length(v) {
      return Math.sqrt((v[0] * v[0]) + (v[1] * v[1]));
   }

   return {
      sub,
      dot,
      normalize,
   };
})()

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const entities = [
   {
      position: [100, 100],
      orientation: 0,
      color: '#27ae60',
      size: 50,
   },
   {
      position: [250, 150],
      orientation: 0,
      color: '#9b59b6',
      size: 20,
   },
   {
      position: [400, 50],
      orientation: 0,
      color: '#e74c3c',
      size: 10
   },
   {
      position: [canvas.width - 100, canvas.height / 2],
      orientation: 0,
      color: '#f1c40f',
      size: 100
   }
];

canvas.addEventListener('mousemove', e => {
   const rect = canvas.getBoundingClientRect();
   const mousePosition = Vec2.sub(
      [e.clientX, e.clientY],
      [rect.left, rect.top]
   );

   entities.forEach(entity => {
      const entityToMouse = Vec2.sub(mousePosition, entity.position);
      const angle = Math.acos(Vec2.dot([1, 0], Vec2.normalize(entityToMouse)));
      entity.orientation = angle;
      if(mousePosition[1] < entity.position[1]) {
         entity.orientation *= -1;
      }
   })
})

render();

function render() {
   // logic
   // entities[0].orientation += 0.01;
   // entities[1].orientation += 0.02;

   // render
   ctx.fillStyle = '#ecf0f1';
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   entities.forEach(entity => {
      ctx.fillStyle = entity.color;
      ctx.beginPath();
      ctx.arc(entity.position[0], entity.position[1], entity.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(entity.position[0], entity.position[1]);
      ctx.lineTo(
         entity.position[0] + (entity.size * Math.cos(entity.orientation)),
         entity.position[1] + (entity.size * Math.sin(entity.orientation))
      );
      ctx.stroke();
   })

   requestAnimationFrame(render);
}

