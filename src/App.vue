<template>
<div>
  <router-view></router-view> 
  <BottomNav />
</div>
</template>

<script setup>
import BottomNav from './components/BottomNav.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, 
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background-color: #f5f7fa;
}

#app {
  max-width: 100vw;
  overflow-x: hidden;
}

/* 全局调整Element Plus组件样式 */
.el-button {
  font-family: inherit;
}

.el-card {
  border-radius: 8px;
}

.el-dialog {
  border-radius: 12px;
}

.el-input__inner {
  font-family: inherit;
}

.el-message {
  font-family: inherit;
}
</style> 
 