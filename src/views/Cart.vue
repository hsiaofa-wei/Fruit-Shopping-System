<template>
  <div class="cart-container">
    <!-- 购物车标题 -->
    <el-page-header @back="goBack" title="返回" class="cart-header">
      <template #content>
        <span class="cart-title">我的购物车</span>
      </template>
    </el-page-header>

    <!-- 购物车列表 -->
    <div class="cart-items">
      <el-card shadow="hover" v-for="(item, index) in store.cartItems" :key="item.id" class="cart-item">
        <div class="item-content">
          <el-image :src="item.imageUrl" class="cart-item-image" fit="cover" />
          <div class="cart-item-details">
            <h3 class="cart-item-name">{{ item.name }}</h3>
            <div class="cart-item-price">¥{{ item.price }}</div>
            <div class="cart-item-actions">
              <el-input-number 
                v-model="item.quantity" 
                :min="1" 
                :max="10" 
                @change="handleQuantityChange(index)"
                size="small"
              />
              <el-button 
                type="danger" 
                plain 
                size="small" 
                @click="removeItem(index)"
                class="remove-button"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空购物车提示 -->
    <el-empty v-if="store.cartItems.length === 0" description="购物车空空如也~">
      <el-button type="primary" @click="goToFruits">去选购水果</el-button>
    </el-empty> 

    <!-- 结算栏 -->
    <div class="checkout-bar" v-if="store.cartItems.length > 0">
      <div class="total-info">
        <span class="total-label">共 {{ totalItems }} 件商品</span>
        <span class="total-price">总计: ¥{{ totalPrice }}</span>
      </div>
      <el-button 
        type="primary" 
        size="large" 
        @click="showCheckoutDialog" 
        class="checkout-button"
      >
        去结算
      </el-button>
    </div>

    <!-- 结算弹窗 -->
    <el-dialog
      v-model="checkoutDialogVisible"
      title="订单结算"
      width="90%"
      :before-close="handleClose"
    >
      <div class="checkout-dialog">
        <div class="checkout-summary">
          <div class="summary-item" v-for="item in store.cartItems" :key="item.id">
            <span class="item-name">{{ item.name }} × {{ item.quantity }}</span>
            <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <el-divider />
          <div class="total-section">
            <span class="total-label">商品总价:</span>
            <span class="total-amount">¥{{ totalPrice }}</span>
          </div>
          <div class="total-section">
            <span class="total-label">运费:</span>
            <span class="total-amount">¥{{ shippingFee.toFixed(2) }}</span>
          </div>
          <div class="total-section" v-if="checkoutForm.usePoints > 0">
            <span class="total-label">积分抵扣:</span>
            <span class="total-amount">-¥{{ (checkoutForm.usePoints / 100).toFixed(2) }}</span>
          </div>
          <el-divider />
          <div class="total-section grand-total">
            <span class="total-label">应付总额:</span>
            <span class="total-amount">¥{{ grandTotal.toFixed(2) }}</span>
          </div>
        </div>
        
        <el-form :model="checkoutForm" label-width="80px" class="checkout-form">
          <el-form-item label="收货地址">
            <div class="address-actions">
              <el-select v-model="checkoutForm.address" placeholder="请选择收货地址">
                <el-option
                  v-for="addr in store.user.addresses"
                  :key="addr.id"
                  :label="`${addr.fullAddress} (${addr.receiver}, ${addr.phone})`"
                  :value="addr.id"
                />
              </el-select>
              <el-button type="text" @click="addressDialogVisible = true">管理地址</el-button>
            </div>
          </el-form-item>
          
          <el-form-item label="积分抵扣">
            <el-input-number 
              v-model="checkoutForm.usePoints" 
              :min="0" 
              :max="Math.min(store.user.points, totalPrice * 10)" 
              :step="100"
              placeholder="输入抵扣积分"
            />
            <span class="points-hint">可用积分: {{ store.user.points }} (100积分=1元)</span>
          </el-form-item>
          
          <el-form-item label="支付方式">
            <el-radio-group v-model="checkoutForm.payment">
              <el-radio label="wechat">微信支付</el-radio>
              <el-radio label="alipay">支付宝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="checkoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCheckout">确认支付</el-button>
      </template>
    </el-dialog>

    <!-- 地址管理弹窗 -->
    <el-dialog v-model="addressDialogVisible" title="收货地址">
      <div v-for="addr in store.user.addresses" :key="addr.id" class="address-item">
        <div class="address-content">
          <el-radio v-model="addr.isDefault" :label="true" @change="setDefaultAddress(addr.id)">
            默认
          </el-radio>
          <div class="address-info">
            <div>{{ addr.fullAddress }}</div>
            <div>{{ addr.receiver }} {{ addr.phone }}</div>
          </div>
          <el-button type="danger" size="small" @click="deleteAddress(addr.id)">删除</el-button>
        </div>
      </div>
      <el-divider />
      <el-form :model="newAddress">
        <el-form-item label="详细地址">
          <el-input v-model="newAddress.fullAddress" />
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="newAddress.receiver" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="newAddress.phone" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="newAddress.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAddress">添加地址</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { store } from '@/store/store'

const router = useRouter()

// 结算表单
const checkoutForm = ref({
  address: '',
  payment: 'wechat',
  usePoints: 0
})

// 运费
const shippingFee = ref(10.0)

// 结算弹窗显示状态
const checkoutDialogVisible = ref(false)

// 地址管理相关状态
const addressDialogVisible = ref(false)
const newAddress = reactive({
  fullAddress: '',
  receiver: '',
  phone: '',
  isDefault: false
})

// 计算总价
const totalPrice = computed(() => {
  return store.cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
})

// 计算总件数
const totalItems = computed(() => {
  return store.cartItems.reduce((total, item) => total + item.quantity, 0)
})

