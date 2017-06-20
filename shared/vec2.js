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

   function distance(p1, p2) {
      return length(Vec2.sub(p1, p2));
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
      distance,
      normalize,
      length,
      FORWARD,
   };
})()
