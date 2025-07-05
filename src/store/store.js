// store.js
import { reactive } from 'vue'

export const store = reactive({
  // 用户信息
  user: {
    name: '张三',
    phone: '13800138000',
    avatar: '',
    balance: 2024.58,
    points: 1250,
    addresses: [
      {
        id: 1,
        fullAddress: "北京市朝阳区建国路88号现代城A座1001室",
        receiver: "张三",
        phone: "13800138000",
        isDefault: true
      },
      {
        id: 2,
        fullAddress: "上海市浦东新区张江高科技园区科苑路88号",
        receiver: "李四",
        phone: "13900139000",
        isDefault: false
      }
    ],
    favorites: [],
    transactions: []
  },
  
  // 订单状态
  orders: {
    pending: [],    // 待支付
    paid: [],       // 已支付待发货
    shipping: [],   // 待收货
    completed: [],  // 已完成
    canceled: []     // 已取消
  },
  
  // 购物车
  cartItems: [],
  
  // 登录状态
  isLoggedIn: true,
  
  // 用户操作
  login(userData) {
    // 模拟登录验证
    const user = this.users.find(u => 
      u.username === userData.username && 
      u.password === userData.password
    )
    
    if (user) {
      this.user = { ...this.user, ...user }
      this.isLoggedIn = true
      return true
    }
    return false
  },
  
  register(userData) {
    // 检查用户名是否已存在
    if (this.users.some(u => u.username === userData.username)) {
      return false
    }
    
    // 添加新用户
    const newUser = {
      id: Date.now(),
      username: userData.username,
      password: userData.password,
      name: userData.username,
      phone: '',
      avatar: '',
      balance: 0,
      points: 0,
      addresses: [],
      favorites: [],
      transactions: []
    }
    
    this.users.push(newUser)
    return true
  },
  
  logout() {
    this.isLoggedIn = false
  },
  
  // 购物车操作
  addToCart(item) {
    const existingItem = this.cartItems.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.cartItems.push({ ...item, quantity: 1 })
    }
  },
  
  updateQuantity(index, quantity) {
    this.cartItems[index].quantity = quantity
  },
  
  // 收藏操作
  toggleFavorite(fruit) {
    const index = this.user.favorites.findIndex(f => f.id === fruit.id)
    if (index !== -1) {
      this.user.favorites.splice(index, 1)
      return false
    } else {
      this.user.favorites.push({
        id: fruit.id,
        name: fruit.name,
        price: fruit.price,
        image: fruit.image || fruit.imgUrl,
        origin: fruit.origin
      })
      return true
    }
  },
  
  isFavorite(fruitId) {
    return this.user.favorites.some(f => f.id === fruitId)
  },
  
  // 订单操作
  createPendingOrder(cartItems, addressId) {
    const order = {
      id: Date.now(),
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      address: this.user.addresses.find(addr => addr.id === addressId),
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    this.orders.pending.push(order)
    this.cartItems = []
    return order
  },
  
  payOrder(orderId, usePoints = 0) {
    const orderIndex = this.orders.pending.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
      const [order] = this.orders.pending.splice(orderIndex, 1)
      
      // 计算积分抵扣和获得
      const pointsDiscount = usePoints / 100
      const pointsEarned = Math.floor(order.total / 10)
      
      // 更新用户余额和积分
      this.user.balance -= (order.total - pointsDiscount)
      this.user.points = this.user.points - usePoints + pointsEarned
      
      // 记录交易
      this.user.transactions.push({
        type: 'order',
        amount: order.total,
        balance: this.user.balance,
        points: pointsEarned,
        date: new Date().toISOString(),
        orderId: order.id
      })
      
      order.status = 'paid'
      this.orders.paid.push(order)
      return true
    }
    return false
  },

  cancelOrder(orderId) {
    let canceledOrder = null
    
    // 检查待付款订单
    const pendingIndex = this.orders.pending.findIndex(o => o.id === orderId)
    if (pendingIndex !== -1) {
      [canceledOrder] = this.orders.pending.splice(pendingIndex, 1)
    } 
    // 检查已付款订单
    else {
      const paidIndex = this.orders.paid.findIndex(o => o.id === orderId)
      if (paidIndex !== -1) {
        [canceledOrder] = this.orders.paid.splice(paidIndex, 1)
      }
    }
    
    if (canceledOrder) {
      canceledOrder.status = 'canceled'
      this.orders.canceled.push(canceledOrder)
      
      // 如果是已付款订单，退款到余额
      if (canceledOrder.status === 'paid') {
        this.user.balance += canceledOrder.total
        this.user.transactions.push({
          type: 'refund',
          amount: canceledOrder.total,
          balance: this.user.balance,
          date: new Date().toISOString(),
          orderId: canceledOrder.id
        })
      }
      
      return true
    }
    return false
  },

  confirmReceipt(orderId) {
    const shippingIndex = this.orders.shipping.findIndex(o => o.id === orderId)
    if (shippingIndex !== -1) {
      const [completedOrder] = this.orders.shipping.splice(shippingIndex, 1)
      completedOrder.status = 'completed'
      this.orders.completed.push(completedOrder)
      
      // 记录交易完成
      this.user.transactions.push({
        type: 'order_completed',
        orderId: completedOrder.id,
        date: new Date().toISOString()
      })
      
      return true
    }
    return false
  },
  
  // 用户信息操作
  updateProfile(profileData) {
    this.user = { ...this.user, ...profileData }
  },
  
  // 地址操作
  addAddress(address) {
    const newAddress = {
      id: Date.now(),
      ...address,
      isDefault: this.user.addresses.length === 0
    }
    this.user.addresses.push(newAddress)
    return newAddress
  },
  
  updateAddress(id, newData) {
    const index = this.user.addresses.findIndex(addr => addr.id === id)
    if (index !== -1) {
      this.user.addresses[index] = { ...this.user.addresses[index], ...newData }
    }
  },
  
  deleteAddress(id) {
    const index = this.user.addresses.findIndex(addr => addr.id === id)
    if (index !== -1) {
      this.user.addresses.splice(index, 1)
    }
  },
  
  // 充值操作
  recharge(amount) {
    this.user.balance += amount
    this.user.transactions.push({
      type: 'recharge',
      amount: amount,
      balance: this.user.balance,
      date: new Date().toISOString()
    })
  },
  
  // 获取订单详情
  getOrderDetails(id) {
    for (const status in this.orders) {
      const order = this.orders[status].find(o => o.id === id)
      if (order) return { ...order, status }
    }
    return null
  }
})