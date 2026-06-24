<template>
  <view class="register-container">
    <view class="register-bg"></view>
    <view class="register-content">
      <view class="register-header">
        <view class="back-btn" @click="goBack">
          <view class="back-icon-wrapper">
            <text class="back-icon">‹</text>
          </view>
        </view>
        <text class="header-title">用户注册</text>
        <view class="header-placeholder"></view>
      </view>

      <view class="register-card animate-scale-in">
        <view class="card-icon">
          <text class="icon-emoji">👤</text>
        </view>
        <text class="card-title">创建账号</text>

        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">📝</text>
            <input 
              v-model="form.username" 
              class="form-input" 
              placeholder="请输入用户名"
              @input="clearError"
            />
          </view>
        </view>

        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">👤</text>
            <input 
              v-model="form.nickname" 
              class="form-input" 
              placeholder="请输入昵称"
              @input="clearError"
            />
          </view>
        </view>

        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">🏢</text>
            <input 
              v-model="form.department" 
              class="form-input" 
              placeholder="请输入所属部门"
              @input="clearError"
            />
          </view>
        </view>

        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">🔐</text>
            <input 
              v-model="form.password" 
              class="form-input" 
              type="password"
              placeholder="请输入密码"
              @input="clearError"
            />
          </view>
        </view>

        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">🔑</text>
            <input 
              v-model="form.confirmPassword" 
              class="form-input" 
              type="password"
              placeholder="请再次输入密码"
              @input="clearError"
            />
          </view>
        </view>

        <view class="input-group">
          <text class="input-label">用户类型</text>
          <view class="role-selector">
            <view 
              class="role-option"
              :class="{ active: form.role === 'employee' }"
              @click="form.role = 'employee'"
            >
              <text class="role-icon">👷</text>
              <text class="role-text">员工</text>
            </view>
            <view 
              class="role-option"
              :class="{ active: form.role === 'admin' }"
              @click="form.role = 'admin'"
            >
              <text class="role-icon">👔</text>
              <text class="role-text">管理员</text>
            </view>
          </view>
        </view>

        <view v-if="errorMessage" class="error-message">
          <text class="error-icon">⚠️</text>
          <text class="error-text">{{ errorMessage }}</text>
        </view>

        <view v-if="successMessage" class="success-message">
          <text class="success-icon">✓</text>
          <text class="success-text">{{ successMessage }}</text>
        </view>

        <view 
          class="register-button"
          :class="{ loading: loading }"
          @click="handleRegister"
        >
          <text v-if="!loading" class="button-text">注 册</text>
          <view v-else class="loading-spinner">
            <view class="spinner"></view>
          </view>
        </view>

        <view class="login-link">
          <text class="link-text">已有账号？</text>
          <text class="link-action" @click="goToLogin">立即登录</text>
        </view>
      </view>

      <view class="register-footer">
        <text class="footer-text">© 2024 万基化工 版权所有</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const form = ref({
  username: '',
  nickname: '',
  department: '',
  password: '',
  confirmPassword: '',
  role: 'employee' as 'employee' | 'admin'
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const clearError = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const handleRegister = async () => {
  clearError()
  
  if (!form.value.username) {
    errorMessage.value = '请输入用户名'
    return
  }

  if (!form.value.nickname) {
    errorMessage.value = '请输入昵称'
    return
  }

  if (!form.value.department) {
    errorMessage.value = '请输入所属部门'
    return
  }

  if (!form.value.password) {
    errorMessage.value = '请输入密码'
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = '密码长度至少6位'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  loading.value = true

  try {
    const registered = await userStore.register({
      username: form.value.username,
      nickname: form.value.nickname,
      department: form.value.department,
      password: form.value.password,
      role: form.value.role
    })

    if (registered) {
      successMessage.value = '注册成功！即将跳转到登录页面...'
      
      uni.showToast({
        title: '注册成功',
        icon: 'success'
      })

      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/login/index'
        })
      }, 1500)
    } else {
      errorMessage.value = '用户名已存在，请换一个'
    }
  } catch (error) {
    errorMessage.value = '注册失败，请重试'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  uni.redirectTo({
    url: '/pages/login/index'
  })
}

const goBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.redirectTo({
        url: '/pages/login/index'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.register-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $primary-gradient;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
  }
}

.register-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.register-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg $spacing-base;
  padding-top: calc(#{$statusbar-height} + #{$spacing-lg});
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: $radius-full;
}

.back-icon {
  font-size: 28px;
  color: #ffffff;
  font-weight: 300;
}

.header-title {
  font-size: $text-size-lg;
  font-weight: $font-weight-semibold;
  color: #ffffff;
}

.header-placeholder {
  width: 40px;
}

.register-card {
  flex: 1;
  background: $bg-card;
  border-radius: $radius-xl $radius-xl 0 0;
  padding: $spacing-2xl;
  box-shadow: $shadow-xl;
}

.card-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary-gradient;
  border-radius: 50%;
  margin: 0 auto $spacing-xl;
  box-shadow: $shadow-md;
}

.icon-emoji {
  font-size: 40px;
}

.card-title {
  font-size: $text-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  text-align: center;
  margin-bottom: $spacing-2xl;
}

.input-group {
  margin-bottom: $spacing-lg;
}

.input-label {
  display: block;
  font-size: $text-size-sm;
  font-weight: $font-weight-medium;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: $bg-tertiary;
  border-radius: $radius-lg;
  padding: 0 $spacing-md;
  border: 2px solid transparent;
  transition: all $transition-normal;
  
  &:focus-within {
    background: $bg-primary;
    border-color: $primary;
    box-shadow: $shadow-glow;
  }
}

.input-icon {
  font-size: $text-size-base;
  margin-right: $spacing-sm;
}

.form-input {
  flex: 1;
  height: $button-height-lg;
  font-size: $text-size-base;
  color: $text-primary;
  
  &::placeholder {
    color: $text-placeholder;
  }
}

.role-selector {
  display: flex;
  gap: $spacing-md;
}

.role-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
  background: $bg-tertiary;
  border-radius: $radius-lg;
  border: 2px solid transparent;
  transition: all $transition-normal;
  
  &.active {
    background: rgba($primary, 0.08);
    border-color: $primary;
    
    .role-text {
      color: $primary;
      font-weight: $font-weight-semibold;
    }
  }
}

.role-icon {
  font-size: 28px;
  margin-bottom: $spacing-xs;
}

.role-text {
  font-size: $text-size-sm;
  color: $text-secondary;
}

.error-message {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: $danger-glow;
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;
  
  .error-icon {
    font-size: $text-size-sm;
    margin-right: $spacing-xs;
  }
  
  .error-text {
    font-size: $text-size-sm;
    color: $danger;
    font-weight: $font-weight-medium;
  }
}

.success-message {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: $success-glow;
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;
  
  .success-icon {
    font-size: $text-size-sm;
    color: $success;
    margin-right: $spacing-xs;
  }
  
  .success-text {
    font-size: $text-size-sm;
    color: $success;
    font-weight: $font-weight-medium;
  }
}

.register-button {
  width: 100%;
  height: $button-height-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary-gradient;
  border-radius: $radius-lg;
  transition: all $transition-normal;
  box-shadow: $shadow-md;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left $transition-slow;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: $shadow-sm;
  }
  
  &.loading {
    opacity: 0.8;
  }
}

.button-text {
  font-size: $text-size-base;
  font-weight: $font-weight-semibold;
  color: #ffffff;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  
  .spinner {
    width: 100%;
    height: 100%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-xs;
  margin-top: $spacing-lg;
}

.link-text {
  font-size: $text-size-sm;
  color: $text-tertiary;
}

.link-action {
  font-size: $text-size-sm;
  color: $primary;
  font-weight: $font-weight-semibold;
}

.register-footer {
  padding: $spacing-lg 0;
  padding-bottom: calc(#{$safe-area-bottom} + #{$spacing-lg});
  text-align: center;
}

.footer-text {
  font-size: $text-size-xs;
  color: rgba(255, 255, 255, 0.6);
}
</style>
