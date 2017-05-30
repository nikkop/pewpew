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
      orientation: Math.PI,
      color: '#9b59b6',
      size: 20,
   }
];

function render() {
   // logic
   entities[0].orientation += 0.01;
   entities[1].orientation += 0.02;

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

render();
