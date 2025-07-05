<template>
  <div class="orders-container">
    <el-page-header @back="$router.go(-1)" title="返回">
      <template #content>
        <span class="orders-title">我的订单</span>
      </template>
    </el-page-header>

    <el-tabs v-model="activeStatus" class="orders-tabs">
      <el-tab-pane 
        v-for="status in orderStatuses" 
        :key="status.value" 
        :label="`${status.label} (${store.orders[status.value].length})`" 
        :name="status.value"
      >
        <el-card 
          v-for="order in store.orders[status.value]" 
          :key="order.id" 
          class="order-card"
        >
          <div class="order-header">
            <span class="order-id">订单号: #{{ order.id }}</span>
            <span class="order-date">{{ new Date(order.createdAt).toLocaleString() }}</span>
            <span class="order-total">¥{{ order.total.toFixed(2) }}</span>
          </div>
          
          <div class="order-address">
            {{ order.address.fullAddress }} ({{ order.address.receiver }}, {{ order.address.phone }})
          </div>
          
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <el-image :src="item.imageUrl" class="item-image" fit="cover" />
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price-quantity">
                  ¥{{ item.price.toFixed(2) }} × {{ item.quantity }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-actions">
            <el-button 
              v-if="status.value === 'pending'" 
              type="primary" 
              size="small"
              @click="payOrder(order.id)"
            >
              立即支付
            </el-button>
            
            <el-button 
              v-if="status.value === 'shipping'" 
              type="success" 
              size="small"
              @click="confirmReceipt(order.id)"
            >
              确认收货
            </el-button>
            
            <el-button 
              v-if="status.value === 'completed'" 
              type="primary" 
              size="small"
              @click="rateOrder(order.id)"
            >
              评价订单
            </el-button>
            
            <el-button 
              v-if="status.value !== 'completed' && status.value !== 'canceled'"
              type="danger" 
              size="small"
              @click="cancelOrder(order.id)"
            >
              取消订单
            </el-button>
          </div>
        </el-card>
        
        <el-empty v-if="store.orders[status.value].length === 0" description="暂无订单" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '@/store/store'

const activeStatus = ref('pending')

const orderStatuses = [
  { value: 'pending', label: '待付款' },
  { value: 'paid', label: '待发货' },
  { value: 'shipping', label: '待收货' },
  { value: 'completed', label: '已完成' },
  { value: 'canceled', label: '已取消' }
]

// 复用 store 中的方法
const payOrder = (orderId) => {
  store.payOrder(orderId)
}

const cancelOrder = (orderId) => {
  store.cancelOrder(orderId)
}

const confirmReceipt = (orderId) => {
  store.confirmReceipt(orderId)
}

const rateOrder = (orderId) => {
  // 跳转到评价页面
  console.log('跳转到评价页面', orderId)
}
</script>

<style scoped>
.orders-container {
  padding: 15px;
}

.orders-title {
  font-size: 18px;
  font-weight: bold;
}

.orders-tabs {
  margin-top: 20px;
}

.order-card {
  margin-bottom: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.order-id {
  font-weight: bold;
}

.order-total {
  color: #f56c6c;
  font-weight: bold;
}

.order-address {
  color: #666;
  font-size: 13px;
  margin-bottom: 15px;
}

.order-items {
  margin: 10px 0;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.item-image {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}

.item-info {
  flex: 1;
}

.item-name {
  margin-bottom: 5px;
}

.item-price-quantity {
  color: #888;
  font-size: 13px;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}
</style>