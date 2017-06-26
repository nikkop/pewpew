const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let hovered = null;
let lastMousePosition = [0, 0];
let grabbedObject = null;

let objects = [
   {
      name: 'square',
      color: 'seashell',
      size: [100, 100],
      position: [100, 200],
   },
   {
      name: 'wide',
      color: 'navajowhite',
      size: [200, 100],
      position: [600, 150],
   },
   {
      name: 'tall',
      color: 'navajowhite',
      size: [100, 200],
      position: [300, 300],
   },
]

init();

function init() {
   canvas.addEventListener('mousemove', e => {
      const mousePosition = getMousePosition(canvas, e);
      hovered = getObjectAtPosition(mousePosition);
      updateGrabbedObject(lastMousePosition, mousePosition);
      lastMousePosition = mousePosition;
   });
   canvas.addEventListener('mousedown', e => {
      const mousePosition = getMousePosition(canvas, e);
      const object = getObjectAtPosition(mousePosition);
      grabObject(object);
   });
   window.addEventListener('mouseup', e => {
      grabObject(null);
   })
   requestAnimationFrame(render);
}

function grabObject(object) {
   grabbedObject = object;
   objects.sort((a, b) => {
      if(a === grabbedObject) {
         return 1;
      }
      if(b === grabbedObject) {
         return -1;
      }
      return 0;
   })
   return grabbedObject;
}

function getObjectAtPosition(position) {
   const objectAtPosition = objects.slice().reverse().find(object => rectContainsPoint(rectFromObject(object), position));
   return objectAtPosition;
}

function updateGrabbedObject(lastPosition, position) {
   if(!grabbedObject) {
      return;
   }
   grabbedObject.position = Vec2.add(grabbedObject.position, Vec2.sub(position, lastPosition));
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

function closestPointInRect(point, rect) {
   var x = Math.max(point[0], rect.min[0]);
   x = Math.min(x, rect.max[0]);
   var y = Math.max(point[1], rect.min[1]);
   y = Math.min(y, rect.max[1]);

   return [x, y];
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

function getRectCenter(rect) {
   return Vec2.add(rect.min, Vec2.scale(Vec2.sub(rect.max, rect.min), 0.5));
}

function drawEye(pos, target, radius) {
   const distanceFromTarget = Vec2.distance(pos, target);
   const eyeRadius = radius + Math.min(radius / 3, radius * (distanceFromTarget / 1000));
   const pupilRadius = eyeRadius / 3;

   const pupilCenter = Vec2.add(
      pos,
      Vec2.scale(Vec2.normalize(Vec2.sub(target, pos)), eyeRadius - (pupilRadius * 2))
   );

   ctx.beginPath();
   ctx.fillStyle = 'beige';
   ctx.arc(
      ...pos,
      eyeRadius,
      0,
      Math.PI * 2,
   );
   ctx.fill();
   ctx.stroke();

   ctx.beginPath();
   ctx.fillStyle = 'black';
   ctx.arc(
      ...pupilCenter,
      pupilRadius,
      0,
      Math.PI * 2
   );
   ctx.fill();
}

function render() {
   ctx.fillStyle = '#EEE';
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   objects.forEach(object => {
      const rect = rectFromObject(object);
      const rectCenter = getRectCenter(rect);
      const size = Vec2.sub(rect.max, rect.min);
      const GLOW_SIZE = 5;
      if(hovered === object) {
         // draw glowy
         ctx.filter = 'blur(20px)';
         ctx.fillStyle = 'teal';
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
      
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.rect(rect.min[0] + 10, rect.min[1] + 10, size[0] - 20, size[1] - 20);
      ctx.fill();
      ctx.stroke();


      // Points
      if(hovered === object || grabbedObject === object) {
         const closestPointsToRect = objects
            .filter(obj => obj !== hovered)
            .map(rectFromObject)
            .map(rect => closestPointInRect(rectCenter, rect));

         const closestPointsOnRect = closestPointsToRect
            .map(point => closestPointInRect(point, rect));
            
         closestPointsToRect.concat(closestPointsOnRect).forEach(point => {
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(
               ...point,
               5,
               0,
               Math.PI * 2
            );
            ctx.fill();
         })

         for(let i = 0; i < closestPointsToRect.length; i++) {
            ctx.beginPath();
            ctx.moveTo(
               ...closestPointsOnRect[i]
            );
            ctx.lineTo(
               ...closestPointsToRect[i]
            );
            ctx.stroke();

            const distance = Vec2.distance(closestPointsOnRect[i], closestPointsToRect[i]).toFixed(0);
            ctx.font = '14px monospace';
            ctx.fillText(
               distance,
               ...Vec2.add(closestPointsOnRect[i], Vec2.scale(Vec2.sub(closestPointsToRect[i], closestPointsOnRect[i]), 0.5)) 
            );

            // ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            // ctx.fillRect(
            //    closestPointsToRect[i][0],
            //    closestPointsToRect[i][1],     
            //    object.size[0],
            //    object.size[1]          
            // );
            // ctx.fill();
            


            if(distance < 50) {
               object.position = Vec2.sub(
                  closestPointsToRect[i],
                  Vec2.sub(
                     closestPointsOnRect[i],
                     object.position
                  )
               );
            }
         }
      }



      // Eyeballs
      const eyeRadius = 15;
      const offsetX = 20;
      const eyesCenter = Vec2.add(rect.min, [size[0] / 2, eyeRadius + 20]);
      // const center = Vec2.scale(size, 0.5);

      drawEye(
         Vec2.add(eyesCenter, [-offsetX, 0]),
         lastMousePosition,
         eyeRadius
      );

      drawEye(
         Vec2.add(eyesCenter, [offsetX, 0]),
         lastMousePosition,
         eyeRadius            
      );
   })

   requestAnimationFrame(render);
}

