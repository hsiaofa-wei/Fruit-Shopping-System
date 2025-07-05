<template>
  <div class="bottom-nav">
    <router-link to="/home" class="nav-item" active-class="active">
      <el-icon :size="20"><HomeFilled /></el-icon>
      <span>首页</span>
    </router-link>
    <router-link to="/category" class="nav-item" active-class="active">
      <el-icon :size="20"><Menu /></el-icon>
      <span>分类</span>
    </router-link>
    <router-link to="/cart" class="nav-item" active-class="active">
      <el-badge :value="cartItemCount" :max="99" class="badge">
        <el-icon :size="20"><ShoppingCart /></el-icon>
      </el-badge>
      <span>购物车</span>
    </router-link>
    <router-link to="/login" class="nav-item" active-class="active">
      <el-icon :size="20"><User /></el-icon>
      <span>我的</span>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '@/store/store'
import { 
  HomeFilled,
  Menu,
  ShoppingCart,
  User
} from '@element-plus/icons-vue'

const cartItemCount = computed(() => {
  return store.cartItems.reduce((total, item) => total + item.quantity, 0)
})
</script>

<style scoped>
.bottom-nav {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 8px 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 12px;
  padding: 5px 0;
}

.nav-item.active {
  color: #4CAF50;
}

.nav-item .el-icon {
  margin-bottom: 3px;
}

.badge {
  margin-top: 0px;
}
</style>