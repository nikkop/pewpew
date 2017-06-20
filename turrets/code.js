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
   const halfSize = Vec2.scale(size, 1);
   return {
      min: Vec2.sub(entity.position, halfSize),
      max: Vec2.add(entity.position, halfSize)
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

function closestPointInRect(point, rect) {
   var x = Math.max(point[0], rect.min[0]);
   x = Math.min(x, rect.max[0]);
   var y = Math.max(point[1], rect.min[1]);
   y = Math.min(y, rect.max[1]);

   return [x, y];
}

function rectVsCircle(r, c) {
   const closest = closestPointInRect(c.center, r);
   const distance = Vec2.distance(c.center, closest);
   return distance < c.radius;
}

function resolveProjectileCollision(p1, p2) {
   const p1Dir = Vec2.rotate(p1.orientation);
   const p2Dir = Vec2.rotate(p2.orientation);

   const p1Angle = Vec2.dot(p1Dir, Vec2.normalize(Vec2.sub(p2.position, p1.position)));
   const p2Angle = Vec2.dot(p2Dir, Vec2.normalize(Vec2.sub(p1.position, p2.position)));

   return p2Angle > p1Angle ? p1 : p2;
}

function render() {
   // logic
   // entities
   //    .filter(entity => entity.tag === 'projectile')
   //    .forEach((projectile, index) => {
   //       const speed = 3;
   //       let direction = Vec2.rotate(projectile.orientation);
   //       direction = Vec2.scale(direction, speed);
   //       projectile.position = Vec2.add(projectile.position, direction);

   //       entities
   //          .filter(entity => entity.tag.match(/projectile|enemy/))
   //          .filter(entity => entity !== projectile)
   //          .filter(entity => entity.color !== projectile.color)
   //          .forEach(entity => {
   //             if(entity.shape === 'circle') {
   //                if(circleVsCircle(getCircle(entity), getCircle(projectile))) {
   //                   entities.splice(entities.indexOf(projectile), 1);
   //                   entity.color = projectile.color;
   //                   entity.size += projectile.size * 0.1;
   //                }
   //             }
   //             else {
   //                const rect = getRect(entity);
   //                const circle = getCircle(projectile);
   //                if(rectVsCircle(rect, circle)) {
   //                   entities.splice(entities.indexOf(projectile), 1);
   //                   entity.color = projectile.color;
   //                }
   //             }
   //          })
   //    });


   // Get all projectiles
   const projectiles = entities.filter(entity => entity.tag === 'projectile');

   // First update position of all projectiles
   projectiles.forEach(projectile => {
      const speed = 3;
      let direction = Vec2.rotate(projectile.orientation);
      direction = Vec2.scale(direction, speed);
      projectile.position = Vec2.add(projectile.position, direction);
   });

   // Check collision between all projectiles
   projectiles.forEach(projectile1 => {
      projectiles
         .filter(projectile2 => projectile2 !== projectile1)
         .filter(projectile2 => projectile2.color !== projectile1.color)
         .forEach(projectile2 => {
            if(circleVsCircle(getCircle(projectile1), getCircle(projectile2))) {
               const loser = resolveProjectileCollision(projectile1, projectile2);
               const winner = loser === projectile1 ? projectile2 : projectile1;
               if(entities.indexOf(loser) !== -1) {   
                  entities.splice(entities.indexOf(loser), 1);
                  winner.size += loser.size * 0.25;
               }
            }
         })
   })

   // Check collision between projectiles and rest


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

   entities.forEach(entity => {
      const circle = getCircle(entity);
      const rect = getRect(entity);
      ctx.beginPath();
      ctx.arc(
         circle.center[0],
         circle.center[1],
         circle.radius,
         0,
         Math.PI * 2
      )
      ctx.stroke();
      ctx.rect(
         rect.min[0],
         rect.min[1],
         rect.max[0] - rect.min[0],
         rect.max[1] - rect.min[1]
      );
      ctx.stroke();

   });

   requestAnimationFrame(render);
}