// 计算应付总额（含运费和积分抵扣）
const grandTotal = computed(() => {
  const pointsDiscount = checkoutForm.value.usePoints / 100
  return Math.max(0, parseFloat(totalPrice.value) + shippingFee.value - pointsDiscount)
})

// 处理数量变化
const handleQuantityChange = (index) => {
  store.updateQuantity(index, store.cartItems[index].quantity)
  ElMessage.success(`已更新 ${store.cartItems[index].name} 数量`)
}

// 删除商品
const removeItem = (index) => {
  ElMessageBox.confirm(
    `确定要删除 ${store.cartItems[index].name} 吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const removedItem = store.cartItems.splice(index, 1)
    ElMessage.success(`已删除 ${removedItem[0].name}`)
  }).catch(() => {
    // 用户取消
  })
}

// 显示结算弹窗
const showCheckoutDialog = () => {
  if (store.cartItems.length === 0) {
    ElMessage.warning('购物车为空，请先添加商品')
    return
  }
  
  if (!store.isLoggedIn) {
    ElMessage.warning('请先登录后再结算')
    router.push('/login')
    return
  }
  
  // 重置结算表单
  checkoutForm.value = {
    address: store.user.addresses.find(addr => addr.isDefault)?.id || '',
    payment: 'wechat',
    usePoints: 0
  }
  
  checkoutDialogVisible.value = true
}

// 确认结算
const confirmCheckout = () => {
  if (!checkoutForm.value.address) {
    ElMessage.error('请选择收货地址')
    return
  }
  
  // 检查余额是否足够
  if (store.user.balance < grandTotal.value) {
    ElMessage.error(`余额不足，当前余额 ¥${store.user.balance.toFixed(2)}，还需 ¥${(grandTotal.value - store.user.balance).toFixed(2)}`)
    return
  }
  
  ElMessageBox.confirm(
    `确认支付 ¥${grandTotal.value.toFixed(2)} 吗? (使用${checkoutForm.value.usePoints}积分抵扣¥${(checkoutForm.value.usePoints / 100).toFixed(2)})`,
    '确认支付',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 创建待支付订单
    const order = store.createPendingOrder(store.cartItems, checkoutForm.value.address)
    
    // 模拟支付流程
    setTimeout(() => {
      const paymentSuccess = store.payOrder(order.id, checkoutForm.value.usePoints)
      if (paymentSuccess) {
        ElMessage.success(`支付成功！订单已生成，获得${Math.floor(order.total / 10)}积分`)
      } else {
        ElMessage.error('支付失败，请重试')
      }
    }, 1000)
    
    checkoutDialogVisible.value = false
  }).catch(() => {
    // 用户取消支付，订单会保留在待支付中
    store.createPendingOrder(store.cartItems, checkoutForm.value.address)
    ElMessage.info('订单已保存到待支付')
  })
}

// 地址操作方法
const addAddress = () => {
  if (!newAddress.fullAddress || !newAddress.receiver || !newAddress.phone) {
    ElMessage.error('请填写完整的地址信息')
    return
  }
  
  store.addAddress(newAddress)
  ElMessage.success('地址添加成功')
  Object.assign(newAddress, {
    fullAddress: '',
    receiver: '',
    phone: '',
    isDefault: false
  })
}

const setDefaultAddress = (id) => {
  store.user.addresses.forEach(addr => {
    addr.isDefault = addr.id === id
  })
  ElMessage.success('默认地址已更新')
}

const deleteAddress = (id) => {
  ElMessageBox.confirm('确定要删除这个地址吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.deleteAddress(id)
    ElMessage.success('地址已删除')
  }).catch(() => {
    // 取消删除
  })
}

// 关闭弹窗前确认
const handleClose = (done) => {
  ElMessageBox.confirm('确定要取消结算吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    done()
  }).catch(() => {
    // 取消关闭
  })
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 去水果页面
const goToFruits = () => {
  router.push('/category')
}
</script>

<style scoped>
.cart-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 10px;
  padding-bottom: 120px; /* 为底部导航和结算栏留出空间 */
}

.cart-header {
  margin-bottom: 15px;
}

.cart-title {
  font-size: 18px;
  font-weight: bold;
}

.cart-items {
  display: grid;
  gap: 10px;
}

.cart-item {
  margin-bottom: 10px;
}

.item-content {
  display: flex;
  align-items: center;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 15px;
}

.cart-item-details {
  flex: 1;
}

.cart-item-name {
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.cart-item-price {
  font-size: 14px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 8px;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.remove-button {
  margin-left: auto;
}

/* 结算栏 */
.checkout-bar {
  position: fixed;
  bottom: 65px; /* 在底部导航上方 */
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 10px 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

.total-info {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-size: 12px;
  color: #909399;
}

.total-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.checkout-button {
  width: 120px;
  font-size: 14px;
}

/* 结算弹窗样式 */
.checkout-dialog {
  max-height: 60vh;
  overflow-y: auto;
}

.checkout-summary {
  margin-bottom: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.item-name {
  color: #606266;
}

.item-price {
  font-weight: bold;
}

.total-section {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 14px;
}

.total-label {
  color: #606266;
}

.total-amount {
  font-weight: bold;
}

.grand-total {
  font-size: 15px;
}

.grand-total .total-amount {
  color: #f56c6c;
  font-size: 16px;
}

.checkout-form {
  margin-top: 15px;
}

.el-form-item {
  margin-bottom: 15px;
}

/* 地址管理样式 */
.address-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.address-item {
  margin-bottom: 10px;
}

.address-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.address-info {
  flex: 1;
  font-size: 14px;
}

.points-hint {
  margin-left: 10px;
  font-size: 12px;
  color: #666;
}
</style>