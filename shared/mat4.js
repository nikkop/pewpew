const Mat4 = (function(){
   const ROW_LENGTH = 4;

   function identity() {
      return [
         1, 0, 0, 0,
         0, 1, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1 
      ];
   }

   function transformVector4(v, m) {
      console.assert(v.length === 4);
      const x = Vec4.dot(v, getColumn(m, 0));
      const y = Vec4.dot(v, getColumn(m, 1));
      const z = Vec4.dot(v, getColumn(m, 2));
      const w = Vec4.dot(v, getColumn(m, 3));
      
      return [x, y, z, w];
   }

   function transformVector3(v, m) {
      const x = Vec3.dot(v, getColumn(m, 0));
      const y = Vec3.dot(v, getColumn(m, 1))
      const z = Vec3.dot(v, getColumn(m, 2))
      
      return [x, y, z];
   }

   function getColumn(m, col) {
      const x = m[ROW_LENGTH * 0 + col];
      const y = m[ROW_LENGTH * 1 + col];
      const z = m[ROW_LENGTH * 2 + col];
      const w = m[ROW_LENGTH * 3 + col];
      
      return [x, y, z, w];
   }

   function getRow(m, row) {
      const x = m[ROW_LENGTH * row + 0];
      const y = m[ROW_LENGTH * row + 1];
      const z = m[ROW_LENGTH * row + 2];
      const w = m[ROW_LENGTH * row + 3];
      
      return [x, y, z, w];     
   }

   function multiply(m1, m2) {
      const m = new Array(16);
      m[0] = Vec4.dot(getRow(m1, 0), getColumn(m2, 0));
      m[1] = Vec4.dot(getRow(m1, 0), getColumn(m2, 1));
      m[2] = Vec4.dot(getRow(m1, 0), getColumn(m2, 2));
      m[3] = Vec4.dot(getRow(m1, 0), getColumn(m2, 3));

      m[4] = Vec4.dot(getRow(m1, 1), getColumn(m2, 0));
      m[5] = Vec4.dot(getRow(m1, 1), getColumn(m2, 1));
      m[6] = Vec4.dot(getRow(m1, 1), getColumn(m2, 2));
      m[7] = Vec4.dot(getRow(m1, 1), getColumn(m2, 3));

      m[8] = Vec4.dot(getRow(m1, 2), getColumn(m2, 0));
      m[9] = Vec4.dot(getRow(m1, 2), getColumn(m2, 1));
      m[10] = Vec4.dot(getRow(m1, 2), getColumn(m2, 2));
      m[11] = Vec4.dot(getRow(m1, 2), getColumn(m2, 3));

      m[12] = Vec4.dot(getRow(m1, 3), getColumn(m2, 0));
      m[13] = Vec4.dot(getRow(m1, 3), getColumn(m2, 1));
      m[14] = Vec4.dot(getRow(m1, 3), getColumn(m2, 2));
      m[15] = Vec4.dot(getRow(m1, 3), getColumn(m2, 3));

      return m;  
   }

   function rotateZ(angle) {
      return [
         Math.cos(angle), Math.sin(angle), 0, 0,
         -Math.sin(angle), Math.cos(angle), 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1
      ]
   }

   function rotateY(angle) {
      return [
         Math.cos(angle), 0, -Math.sin(angle), 0,
         0, 1, 0, 0,
         Math.sin(angle), 0, Math.cos(angle), 0,
         0, 0, 0, 1
      ]
   }

   function rotateX(angle) {
      return [
         1, 0, 0, 0,
         0, Math.cos(angle), Math.sin(angle), 0,
         0, -Math.sin(angle), Math.cos(angle), 0,
         0, 0, 0, 1
      ]
   }

   function translate(v) {
      const m = identity();
      m[12] = v[0];
      m[13] = v[1];
      m[14] = v[2];

      return m;
   }

   function perspective(fov, ar, near, far) {
      console.assert(far > near);
      console.assert(fov > 0);
      console.assert(fov < Math.PI * 2);
      console.assert(ar > 0);

      const f = 1.0 / Math.tan(fov * 0.5);
      
      let m = identity();
      m[0] = f / ar;
      m[5] = f;
      m[10] = (far + near) / (near - far);
      m[11] = -1.0;
      m[14] = (2.0 * far * near) / (near - far);
      m[15] = 0.0;

      return m;
   }

   function inverse(m) {
   let i = 0;
   let det = 0;
   let inv = new Array(16);
   let result = new Array(16);

   inv[0] = m[5]  * m[10] * m[15] -
       m[5]  * m[11] * m[14] -
       m[9]  * m[6]  * m[15] +
       m[9]  * m[7]  * m[14] +
       m[13] * m[6]  * m[11] -
       m[13] * m[7]  * m[10];

   inv[4] = -m[4]  * m[10] * m[15] +
       m[4]  * m[11] * m[14] +
       m[8]  * m[6]  * m[15] -
       m[8]  * m[7]  * m[14] -
       m[12] * m[6]  * m[11] +
       m[12] * m[7]  * m[10];

   inv[8] = m[4]  * m[9] * m[15] -
       m[4]  * m[11] * m[13] -
       m[8]  * m[5] * m[15] +
       m[8]  * m[7] * m[13] +
       m[12] * m[5] * m[11] -
       m[12] * m[7] * m[9];

   inv[12] = -m[4]  * m[9] * m[14] +
       m[4]  * m[10] * m[13] +
       m[8]  * m[5] * m[14] -
       m[8]  * m[6] * m[13] -
       m[12] * m[5] * m[10] +
       m[12] * m[6] * m[9];

   inv[1] = -m[1]  * m[10] * m[15] +
       m[1]  * m[11] * m[14] +
       m[9]  * m[2] * m[15] -
       m[9]  * m[3] * m[14] -
       m[13] * m[2] * m[11] +
       m[13] * m[3] * m[10];

   inv[5] = m[0]  * m[10] * m[15] -
       m[0]  * m[11] * m[14] -
       m[8]  * m[2] * m[15] +
       m[8]  * m[3] * m[14] +
       m[12] * m[2] * m[11] -
       m[12] * m[3] * m[10];

   inv[9] = -m[0]  * m[9] * m[15] +
       m[0]  * m[11] * m[13] +
       m[8]  * m[1] * m[15] -
       m[8]  * m[3] * m[13] -
       m[12] * m[1] * m[11] +
       m[12] * m[3] * m[9];

   inv[13] = m[0]  * m[9] * m[14] -
       m[0]  * m[10] * m[13] -
       m[8]  * m[1] * m[14] +
       m[8]  * m[2] * m[13] +
       m[12] * m[1] * m[10] -
       m[12] * m[2] * m[9];

   inv[2] = m[1]  * m[6] * m[15] -
       m[1]  * m[7] * m[14] -
       m[5]  * m[2] * m[15] +
       m[5]  * m[3] * m[14] +
       m[13] * m[2] * m[7] -
       m[13] * m[3] * m[6];

   inv[6] = -m[0]  * m[6] * m[15] +
       m[0]  * m[7] * m[14] +
       m[4]  * m[2] * m[15] -
       m[4]  * m[3] * m[14] -
       m[12] * m[2] * m[7] +
       m[12] * m[3] * m[6];

   inv[10] = m[0]  * m[5] * m[15] -
       m[0]  * m[7] * m[13] -
       m[4]  * m[1] * m[15] +
       m[4]  * m[3] * m[13] +
       m[12] * m[1] * m[7] -
       m[12] * m[3] * m[5];

   inv[14] = -m[0]  * m[5] * m[14] +
       m[0]  * m[6] * m[13] +
       m[4]  * m[1] * m[14] -
       m[4]  * m[2] * m[13] -
       m[12] * m[1] * m[6] +
       m[12] * m[2] * m[5];

   inv[3] = -m[1] * m[6] * m[11] +
       m[1] * m[7] * m[10] +
       m[5] * m[2] * m[11] -
       m[5] * m[3] * m[10] -
       m[9] * m[2] * m[7] +
       m[9] * m[3] * m[6];

   inv[7] = m[0] * m[6] * m[11] -
       m[0] * m[7] * m[10] -
       m[4] * m[2] * m[11] +
       m[4] * m[3] * m[10] +
       m[8] * m[2] * m[7] -
       m[8] * m[3] * m[6];

   inv[11] = -m[0] * m[5] * m[11] +
       m[0] * m[7] * m[9] +
       m[4] * m[1] * m[11] -
       m[4] * m[3] * m[9] -
       m[8] * m[1] * m[7] +
       m[8] * m[3] * m[5];

   inv[15] = m[0] * m[5] * m[10] -
       m[0] * m[6] * m[9] -
       m[4] * m[1] * m[10] +
       m[4] * m[2] * m[9] +
       m[8] * m[1] * m[6] -
       m[8] * m[2] * m[5];

   det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

   console.assert(det != 0);

   det = 1.0 / det;

   for (i = 0; i < 16; i++) {
       result[i] = inv[i] * det;
   }

   return result;
}

   return {
      identity,
      transformVector4,
      transformVector3,
      multiply,
      rotateX,
      rotateY,
      rotateZ,
      perspective,
      translate,
      inverse
   };
})()
