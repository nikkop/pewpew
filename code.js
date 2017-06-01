const Vec2 = (function(){
   const FORWARD = Object.freeze([1, 0]);

   function add(v1, v2) {
      return [
         v1[0] + v2[0],
         v1[1] + v2[1]
      ];
   }

   function sub(v1, v2) {
      return [
         v1[0] - v2[0],
         v1[1] - v2[1]
      ];
   }

   function scale(v, scalar) {
      return [
         v[0] * scalar,
         v[1] * scalar
      ];
   }

   function rotate(angle) {
      return [
         Math.cos(angle),
         Math.sin(angle)
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
      add,
      sub,
      scale,
      rotate,
      dot,
      normalize,
      length,
      FORWARD,
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
      tag: 'turret',
      shape: 'circle',      
   },
   {
      position: [250, 150],
      orientation: 0,
      color: '#9b59b6',
      size: 20,
      tag: 'turret',
      shape: 'circle',      
   },
   {
      position: [400, 50],
      orientation: 0,
      color: '#e74c3c',
      size: 10,
      tag: 'turret',
      shape: 'circle',     
   },
   {
      position: [canvas.width - 100, canvas.height / 2],
      orientation: 0,
      color: '#f1c40f',
      size: 100,
      tag: 'turret',
      shape: 'circle',
   },
   {
      position: [200, 400],
      orientation: 0,
      color: 'gray',
      size: 30,
      tag: 'enemy',
      shape: 'rect',
   }
];

canvas.addEventListener('mousemove', e => {
   const rect = canvas.getBoundingClientRect();
   const mousePosition = Vec2.sub(
      [e.clientX, e.clientY],
      [rect.left, rect.top]
   );

   entities
      .filter(entity => entity.tag === 'turret')
      .forEach(entity => {
         const entityToMouse = Vec2.sub(mousePosition, entity.position);
         const angle = Math.acos(Vec2.dot(Vec2.FORWARD, Vec2.normalize(entityToMouse)));
         entity.orientation = angle;
         if(mousePosition[1] < entity.position[1]) {
            entity.orientation *= -1;
         }
   })
});

canvas.addEventListener('mousedown', e => {
   entities
      .filter(entity => entity.tag === 'turret')
      .forEach(turret => {
         const offset = Vec2.scale(Vec2.rotate(turret.orientation), turret.size);
         entities.push({            
            position: Vec2.add(turret.position, offset),
            orientation: turret.orientation,
            color: turret.color,
            size: 5,
            tag: 'projectile',
            shape: 'circle',
         });
      });
});

render();

function collides(entity1, entity2) {
   const diff = Vec2.sub(entity1.position, entity2.position);
   const distance = Vec2.length(diff);
   if(distance < entity1.size + entity2.size) {
      return true;
   }
   return false;
}

function render() {
   // logic
   entities
      .filter(entity => entity.tag === 'projectile')
      .forEach((projectile, index) => {
         console.log(index);
         const speed = 3;
         let direction = Vec2.rotate(projectile.orientation);
         direction = Vec2.scale(direction, speed);
         projectile.position = Vec2.add(projectile.position, direction);
         
         const enemy = entities.find(entity => entity.tag === 'enemy');
         if(collides(projectile, enemy)) {
            entities.splice(entities.indexOf(projectile), 1);
            enemy.color = projectile.color;           
         }
      });

   // render
   ctx.fillStyle = '#ecf0f1';
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   entities.forEach(entity => {
      ctx.fillStyle = entity.color;
      if(entity.shape === 'circle') {
         ctx.beginPath();
         ctx.arc(entity.position[0], entity.position[1], entity.size, 0, Math.PI * 2);
         ctx.fill();
      }
      else if(entity.shape === 'rect') {
         ctx.fillRect(
            entity.position[0] - entity.size,
            entity.position[1] - entity.size,
            entity.size * 2,
            entity.size * 2
         );
      }

      ctx.beginPath();
      ctx.moveTo(entity.position[0], entity.position[1]);
      ctx.lineTo(
         entity.position[0] + (entity.size * Math.cos(entity.orientation)),
         entity.position[1] + (entity.size * Math.sin(entity.orientation))
      );
      ctx.stroke();
   });

   requestAnimationFrame(render);
}

