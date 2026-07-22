<template>
  <view class="test-page">
    <view class="test-header">
      <text class="test-title">🧪 功能测试中心</text>
      <text class="test-subtitle">v2.0.0 · 小程序功能测试</text>
    </view>

    <view class="test-content">
      <!-- 用户信息 -->
      <view class="test-section">
        <view class="section-header">
          <text class="section-title">👤 用户信息</text>
          <view :class="['status-tag', isLoggedIn ? 'success' : 'danger']">
            <text>{{ isLoggedIn ? '已登录' : '未登录' }}</text>
          </view>
        </view>
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">用户名</text>
            <text class="info-value">{{ userInfo.nickname || '未登录' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">角色</text>
            <text class="info-value">{{ getRoleLabel(userInfo.role) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">部门</text>
            <text class="info-value">{{ userInfo.department || '-' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">用户ID</text>
            <text class="info-value">{{ userInfo.id || '-' }}</text>
          </view>
        </view>
      </view>

      <!-- 系统信息 -->
      <view class="test-section">
        <text class="section-title">📱 系统信息</text>
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">平台</text>
            <text class="info-value">{{ systemInfo.platform }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">系统版本</text>
            <text class="info-value">{{ systemInfo.system }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">屏幕宽度</text>
            <text class="info-value">{{ systemInfo.screenWidth }}px</text>
          </view>
          <view class="info-item">
            <text class="info-label">屏幕高度</text>
            <text class="info-value">{{ systemInfo.screenHeight }}px</text>
          </view>
        </view>
      </view>

      <!-- 存储测试 -->
      <view class="test-section">
        <text class="section-title">💾 存储测试</text>
        <view class="button-group">
          <view class="test-btn" @tap="testStorage">
            <text>写入存储</text>
          </view>
          <view class="test-btn secondary" @tap="readStorage">
            <text>读取存储</text>
          </view>
          <view class="test-btn danger" @tap="clearStorage">
            <text>清空存储</text>
          </view>
        </view>
        <view v-if="storageResult" class="result-box">
          <text class="result-text">{{ storageResult }}</text>
        </view>
      </view>

      <!-- 页面跳转测试 -->
      <view class="test-section">
        <text class="section-title">🚀 页面跳转</text>
        <view class="button-group">
          <view class="test-btn" @tap="goTo('ai-qa')">
            <text>🤖 AI 助手</text>
          </view>
          <view class="test-btn" @tap="goTo('monitor')">
            <text>📊 安全监测</text>
          </view>
          <view class="test-btn" @tap="goTo('news')">
            <text>📰 集团动态</text>
          </view>
          <view class="test-btn" @tap="goTo('training')">
            <text>📚 安全培训</text>
          </view>
          <view class="test-btn" @tap="goTo('profile')">
            <text>👤 个人中心</text>
          </view>
        </view>
      </view>

      <!-- UI 反馈测试 -->
      <view class="test-section">
        <text class="section-title">🔔 UI 反馈</text>
        <view class="button-group">
          <view class="test-btn success" @tap="showToast('success')">
            <text>成功 Toast</text>
          </view>
          <view class="test-btn warning" @tap="showToast('warning')">
            <text>警告 Toast</text>
          </view>
          <view class="test-btn danger" @tap="showToast('error')">
            <text>错误 Toast</text>
          </view>
          <view class="test-btn" @tap="showModal">
            <text>显示对话框</text>
          </view>
          <view class="test-btn secondary" @tap="showLoading">
            <text>显示加载</text>
          </view>
        </view>
      </view>

      <!-- AI 测试 -->
      <view class="test-section">
        <text class="section-title">🤖 AI 问答测试</text>
        <view class="button-group">
          <view class="test-btn" @tap="testAI('safety')">
            <text>安全知识测试</text>
          </view>
          <view class="test-btn" @tap="testAI('math')">
            <text>数学计算测试</text>
          </view>
          <view class="test-btn" @tap="testAI('physics')">
            <text>物理知识测试</text>
          </view>
          <view class="test-btn" @tap="testAI('realtime')">
            <text>实时信息测试</text>
          </view>
        </view>
        <view v-if="aiResult" class="result-box">
          <text class="result-text">{{ aiResult }}</text>
        </view>
      </view>

      <!-- 网络测试 -->
      <view class="test-section">
        <text class="section-title">🌐 网络测试</text>
        <view class="button-group">
          <view class="test-btn" @tap="testNetwork">
            <text>测试网络</text>
          </view>
          <view class="test-btn secondary" @tap="getNetworkType">
            <text>获取网络类型</text>
          </view>
        </view>
        <view v-if="networkResult" class="result-box">
          <text class="result-text">{{ networkResult }}</text>
        </view>
      </view>

      <!-- 设备测试 -->
      <view class="test-section">
        <text class="section-title">⚙️ 设备测试</text>
        <view class="button-group">
          <view class="test-btn" @tap="vibrate">
            <text>震动</text>
          </view>
          <view class="test-btn secondary" @tap="scanCode">
            <text>扫码</text>
          </view>
          <view class="test-btn" @tap="chooseImage">
            <text>选择图片</text>
          </view>
          <view class="test-btn secondary" @tap="setClipboard">
            <text>复制文本</text>
          </view>
        </view>
      </view>

      <!-- 危险操作 -->
      <view class="test-section danger-section">
        <text class="section-title">⚠️ 账户操作</text>
        <view v-if="isLoggedIn">
          <view class="test-btn warning" @tap="toggleRole">
            <text>切换角色（演示）</text>
          </view>
          <view class="test-btn danger" @tap="logout">
            <text>退出登录</text>
          </view>
        </view>
        <view v-else>
          <view class="test-btn" @tap="goLogin">
            <text>前往登录</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ask } from '@/services/rag-service'

const userStore = useUserStore()

const userInfo = reactive({
  id: '',
  nickname: '',
  role: '',
  department: ''
})

const systemInfo = reactive({
  platform: '',
  system: '',
  screenWidth: 0,
  screenHeight: 0
})

const storageResult = ref('')
const aiResult = ref('')
const networkResult = ref('')
const isLoggedIn = ref(false)

onMounted(() => {
  loadUserInfo()
  loadSystemInfo()
})

const loadUserInfo = () => {
  const user = userStore.user
  if (user) {
    userInfo.id = user.id
    userInfo.nickname = user.nickname
    userInfo.role = user.role
    userInfo.department = user.department || '-'
    isLoggedIn.value = true
  }
}

const loadSystemInfo = () => {
  try {
    const info = uni.getSystemInfoSync()
    systemInfo.platform = info.platform || 'unknown'
    systemInfo.system = info.system || 'unknown'
    systemInfo.screenWidth = info.screenWidth || 0
    systemInfo.screenHeight = info.screenHeight || 0
  } catch (e) {
    console.error('获取系统信息失败', e)
  }
}

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: '管理员',
    employee: '员工'
  }
  return labels[role] || '-'
}

const testStorage = () => {
  try {
    const data = {
      time: Date.now(),
      random: Math.random(),
      text: '测试数据'
    }
    uni.setStorageSync('test_data', JSON.stringify(data))
    storageResult.value = '✓ 存储成功：' + JSON.stringify(data)
  } catch (e: any) {
    storageResult.value = '✗ 存储失败：' + e.message
  }
}

const readStorage = () => {
  try {
    const value = uni.getStorageSync('test_data')
    if (value) {
      storageResult.value = '📖 读取成功：' + value
    } else {
      storageResult.value = '⚠️ 暂无数据'
    }
  } catch (e: any) {
    storageResult.value = '✗ 读取失败：' + e.message
  }
}

const clearStorage = () => {
  try {
    uni.clearStorageSync()
    storageResult.value = '🗑️ 存储已清空'
  } catch (e: any) {
    storageResult.value = '✗ 清空失败：' + e.message
  }
}

const goTo = (page: string) => {
  uni.redirectTo({ url: `/pages/${page}/index` })
}

const showToast = (type: string) => {
  const map: Record<string, { title: string; icon: any }> = {
    success: { title: '操作成功！', icon: 'success' },
    warning: { title: '请注意风险', icon: 'none' },
    error: { title: '出现错误', icon: 'error' }
  }
  const data = map[type] || map.success
  uni.showToast({ title: data.title, icon: data.icon })
}

const showModal = () => {
  uni.showModal({
    title: '测试对话框',
    content: '这是一个测试对话框，用于验证模态弹窗功能。',
    confirmText: '确定',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '点击了确定', icon: 'none' })
      } else {
        uni.showToast({ title: '点击了取消', icon: 'none' })
      }
    }
  })
}

const showLoading = () => {
  uni.showLoading({ title: '加载中...', mask: true })
  setTimeout(() => uni.hideLoading(), 2000)
}

const testAI = async (type: string) => {
  const questions: Record<string, string> = {
    safety: '电解槽的安全操作规程',
    math: '25 + 36 × 2',
    physics: '牛顿第二定律是什么',
    realtime: '今天是几号'
  }
  const question = questions[type] || '你好'
  aiResult.value = '🤔 思考中...'
  try {
    const response = await ask(question)
    aiResult.value = '✓ ' + response.answer.substring(0, 200) + (response.answer.length > 200 ? '...' : '')
  } catch (e: any) {
    aiResult.value = '✗ 调用失败：' + e.message
  }
}

const testNetwork = () => {
  uni.getNetworkType({
    success: (res) => {
      networkResult.value = '✓ 网络类型：' + res.networkType
    },
    fail: () => {
      networkResult.value = '✗ 获取失败'
    }
  })
}

const getNetworkType = () => {
  networkResult.value = '🔄 检查中...'
  testNetwork()
}

const vibrate = () => {
  uni.vibrateShort({ success: () => uni.showToast({ title: '震动成功', icon: 'none' }) })
}

const scanCode = () => {
  if (typeof uni.scanCode === 'function') {
    uni.scanCode({
      success: (res) => uni.showModal({ title: '扫码结果', content: res.result, showCancel: false }),
      fail: () => uni.showToast({ title: '取消扫码', icon: 'none' })
    })
  } else {
    uni.showToast({ title: '当前环境不支持', icon: 'none' })
  }
}

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      uni.showToast({ title: '已选择 ' + res.tempFilePaths.length + ' 张图片', icon: 'success' })
    }
  })
}

