<template>
  <div class="favorites-container">
    <el-page-header @back="goBack" title="返回" class="favorites-header">
      <template #content>
        <span class="favorites-title">我的收藏</span>
      </template>
    </el-page-header>

    <div class="favorites-list">
      <el-card 
        v-for="(item, index) in store.user.favorites" 
        :key="index" 
        class="favorite-item"
        shadow="hover"
      >
        <div class="item-content">
          <el-image :src="item.image" class="favorite-image" fit="cover" />
          <div class="favorite-details">
            <h3 class="favorite-name">{{ item.name }}</h3>
            <div class="favorite-origin">{{ item.origin }}</div>
            <div class="favorite-price">¥{{ item.price }}</div>
            <div class="favorite-actions">
              <el-button 
                type="primary" 
                size="small" 
                @click="addToCart(item)"
              >
                加入购物车
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="removeFavorite(item.id)"
              >
                取消收藏
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty v-if="store.user.favorites.length === 0" description="暂无收藏商品">
      <el-button type="primary" @click="goToFruits">去选购水果</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { store } from '@/store/store'
import { ElMessage } from 'element-plus'

const router = useRouter()

const addToCart = (item) => {
  store.addToCart({
    id: item.id,
    name: item.name,
    price: item.price,
    imageUrl: item.image,
    quantity: 1
  })
  ElMessage.success(`已添加 ${item.name} 到购物车`)
}

const removeFavorite = (id) => {
  store.toggleFavorite({ id })
  ElMessage.success('已取消收藏')
}

const goBack = () => {
  router.go(-1)
}

const goToFruits = () => {
  router.push('/category')
}
</script>

<style scoped>
.favorites-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 10px;
  padding-bottom: 70px;
}

.favorites-header {
  margin-bottom: 15px;
}

.favorites-title {
  font-size: 18px;
  font-weight: bold;
}

.favorites-list {
  display: grid;
  gap: 10px;
}

.favorite-item {
  margin-bottom: 10px;
}

.item-content {
  display: flex;
  align-items: center;
}

.favorite-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 15px;
}

.favorite-details {
  flex: 1;
}

.favorite-name {
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.favorite-origin {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.favorite-price {
  font-size: 14px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 8px;
}

.favorite-actions {
  display: flex;
  gap: 10px;
}
</style>