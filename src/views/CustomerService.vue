<template>
  <div class="service-container">
    <el-page-header @back="goBack" title="返回" class="service-header">
      <template #content>
        <span class="service-title">联系客服</span>
      </template>
    </el-page-header>

    <div class="service-content">
      <el-card shadow="hover" class="service-card">
        <h3>客服热线</h3>
        <p class="service-phone">400-123-4567</p>
        <p>工作时间: 9:00-21:00</p>
      </el-card>

      <el-card shadow="hover" class="service-card">
        <h3>在线客服</h3>
        <el-button type="primary" @click="startChat">开始在线咨询</el-button>
        <p>工作时间: 9:00-21:00</p>
      </el-card>

      <el-card shadow="hover" class="service-card">
        <h3>常见问题</h3>
        <el-collapse v-model="activeFaq">
          <el-collapse-item title="如何查询订单状态?" name="1">
            <div>登录后进入"我的订单"页面即可查看订单状态。</div>
          </el-collapse-item>
          <el-collapse-item title="商品有质量问题怎么办?" name="2">
            <div>请在签收后48小时内联系客服处理，需提供商品照片。</div>
          </el-collapse-item>
          <el-collapse-item title="如何申请退款?" name="3">
            <div>在"我的订单"中找到对应订单，点击"申请退款"按钮。</div>
          </el-collapse-item>
          <el-collapse-item title="配送范围和时间?" name="4">
            <div>全国配送，一般1-3天送达，具体时间以物流信息为准。</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeFaq = ref([])

const goBack = () => {
  router.go(-1)
}

const startChat = () => {
  ElMessage.info('正在连接客服，请稍候...')
}
</script>

<style scoped>
.service-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 10px;
  padding-bottom: 70px;
}

.service-header {
  margin-bottom: 15px;
}

.service-title {
  font-size: 18px;
  font-weight: bold;
}

.service-content {
  display: grid;
  gap: 15px;
}

.service-card {
  padding: 15px;
}

.service-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.service-phone {
  font-size: 20px;
  font-weight: bold;
  color: #67C23A;
  margin: 10px 0;
}
</style>