<template>
  <view class="test-page">
    <view class="test-header">
      <text class="test-title">功能测试</text>
      <text class="test-subtitle">小程序测试页面</text>
    </view>

    <view class="test-content">
      <view class="test-section">
        <text class="section-title">用户信息</text>
        <view class="info-item">
          <text class="info-label">用户名:</text>
          <text class="info-value">{{ userInfo.nickname || '未登录' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">角色:</text>
          <text class="info-value">{{ userInfo.role || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">用户ID:</text>
          <text class="info-value">{{ userInfo.id || '-' }}</text>
        </view>
      </view>

      <view class="test-section">
        <text class="section-title">存储测试</text>
        <view class="test-btn" @tap="testStorage">
          <text class="btn-text">测试本地存储</text>
        </view>
        <text class="result-text">{{ storageResult }}</text>
      </view>

      <view class="test-section">
        <text class="section-title">页面跳转</text>
        <view class="test-btn" @tap="goToAIQA">
          <text class="btn-text">跳转到AI助手</text>
        </view>
        <view class="test-btn" @tap="goToMonitor">
          <text class="btn-text">跳转到监测页面</text>
        </view>
        <view class="test-btn" @tap="goToNews">
          <text class="btn-text">跳转到新闻页面</text>
        </view>
        <view class="test-btn" @tap="goToProfile">
          <text class="btn-text">跳转到个人中心</text>
        </view>
      </view>

      <view class="test-section">
        <text class="section-title">Toast测试</text>
        <view class="test-btn" @tap="showToast">
          <text class="btn-text">显示Toast</text>
        </view>
      </view>

      <view class="test-section">
        <text class="section-title">对话框测试</text>
        <view class="test-btn" @tap="showModal">
          <text class="btn-text">显示对话框</text>
        </view>
      </view>

      <view class="test-section">
        <text class="section-title">登录状态</text>
        <view class="login-status">
          <view class="status-dot" :class="{ active: isLoggedIn }"></view>
          <text class="status-text">{{ isLoggedIn ? '已登录' : '未登录' }}</text>
        </view>
        <view class="test-btn logout-btn" @tap="logout" v-if="isLoggedIn">
          <text class="btn-text">退出登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const userInfo = reactive({
  id: '',
  nickname: '',
  role: ''
})

const storageResult = ref('')
const isLoggedIn = ref(false)

onMounted(() => {
  loadUserInfo()
})

const loadUserInfo = () => {
  try {
    const userStr = uni.getStorageSync('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      userInfo.id = user.id
      userInfo.nickname = user.nickname
      userInfo.role = user.role
      isLoggedIn.value = true
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
}

const testStorage = () => {
  try {
    uni.setStorageSync('test_key', 'test_value')
    const value = uni.getStorageSync('test_key')
    if (value === 'test_value') {
      storageResult.value = '✓ 本地存储测试成功'
    } else {
      storageResult.value = '✗ 本地存储测试失败'
    }
  } catch (e) {
    storageResult.value = '✗ 存储异常: ' + e
  }
}

const goToAIQA = () => {
  uni.redirectTo({ url: '/pages/ai-qa/index' })
}

const goToMonitor = () => {
  uni.redirectTo({ url: '/pages/monitor/index' })
}

const goToNews = () => {
  uni.redirectTo({ url: '/pages/news/index' })
}

const goToProfile = () => {
  uni.redirectTo({ url: '/pages/profile/index' })
}

const showToast = () => {
  uni.showToast({
    title: '测试成功！',
    icon: 'success'
  })
}

const showModal = () => {
  uni.showModal({
    title: '测试对话框',
    content: '这是一个测试对话框',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '点击了确定', icon: 'none' })
      } else {
        uni.showToast({ title: '点击了取消', icon: 'none' })
      }
    }
  })
}

const logout = () => {
  uni.removeStorageSync('user')
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
.test-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.test-header {
  text-align: center;
  margin-bottom: 32px;
}

.test-title {
  font-size: 28px;
  font-weight: 700;
  color: #1E40AF;
  display: block;
}

.test-subtitle {
  font-size: 14px;
  color: #94A3B8;
  display: block;
  margin-top: 8px;
}

.test-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.test-section {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1E40AF;
  display: block;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 15px;
  color: #64748B;
}

.info-value {
  font-size: 15px;
  color: #1E293B;
  font-weight: 500;
}

.test-btn {
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &.logout-btn {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  }
}

.btn-text {
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
}

.result-text {
  font-size: 14px;
  color: #22C55E;
  text-align: center;
  display: block;
  margin-top: 12px;
}

.login-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #EF4444;
  
  &.active {
    background: #22C55E;
  }
}

.status-text {
  font-size: 15px;
  color: #1E293B;
  font-weight: 500;
}
</style>
