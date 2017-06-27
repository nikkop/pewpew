const Vec3 = (function(){

   function dot(v1, v2) {
      return (
         v1[0] * v2[0] + 
         v1[1] * v2[1] +
         v1[2] * v2[2] 
      );
   }

   function scale(v, scalar) {
      return v.map(item => item * scalar);
   }

   return {
      dot,
      scale
   };
})()
