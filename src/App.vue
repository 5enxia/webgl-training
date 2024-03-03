<script setup lang="ts">
import { onMounted } from 'vue';
import WebGL from './utils/webgl';
import matIV from './utils/minMatrix';

onMounted(() => {
  const canvas = WebGL.getCanvas('canvas');
  if (!canvas) {
    alert('canvasの取得に失敗しました');
    return;
  }
  const gl = WebGL.createContext(canvas);
  if (!gl) {
    alert('webglの初期化に失敗しました');
    return;
  }
  const vs = WebGL.createShader(gl, 'vs');
  const fs = WebGL.createShader(gl, 'fs');
  if (!vs || !fs) {
    alert('シェーダ作成失敗');
    return;
  };
  let prg = WebGL.createProgram(gl, vs, fs);
  if (!prg) {
    alert('プログラムオブジェクトの作成に失敗しました');
    return;
  };
  var attLocations = [
    gl.getAttribLocation(prg, 'position'),
    gl.getAttribLocation(prg, 'color')
  ]
  attLocations.forEach((location, index) => {
    if (location == undefined || location == -1) {
      alert(`attLocations[${index}]の取得に失敗しました`);
      return;
    }
  })
  var attStrides = [3, 4];
  var vertexPosition = [
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
  ];
  var vertexColor = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ]
  var vbos = [
    WebGL.createVBO(gl, vertexPosition),
    WebGL.createVBO(gl, vertexColor)
  ];
  vbos.forEach((vbo, index) => {
    if (!vbo) {
      alert(`vbos[${index}]の作成に失敗しました`);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(attLocations[index]);
    gl.vertexAttribPointer(attLocations[index], attStrides[index], gl.FLOAT, false, 0, 0);
  });

  var m = new matIV();
  // 各種行列の生成と初期化
  var mMatrix = m.identity(m.create());
  var vMatrix = m.identity(m.create());
  var pMatrix = m.identity(m.create());
  var mvpMatrix = m.identity(m.create());
  var tmpMatrix = m.identity(m.create());

  // ビュー座標変換行列
  m.lookAt(new Float32Array([0.0, 1.0, 3.0]), new Float32Array([0, 0, 0]), new Float32Array([0, 1, 0]), vMatrix);

  // プロジェクション座標変換行列
  m.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix);

  // uniformLocationの取得
  var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');
  if (!uniLocation) {
    alert('uniLocationの取得に失敗しました');
    return;
  };

  // 各行列を掛け合わせ座標変換行列を完成させる
  m.multiply(pMatrix, vMatrix, tmpMatrix);

  m.translate(mMatrix, new Float32Array([1.5, 0.0, 0.0]), mMatrix);
  m.multiply(tmpMatrix, mMatrix, mvpMatrix);

  // uniformLocationへ座標変換行列を登録
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
  // モデルの描画
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  m.identity(mMatrix);
  m.translate(mMatrix, new Float32Array([-1.5, 0.0, 0.0]), mMatrix);
  m.multiply(tmpMatrix, mMatrix, mvpMatrix);
  
  // uniformLocationへ座標変換行列を登録
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
  // モデルの描画
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // コンテキストの再描画
  gl.flush();
}); 
</script>

<template>
  <canvas id="canvas"></canvas>
</template>

<style scoped></style>
