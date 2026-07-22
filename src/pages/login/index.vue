<template>
  <view class="login-page">
    <view class="bg-decoration">
      <view class="bg-circle bg-circle-1"></view>
      <view class="bg-circle bg-circle-2"></view>
      <view class="bg-circle bg-circle-3"></view>
    </view>

    <view class="login-container">
      <view class="login-header">
        <view class="logo-wrapper">
          <view class="logo">
            <text class="logo-icon">🏭</text>
          </view>
          <view class="logo-glow"></view>
        </view>
        <text class="title">Safety AI</text>
        <text class="subtitle">企业安全生产智能平台</text>
        <view class="version-tag">v2.0.0</view>
      </view>

      <view class="form-container">
        <view class="form-tabs">
          <view :class="['form-tab', { active: loginMode === 'account' }]" @tap="loginMode = 'account'">
            <text>账号登录</text>
          </view>
          <view :class="['form-tab', { active: loginMode === 'quick' }]" @tap="loginMode = 'quick'">
            <text>快速登录</text>
          </view>
        </view>

        <view v-if="loginMode === 'account'" class="form-content">
          <view class="form-item">
            <view class="input-wrapper">
              <text class="input-icon">👤</text>
              <input
                class="input-field"
                :value="username"
                @input="onUsernameInput"
                placeholder="请输入用户名"
                placeholder-class="input-placeholder"
                :maxlength="20"
              />
              <view v-if="username" class="clear-icon" @tap="username = ''">×</view>
            </view>
          </view>

          <view class="form-item">
            <view class="input-wrapper">
              <text class="input-icon">🔒</text>
              <input
                class="input-field"
                :value="password"
                @input="onPasswordInput"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                placeholder-class="input-placeholder"
                :maxlength="32"
              />
              <view class="toggle-password" @tap="showPassword = !showPassword">
                <text>{{ showPassword ? '🙈' : '👁️' }}</text>
              </view>
            </view>
          </view>

          <view class="form-options">
            <view class="remember-me" @tap="rememberMe = !rememberMe">
              <view :class="['checkbox', { checked: rememberMe }]">
                <text v-if="rememberMe" class="check-icon">✓</text>
              </view>
              <text class="option-text">记住我</text>
            </view>
            <view class="forgot-password" @tap="showForgotDialog">
              <text>忘记密码？</text>
            </view>
          </view>

          <view class="login-btn" :class="{ disabled: loading }" @tap="handleLogin">
            <text v-if="!loading" class="login-btn-text">登 录</text>
            <view v-else class="loading-content">
              <view class="loading-spinner"></view>
              <text class="login-btn-text">登录中...</text>
            </view>
          </view>

          <view class="register-link" @tap="goToRegister">
            <text class="link-text">还没有账号？<text class="link-highlight">立即注册</text></text>
          </view>
        </view>

        <view v-else class="form-content">
          <view class="quick-intro">
            <text class="intro-icon">⚡</text>
            <text class="intro-text">选择测试账号，一键体验不同角色功能</text>
          </view>

          <view class="quick-list">
            <view
              v-for="cred in quickCredentials"
              :key="cred.username"
              :class="['quick-item', cred.role]"
              @tap="quickLogin(cred.username, cred.password)"
            >
              <view class="quick-avatar">
                <text>{{ cred.nickname.charAt(0) }}</text>
              </view>
              <view class="quick-info">
                <text class="quick-name">{{ cred.nickname }}</text>
                <text class="quick-role">{{ cred.role === 'admin' ? '管理员' : '员工' }}</text>
              </view>
              <view class="quick-arrow">→</view>
            </view>
          </view>
        </view>
      </view>

      <view class="footer-text">
        <text>登录即表示同意</text>
        <text class="link-highlight" @tap="showAgreement('user')">《用户协议》</text>
        <text>和</text>
        <text class="link-highlight" @tap="showAgreement('privacy')">《隐私政策》</text>
      </view>
    </view>

    <view v-if="showDialog" class="dialog-mask" @tap="showDialog = false">
      <view class="dialog" @tap.stop>
        <text class="dialog-title">{{ dialogTitle }}</text>
        <text class="dialog-content">{{ dialogContent }}</text>
        <view class="dialog-btn" @tap="showDialog = false">
          <text>我知道了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const loginMode = ref<'account' | 'quick'>('account')
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogContent = ref('')

