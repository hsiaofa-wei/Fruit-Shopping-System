<template>
  <div class="settings-container"> 
    <el-page-header @back="goBack" title="返回" class="settings-header">
      <template #content>
        <span class="settings-title">系统设置</span>
      </template>
    </el-page-header>

    <div class="settings-content">
      <el-card shadow="hover" class="settings-card">
        <div class="settings-item">
          <span>消息通知</span>
          <el-switch v-model="settings.notification" />
        </div>
        
        <div class="settings-item">
          <span>夜间模式</span>
          <el-switch v-model="settings.darkMode" />
        </div>
        
        <div class="settings-item">
          <span>字体大小</span>
          <el-select v-model="settings.fontSize" size="small">
            <el-option label="小" value="small" />
            <el-option label="中" value="medium" />
            <el-option label="大" value="large" />
          </el-select>
        </div>
        
        <div class="settings-item">
          <span>清除缓存</span>
          <el-button size="small" @click="clearCache">清除</el-button>
        </div>
        
        <div class="settings-item">
          <span>当前版本</span>
          <span class="version">v1.0.0</span>
        </div>
      </el-card>

      <el-card shadow="hover" class="settings-card">
        <h3>账号安全</h3>
        <div class="settings-item">
          <span>修改密码</span>
          <el-button size="small" @click="changePassword">修改</el-button>
        </div>
        <div class="settings-item">
          <span>绑定手机</span>
          <span>{{ store.user.phone }}</span>
        </div>
      </el-card>

      <el-card shadow="hover" class="settings-card">
        <h3>关于我们</h3>
        <p>水果购物系统致力于为您提供最新鲜、最优质的水果。</p>
        <p>如有任何建议或意见，请联系客服。</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store/store'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const settings = reactive({
  notification: true,
  darkMode: false,
  fontSize: 'medium'
})

const goBack = () => {
  router.go(-1)
}

const clearCache = () => {
  ElMessageBox.confirm('确定要清除缓存吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('缓存已清除')
  }).catch(() => {
    // 取消操作
  })
}

const changePassword = () => {
  ElMessage.info('跳转到修改密码页面')
}
</script>

<style scoped>
.settings-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 10px;
  padding-bottom: 70px;
}

.settings-header {
  margin-bottom: 15px;
}

.settings-title {
  font-size: 18px;
  font-weight: bold;
}

.settings-content {
  display: grid;
  gap: 15px;
}

.settings-card {
  padding: 15px;
}

.settings-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.settings-item:last-child {
  border-bottom: none;
}

.version {
  color: #909399;
}
</style>