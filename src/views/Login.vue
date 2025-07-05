<template>
  <div class="user-center-container">
    <!-- 顶部用户信息 -->
    <div class="user-header">
      <div class="user-basic">
        <div class="user-avatar" @click="profileDialogVisible = true">
          {{ store.user.name.charAt(0) }}
        </div>
        <div>
          <div class="user-name">{{ store.user.name }}</div>
          <div class="user-level">黄金会员</div>
        </div>
      </div>
      
      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-value" @click="showBalanceDialog">
            ¥{{ store.user.balance.toFixed(2) }}
          </div>
          <div class="stat-label">余额</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" @click="showPointsDialog">
            {{ store.user.points }}
          </div>
          <div class="stat-label">积分</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" @click="showCouponDialog">
            0
          </div>
          <div class="stat-label">优惠券</div>
        </div>
      </div>
    </div>
    
    <!-- 订单状态 -->
    <div class="order-status">
      <div class="section-title">
        <h3>我的订单</h3>
        <router-link to="/orders">查看全部 &gt;</router-link>
      </div>
      <div class="status-icons">
        <div 
          class="status-item" 
          v-for="item in orderStatus" 
          :key="item.id"
          @click="handleOrderStatusClick(item.id)"
        >
          <div class="status-icon">
            <span>{{ item.icon }}</span>
            <span v-if="item.badge" class="badge">{{ item.badge }}</span>
          </div>
          <div class="status-label">{{ item.label }}</div>
        </div>
      </div>
    </div>
    
    <!-- 功能列表 -->
    <div class="menu-list">
      <div 
        class="menu-item" 
        v-for="item in menuItems" 
        :key="item.id"
        @click="handleMenuItemClick(item.id)"
      >
        <div class="menu-icon">{{ item.icon }}</div>
        <div class="menu-label">{{ item.label }}</div>
        <div class="menu-arrow">›</div>
      </div>
    </div>

    <!-- 退出按钮 -->
    <div class="logout-container">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>

    <!-- 余额详情弹窗 -->
    <el-dialog v-model="balanceDialogVisible" title="余额详情" width="90%">
      <div class="balance-actions">
        <el-button type="primary" @click="showRechargeDialog">充值</el-button>
      </div>
      
      <el-table :data="store.user.transactions.filter(t => t.type === 'recharge' || t.type === 'order')">
        <el-table-column prop="date" label="日期" width="120">
          <template #default="{row}">
            {{ new Date(row.date).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{row}">
            {{ 
              row.type === 'recharge' ? '充值' : 
              row.type === 'order' ? '消费' : 
              row.type 
            }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{row}">
            <span :style="{color: row.type === 'recharge' ? '#67C23A' : '#F56C6C'}">
              {{ row.type === 'recharge' ? '+' : '-' }}{{ row.amount.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" width="100">
          <template #default="{row}">
            {{ row.balance.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注">
          <template #default="{row}">
            {{ row.type === 'order' ? `订单#${row.orderId}` : '账户充值' }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增充值弹窗 -->
    <el-dialog v-model="rechargeDialogVisible" title="账户充值" width="90%">
      <el-form :model="rechargeForm">
        <el-form-item label="充值金额">
          <el-input-number 
            v-model="rechargeForm.amount" 
            :min="10" 
            :max="10000" 
            :step="100"
            placeholder="输入充值金额"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rechargeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRecharge">确认充值</el-button>
      </template>
    </el-dialog>

    <!-- 积分详情弹窗 -->
    <el-dialog v-model="pointsDialogVisible" title="积分详情" width="90%">
      <el-table :data="store.user.transactions.filter(t => t.points)">
        <el-table-column prop="date" label="日期" width="120">
          <template #default="{row}">
            {{ new Date(row.date).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="100">
          <template #default="{row}">
            {{ row.points > 0 ? '+' : '' }}{{ row.points }}
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注">
          <template #default="{row}">
            {{ row.type === 'order' ? `订单#${row.orderId}` : '其他' }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="pointsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 优惠券弹窗 -->
    <el-dialog v-model="couponDialogVisible" title="我的优惠券" width="90%">
      <el-empty description="暂无优惠券" />
      <template #footer>
        <el-button @click="couponDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="orderDialogVisible" :title="`订单详情 - ${orderStatusText[selectedOrderStatus]}`" width="90%">
      <div v-if="selectedOrder" class="order-detail">
        <div class="order-info">
          <p><strong>订单编号:</strong> #{{ selectedOrder.id }}</p>
          <p><strong>下单时间:</strong> {{ new Date(selectedOrder.createdAt).toLocaleString() }}</p>
          <p><strong>收货地址:</strong> {{ selectedOrder.address.fullAddress }} ({{ selectedOrder.address.receiver }}, {{ selectedOrder.address.phone }})</p>
          <p><strong>订单总额:</strong> ¥{{ selectedOrder.total.toFixed(2) }}</p>
        </div>
        
        <el-divider />
        
        <div class="order-items">
          <h4>商品清单</h4>
          <div v-for="item in selectedOrder.items" :key="item.id" class="order-item">
            <el-image :src="item.imageUrl" class="item-image" fit="cover" />
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">¥{{ item.price }} × {{ item.quantity }}</div>
            </div>
          </div>
        </div>
        
        <el-divider />
        
        <div class="order-actions" v-if="selectedOrderStatus === 'pending'">
          <el-button type="primary" @click="payOrder(selectedOrder.id)">立即支付</el-button>
          <el-button @click="cancelOrder(selectedOrder.id)">取消订单</el-button>
        </div>
        
        <div class="order-actions" v-if="selectedOrderStatus === 'paid' || selectedOrderStatus === 'shipping'">
          <el-button type="success" @click="confirmReceipt(selectedOrder.id)" v-if="selectedOrderStatus === 'shipping'">
            确认收货
          </el-button>
          <el-button @click="applyRefund(selectedOrder.id)">申请退款</el-button>
        </div>
        
        <div class="order-actions" v-if="selectedOrderStatus === 'completed'">
          <el-button type="primary" @click="rateOrder(selectedOrder.id)">评价订单</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="orderDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑个人信息弹窗 -->
    <el-dialog v-model="profileDialogVisible" title="编辑个人信息" width="90%">
      <el-form :model="profileForm">
        <el-form-item label="昵称">
          <el-input v-model="profileForm.name" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="profileForm.phone" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload action="#" :show-file-list="false">
            <el-button type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateProfile">保存</el-button>
      </template>
    </el-dialog>

    <!-- 地址管理弹窗 -->
    <el-dialog v-model="addressDialogVisible" title="收货地址" width="90%">
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
import { store } from '@/store/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router' // 添加这行
const router = useRouter() // 添加这行
// 订单状态文本
const orderStatusText = {
  pending: '待付款',
  paid: '待发货',
  shipping: '待收货',
  completed: '已完成',
  canceled: '已取消'
}

// 订单状态数据
const orderStatus = computed(() => [
  { id: 1, icon: '◔', label: '待付款', badge: store.orders.pending.length },      // 空心圆带点（表示未完成）
  { id: 2, icon: '▣', label: '待发货', badge: store.orders.paid.length },       // 方形（表示打包）
  { id: 3, icon: '⇨', label: '待收货', badge: store.orders.shipping.length },    // 右箭头（表示运输中）
  { id: 4, icon: '✓', label: '待评价', badge: store.orders.completed.length },    // 对勾（表示已完成）
  { id: 5, icon: '↩', label: '退换货', badge: store.orders.canceled.length }      // 循环箭头（表示退换）
])
const menuItems = [
  { id: 1, icon: '♡', label: '我的收藏' },   // 星形（中性收藏）
  { id: 2, icon: '⌂', label: '收货地址' },   // 房屋符号（极简地址）
  { id: 3, icon: '⬒', label: '优惠券' },    // 百分比（表示折扣）
  { id: 4, icon: '✆', label: '联系客服' },   // 电话符号（简约版）
  { id: 5, icon: '⚙', label: '设置' }       // 中性设置符号
]
// 弹窗状态
const balanceDialogVisible = ref(false)
const pointsDialogVisible = ref(false)
const couponDialogVisible = ref(false)
const orderDialogVisible = ref(false)
const selectedOrderStatus = ref('')
const selectedOrder = ref(null)
const profileDialogVisible = ref(false)
const addressDialogVisible = ref(false)

// 表单数据
const profileForm = reactive({
  name: store.user.name,
  phone: store.user.phone,
  avatar: store.user.avatar
})

const newAddress = reactive({
  fullAddress: '',
  receiver: '',
  phone: '',
  isDefault: false
})

// 显示余额详情
const showBalanceDialog = () => {
  balanceDialogVisible.value = true
}

// 显示积分详情
const showPointsDialog = () => {
  pointsDialogVisible.value = true
}

// 显示优惠券详情
const showCouponDialog = () => {
  couponDialogVisible.value = true
}

// 处理订单状态点击
const handleOrderStatusClick = (id) => {
  let status = ''
  switch(id) {
    case 1: status = 'pending'; break
    case 2: status = 'paid'; break
    case 3: status = 'shipping'; break
    case 4: status = 'completed'; break
    case 5: status = 'canceled'; break
  }
  
  selectedOrderStatus.value = status
  selectedOrder.value = store.orders[status][0] || null
  orderDialogVisible.value = true
}

// 订单操作
const payOrder = (orderId) => {
  ElMessage.success('跳转到支付页面')
}

const cancelOrder = (orderId) => {
  ElMessageBox.confirm('确定要取消这个订单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const orderIndex = store.orders.pending.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
      const [order] = store.orders.pending.splice(orderIndex, 1)
      order.status = 'canceled'
      store.orders.canceled.push(order)
      ElMessage.success('订单已取消')
      orderDialogVisible.value = false
    }
  }).catch(() => {})
}

const confirmReceipt = (orderId) => {
  ElMessageBox.confirm('确认收到商品了吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const orderIndex = store.orders.shipping.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
      const [order] = store.orders.shipping.splice(orderIndex, 1)
      order.status = 'completed'
      store.orders.completed.push(order)
      ElMessage.success('收货确认成功')
      orderDialogVisible.value = false
    }
  }).catch(() => {})
}

const applyRefund = (orderId) => {
  ElMessage.info('跳转到退款申请页面')
}

const rateOrder = (orderId) => {
  ElMessage.info('跳转到评价页面')
}

// 处理菜单项点击
const handleMenuItemClick = (id) => {
  switch(id) {
    case 1: // 我的收藏
      router.push('/favorites')
      break
    case 2: // 收货地址
      addressDialogVisible.value = true
      break
    case 3: // 优惠券
      showCouponDialog()
      break
    case 4: // 联系客服
      router.push('/customerservice')
      break
    case 5: // 设置
      router.push('/settings')
      break
  }
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
  }).catch(() => {})
}

// 更新个人信息
const updateProfile = () => {
  store.updateProfile(profileForm)
  profileDialogVisible.value = false
  ElMessage.success('个人信息更新成功')
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.logout()
    ElMessage.success('已退出登录')
  }).catch(() => {})
}
// 充值相关状态
const rechargeDialogVisible = ref(false)
const rechargeForm = reactive({
  amount: 100
})

// 显示充值弹窗
const showRechargeDialog = () => {
  rechargeDialogVisible.value = true
}

// 处理充值
const handleRecharge = () => {
  if (rechargeForm.amount < 10) {
    ElMessage.error('充值金额不能少于10元')
    return
  }
  
  store.recharge(rechargeForm.amount)
  ElMessage.success(`充值成功! 当前余额: ¥${store.user.balance.toFixed(2)}`)
  rechargeDialogVisible.value = false
  rechargeForm.amount = 100 // 重置充值金额
}
</script>

<style scoped>
.user-center-container {
  padding-bottom: 60px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部用户信息 */
.user-header {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  padding: 20px 15px 60px;
  position: relative;
  margin-bottom: 40px;
}

.user-basic {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #FFD700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
  border: 3px solid rgba(255,255,255,0.3);
  cursor: pointer;
  transition: transform 0.3s;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.user-level {
  font-size: 12px;
  background-color: rgba(255,215,0,0.2);
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

.user-stats {
  display: flex;
  background-color: white;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: absolute;
  bottom: -34px;
  left: 15px;
  right: 15px;
}

.stat-item {
  flex: 1;
  text-align: center;
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 30px;
  background-color: #eee;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 3px;
  cursor: pointer;
  transition: color 0.3s;
}

.stat-value:hover {
  color: #FFD700;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* 订单状态样式 */
.order-status {
  background-color: white;
  margin: 15px;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 500;
}

.section-title a {
  font-size: 12px;
  color: #999;
  text-decoration: none;
}

.status-icons {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.status-item {
  padding: 5px;
  cursor: pointer;
}

.status-icon {
  width: 40px;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 5px;
  color: #4CAF50;
  font-size: 20px;
  position: relative;
}

.status-label {
  font-size: 12px;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 菜单列表样式 */
.menu-list {
  background-color: white;
  margin: 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  font-size: 18px;
}

.menu-label {
  flex: 1;
  font-size: 14px;
}

.menu-arrow {
  color: #ccc;
  font-size: 16px;
}

/* 退出按钮样式 */
.logout-container {
  margin: 15px;
  text-align: center;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

/* 订单详情样式 */
.order-detail {
  padding: 10px;
}

.order-info p {
  margin-bottom: 8px;
  line-height: 1.6;
}

.order-items {
  margin-top: 15px;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
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
  font-weight: bold;
  margin-bottom: 5px;
}

.item-price {
  color: #f56c6c;
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* 地址管理样式 */
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

.address-info div:first-child {
  font-weight: 500;
}

.address-info div:last-child {
  color: #666;
  font-size: 12px;
}
</style> 