const setClipboard = () => {
  uni.setClipboardData({
    data: 'Safety AI - 安全生产智能助手',
    success: () => uni.showToast({ title: '已复制', icon: 'success' })
  })
}

const toggleRole = () => {
  userStore.toggleRole()
  loadUserInfo()
  uni.showToast({ title: '角色已切换', icon: 'none' })
}

const logout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('user')
        uni.reLaunch({ url: '/pages/login/index' })
      }
    }
  })
}

const goLogin = () => {
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.test-page {
  min-height: 100vh;
  background: $bg-secondary;
  padding: 24px 16px;
}

.test-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px 0;
}

.test-title {
  font-size: 28px;
  font-weight: 800;
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
}

.test-subtitle {
  font-size: 13px;
  color: $text-tertiary;
  display: block;
  margin-top: 8px;
}

.test-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.test-section {
  background: $bg-card;
  border-radius: 16px;
  padding: 20px;
  box-shadow: $shadow-card;
  border: 1px solid $border-subtle;
  
  &.danger-section {
    border-color: rgba(239, 68, 68, 0.2);
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, rgba(239, 68, 68, 0.05) 100%);
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 16px;
  
  .section-header & {
    margin-bottom: 0;
  }
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  &.success {
    background: rgba(16, 185, 129, 0.1);
    color: $success;
  }
  
  &.danger {
    background: rgba(239, 68, 68, 0.1);
    color: $danger;
  }
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid $border-light;
  font-size: 14px;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  color: $text-tertiary;
  font-size: 13px;
}

.info-value {
  color: $text-primary;
  font-weight: 500;
  font-size: 14px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-btn {
  background: $primary-gradient;
  border-radius: 12px;
  padding: 12px 16px;
  text-align: center;
  
  text {
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 500;
  }
  
  &.secondary {
    background: $bg-tertiary;
    
    text {
      color: $text-primary;
    }
  }
  
  &.success {
    background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  }
  
  &.warning {
    background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
  }
  
  &.danger {
    background: linear-gradient(135deg, #EF4444 0%, #F87171 100%);
  }
  
  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }
}

.result-box {
  margin-top: 12px;
  padding: 12px;
  background: rgba(30, 64, 175, 0.05);
  border-radius: 10px;
  border-left: 3px solid $primary;
}

.result-text {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.6;
  word-break: break-all;
}
</style>