const quickCredentials = [
  { username: 'admin', password: 'admin123', role: 'admin', nickname: '管理员' },
  { username: 'user', password: 'user123', role: 'employee', nickname: '员工' },
  { username: 'test', password: 'test123', role: 'employee', nickname: '测试员' },
  { username: 'demo', password: 'demo123', role: 'employee', nickname: '演示账户' }
]

onMounted(() => {
  const savedUsername = uni.getStorageSync('saved_username')
  const savedPassword = uni.getStorageSync('saved_password')
  const savedRemember = uni.getStorageSync('saved_remember') === 'true'
  if (savedRemember && savedUsername) {
    username.value = savedUsername
    if (savedPassword) password.value = savedPassword
    rememberMe.value = true
  }
})

const onUsernameInput = (e: any) => {
  username.value = e.detail.value
}

const onPasswordInput = (e: any) => {
  password.value = e.detail.value
}

const showForgotDialog = () => {
  showCustomDialog('找回密码', '请联系系统管理员重置密码，或使用快速登录体验测试账号。')
}

const showAgreement = (type: 'user' | 'privacy') => {
  if (type === 'user') {
    showCustomDialog('用户协议', '本平台为安全AI助手，您应遵守相关法律法规，不得用于非法用途。')
  } else {
    showCustomDialog('隐私政策', '我们重视您的隐私，不会收集您的敏感信息，所有数据均在本地处理。')
  }
}

const showCustomDialog = (title: string, content: string) => {
  dialogTitle.value = title
  dialogContent.value = content
  showDialog.value = true
}

const handleLogin = async () => {
  if (loading.value) return

  if (!username.value.trim() || !password.value.trim()) {
    uni.showToast({ title: '请输入用户名和密码', icon: 'none' })
    return
  }

  loading.value = true

  await new Promise(resolve => setTimeout(resolve, 500))

  const cred = quickCredentials.find(c => c.username === username.value.toLowerCase())
  if (!cred) {
    loading.value = false
    uni.showToast({ title: '用户名不存在', icon: 'none' })
    return
  }

  if (cred.password !== password.value) {
    loading.value = false
    uni.showToast({ title: '密码错误', icon: 'none' })
    return
  }

  if (rememberMe.value) {
    uni.setStorageSync('saved_username', username.value)
    uni.setStorageSync('saved_password', password.value)
    uni.setStorageSync('saved_remember', 'true')
  } else {
    uni.removeStorageSync('saved_username')
    uni.removeStorageSync('saved_password')
    uni.setStorageSync('saved_remember', 'false')
  }

  uni.setStorageSync('user', JSON.stringify({
    id: cred.username === 'admin' ? '1' : cred.username === 'user' ? '2' : '3',
    nickname: cred.nickname,
    role: cred.role
  }))

  uni.showToast({ title: '登录成功', icon: 'success' })

  setTimeout(() => {
    loading.value = false
    uni.reLaunch({ url: '/pages/ai-qa/index' })
  }, 800)
}

