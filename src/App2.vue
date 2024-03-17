<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import WebGL from './utils/webgl';
import Renderer from './utils/renderer4';

onMounted(() => {
  const canvas = WebGL.getCanvas('canvas');
  if (!canvas) return;
  Renderer.init(canvas);
  Renderer.animate();
})
</script>

<template>
  <canvas id="canvas"></canvas>
</template>