const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;

let hovered = null;

let objects = [
   {
      name: 'square',
      color: 'seashell',
      size: [100, 100],
      position: [100, 200]
   },
   {
      name: 'wide',
      color: 'navajowhite',
      size: [200, 100],
      position: [600, 150]
   },
   {
      name: 'tall',
      color: 'navajowhite',
      size: [100, 200],
      position: [300, 300]
   }
]

init();

function init() {
   canvas.addEventListener('mousemove', e => {
      const mousePosition = getMousePosition(canvas, e);
      hovered = objects.find(object => rectContainsPoint(rectFromObject(object), mousePosition));
   });
   requestAnimationFrame(render);
}

function rectContainsPoint({min, max}, point) {
   if(point[0] < min[0]) {
      return false;
   }
   if(point[0] > max[0]) {
      return false;
   }
   if(point[1] < min[1]) {
      return false;
   }
   if(point[1] > max[1]) {
      return false;
   }
   return true;
}

// Return new object based on size and position
function rectFromObject({position, size}) {
   const halfSize = Vec2.divide(size, 2);
   const min = Vec2.sub(position, halfSize);
   const max = Vec2.add(position, halfSize);

   return {
      min,
      max
   };
}

function getMousePosition(element, event) {
   const rect = element.getBoundingClientRect();
   const mousePosition = Vec2.sub(
      [event.clientX, event.clientY],
      [rect.left, rect.top]
   );
   return mousePosition;
}

function render() {
   const ctx = canvas.getContext('2d');
   
   ctx.fillStyle = '#EEE';
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   objects.forEach(object => {
      const rect = rectFromObject(object);      
      const size = Vec2.sub(rect.max, rect.min);
      const GLOW_SIZE = 5;
      if(hovered === object) {
         // draw glowy
         ctx.filter = 'blur(20px)';
         ctx.fillStyle = 'lime';
         ctx.beginPath();
         ctx.rect(
            rect.min[0] - GLOW_SIZE,
            rect.min[1] - GLOW_SIZE,
            size[0] + GLOW_SIZE * 2,
            size[1] + GLOW_SIZE * 2
         );
         ctx.fill();
      }

      // draw normally
      ctx.filter = 'none';
      ctx.fillStyle = object.color;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.rect(rect.min[0], rect.min[1], size[0], size[1]);
      ctx.fill();
      ctx.stroke();
   })

   requestAnimationFrame(render);
}

