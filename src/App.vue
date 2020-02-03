<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {};

// 启用 REM，用于自适应布局
document.addEventListener("DOMContentLoaded", () => {
  const html = document.querySelector("html");
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > 50 ? 50 : fontSize;
  html.style.fontSize = fontSize + "px";
});
</script>

<style lang="scss" scope>
#app {
  width: 100%;
  height: 100%;
  background: #7d8188;
  overflow: hidden;
}
</style>
