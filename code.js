const Vec2 = (function(){
   const FORWARD = Object.freeze([1, 0]);

   function fromValues(x, y) {
      return [x, y];
   }

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
      fromValues,
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
      position: [100, canvas.height / 2],
      orientation: 0,
      color: '#27ae60',
      size: 50,
      tag: 'turret',
      shape: 'circle',      
   },
   {
      position: [canvas.width / 2, 50],
      orientation: 0,
      color: '#9b59b6',
      size: 20,
      tag: 'turret',
      shape: 'circle',      
   },
   {
      position: [canvas.width - 50, canvas.height / 2],
      orientation: 0,
      color: '#e74c3c',
      size: 10,
      tag: 'turret',
      shape: 'circle',     
   },
   {
      position: [canvas.width / 2, canvas.height - 100],
      orientation: 0,
      color: '#f1c40f',
      size: 75,
      tag: 'turret',
      shape: 'circle',
   },
   {
      position: [canvas.width / 2, canvas.height / 2],
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
            size: 20,
            tag: 'projectile',
            shape: 'circle',
         });
      });
});

render();

function circleVsCircle(s1, s2) {
   const diff = Vec2.sub(s1.center, s2.center);
   const distance = Vec2.length(diff);
   if(distance < s1.radius + s2.radius) {
      return true;
   }
   return false;
}

function getRect(entity) {
   const size = Vec2.fromValues(entity.size, entity.size);
   return {
      min: Vec2.sub(entity.position, size),
      max: Vec2.add(entity.position, size)
   }  
}

function getCircle(entity) {
   return {
      center: entity.position,
      radius: entity.size
   }
}


function rectVsRect(r1, r2) {
   if(r1.max[0] < r2.min[0]) {
      return false;
   }
   if(r1.max[1] < r2.min[1]) {
      return false;
   }
   if(r1.min[0] > r2.max[0]) {
      return false;
   }
   if(r1.min[1] > r2.max[1]) {
      return false;
   }
   return true;
}

function rectContainsPoint(r, p) {
   if(r.max[0] < p[0]) {
      return false;
   }
   if(r.max[1] < p[1]) {
      return false;
   }
   if(r.min[0] > p[0]) {
      return false;
   }
   if(r.min[1] > p[1]) {
      return false;
   }
   return true;
}

function rectVsCircle(r, s) {
   if(r.max[0] + s.radius < s.center[0]) {
      return false;
   }
   if(r.max[1] + s.radius < s.center[1]) {
      return false;
   }
   if(r.min[0] - s.radius > s.center[0]) {
      return false;
   }
   if(r.min[1] - s.radius > s.center[1]) {
      return false;
   }
   return true;
}

function render() {
   // logic
   entities
      .filter(entity => entity.tag === 'projectile')
      .forEach((projectile, index) => {
         const speed = 3;
         let direction = Vec2.rotate(projectile.orientation);
         direction = Vec2.scale(direction, speed);
         projectile.position = Vec2.add(projectile.position, direction);
         
         entities
            .filter(entity => entity.tag.match(/projectile|enemy/))
            .filter(entity => entity !== projectile)
            .filter(entity => entity.color !== projectile.color)
            .forEach(entity => {
               if(entity.shape === 'circle') {
                  if(circleVsCircle(getCircle(entity), getCircle(projectile))) {
                     entities.splice(entities.indexOf(projectile), 1);
                     entity.color = projectile.color;  
                     entity.size += projectile.size * 0.1;
                  }
               }
               else {
                  if(rectVsCircle(getRect(entity), getCircle(projectile))) {
                     entities.splice(entities.indexOf(projectile), 1);
                     entity.color = projectile.color;           
                  }
               }
            })
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