const quickLogin = (uname: string, pwd: string) => {
  username.value = uname
  password.value = pwd
  handleLogin()
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/register/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E40AF 0%, #2563EB 50%, #F8FAFC 100%);
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.bg-circle-2 {
  width: 300px;
  height: 300px;
  bottom: 20%;
  left: -100px;
  animation: float 15s ease-in-out infinite reverse;
}

.bg-circle-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  right: 20%;
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 80px 24px 32px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-wrapper {
  position: relative;
  width: 88px;
  height: 88px;
  margin: 0 auto 20px;
}

.logo {
  width: 88px;
  height: 88px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
}

.logo-icon {
  font-size: 44px;
}

.logo-glow {
  position: absolute;
  inset: -8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 32px;
  filter: blur(20px);
  z-index: 0;
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.title {
  font-size: 32px;
  font-weight: 800;
  color: #FFFFFF;
  display: block;
  margin-bottom: 8px;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #FFFFFF 0%, #DBEAFE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  display: block;
  font-weight: 500;
}

.version-tag {
  display: inline-block;
  margin-top: 8px;
  padding: 2px 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-container {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 24px 24px 28px;
  box-shadow: 0 20px 40px rgba(30, 64, 175, 0.15);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-tabs {
  display: flex;
  background: $bg-tertiary;
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 24px;
}

.form-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: $text-tertiary;
  border-radius: 10px;
  transition: all $transition-normal;
  
  &.active {
    background: #FFFFFF;
    color: $primary;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  }
}

.form-content {
  flex: 1;
}

.form-item {
  margin-bottom: 16px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: $bg-tertiary;
  border-radius: 14px;
  padding: 12px 14px;
  border: 1.5px solid transparent;
  transition: all $transition-normal;
  
  &:focus-within {
    background: $bg-primary;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.08);
  }
}

.input-icon {
  font-size: 20px;
  margin-right: 10px;
}

.input-field {
  flex: 1;
  font-size: 15px;
  color: $text-primary;
  height: 24px;
  line-height: 24px;
}

.input-placeholder {
  color: $text-muted;
}

.clear-icon {
  width: 20px;
  height: 20px;
  background: $gray-6;
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.toggle-password {
  font-size: 18px;
  padding: 4px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 4px 20px;
  font-size: 13px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 1.5px solid $gray-6;
  border-radius: 4px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;
  
  &.checked {
    background: $primary;
    border-color: $primary;
  }
}

.check-icon {
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
}

.option-text {
  color: $text-tertiary;
}

.forgot-password {
  color: $primary;
  font-weight: 500;
}

.login-btn {
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  border-radius: 14px;
  padding: 14px;
  text-align: center;
  margin-top: 4px;
  transition: all $transition-normal;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
  
  &.disabled {
    opacity: 0.7;
  }
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 6px rgba(30, 64, 175, 0.2);
  }
}

.login-btn-text {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 2px;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-link {
  text-align: center;
  margin-top: 16px;
}

.link-text {
  font-size: 13px;
  color: $text-tertiary;
}

.link-highlight {
  color: $primary;
  font-weight: 500;
}

.quick-intro {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(30, 64, 175, 0.06);
  border-radius: 10px;
  margin-bottom: 16px;
}

.intro-icon {
  font-size: 20px;
}

.intro-text {
  font-size: 13px;
  color: $text-secondary;
  flex: 1;
}

.quick-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: $bg-secondary;
  border-radius: 12px;
  border: 1.5px solid $border-color;
  transition: all $transition-normal;
  
  &.admin {
    border-color: rgba(30, 64, 175, 0.2);
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.04) 0%, rgba(59, 130, 246, 0.04) 100%);
  }
  
  &:active {
    transform: scale(0.98);
    background: $bg-hover;
  }
}

.quick-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $primary-gradient;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  margin-right: 12px;
  
  .quick-item.employee & {
    background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  }
}

.quick-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.quick-name {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
}

.quick-role {
  font-size: 12px;
  color: $text-tertiary;
  margin-top: 2px;
}

.quick-arrow {
  font-size: 18px;
  color: $text-muted;
  font-weight: 700;
}

.footer-text {
  text-align: center;
  margin-top: 24px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.dialog {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-title {
  font-size: 17px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12px;
}

.dialog-content {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
}

.dialog-btn {
  width: 100%;
  padding: 12px;
  background: $primary-gradient;
  border-radius: 10px;
  text-align: center;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
}
</style>
