<template>
  <div>
    <div class="line-radius">
      <div class="red-radius"></div>
      <div class="white-radius" style="border-radius: 0 0 4px 4px"></div>
    </div>
    <div class="line-radius radius-top-border">
      <div class="red-radius"></div>
      <div class="white-radius" style="border-radius: 4px 4px 0 0"></div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.line-radius {
  height: 10px;
  position: relative;
  .red-radius {
    position: absolute;
    background: #f4f7fa;
    height: 10px;
    width: 100%;
    top: 0;
    z-index: 1;
  }
  .white-radius {
    position: absolute;
    background: white;
    height: 10px;
    width: 100%;
    top: 0;
    z-index: 2;
  }
}
.radius-top-border {
  border-top: 20px solid #f4f7fa;
}
</style>
