<template>
  <view class="login-page">
    <view class="login-container">
      <view class="login-header">
        <view class="logo">
          <text class="logo-icon">🏭</text>
        </view>
        <text class="title">Safety AI</text>
        <text class="subtitle">Enterprise Platform</text>
      </view>

      <view class="form-container">
        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">👤</text>
            <input 
              class="input-field" 
              :value="username"
              @input="onUsernameInput"
              placeholder="Username" 
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">🔒</text>
            <input 
              class="input-field" 
              :value="password"
              @input="onPasswordInput"
              type="password" 
              placeholder="Password" 
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <view class="login-btn" @tap="handleLogin">
          <text class="login-btn-text">LOGIN</text>
        </view>

        <view class="register-link" @tap="goToRegister">
          <text class="link-text">No account? Register</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const onUsernameInput = (e: any) => {
  username.value = e.detail.value
}

const onPasswordInput = (e: any) => {
  password.value = e.detail.value
}

const handleLogin = () => {
  console.log('Login clicked:', username.value, password.value)
  
  if (!username.value || !password.value) {
    uni.showToast({ title: 'Please fill all', icon: 'none' })
    return
  }

  if (username.value === 'admin' && password.value === 'admin123') {
    uni.setStorageSync('user', JSON.stringify({ id: '1', nickname: 'Admin', role: 'admin' }))
    uni.redirectTo({ url: '/pages/ai-qa/index' })
    return
  }

  if (username.value === 'user' && password.value === 'user123') {
    uni.setStorageSync('user', JSON.stringify({ id: '2', nickname: 'User', role: 'employee' }))
    uni.redirectTo({ url: '/pages/ai-qa/index' })
    return
  }

  uni.showToast({ title: 'Wrong username/password', icon: 'none' })
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/register/index' })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E40AF 0%, #2563EB 50%, #F8FAFC 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.login-container {
  width: 100%;
  max-width: 360px;
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
}

.logo {
  width: 88px;
  height: 88px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.logo-icon {
  font-size: 44px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.form-container {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 32px 24px 24px;
  box-shadow: 0 20px 40px rgba(30, 64, 175, 0.15);
}

.form-item {
  margin-bottom: 20px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #F8FAFC;
  border-radius: 16px;
  padding: 14px 16px;
  border: 1px solid #E2E8F0;
}

.input-icon {
  font-size: 20px;
  margin-right: 12px;
}

.input-field {
  flex: 1;
  font-size: 15px;
  color: #0F172A;
}

.input-placeholder {
  color: #94A3B8;
}

.login-btn {
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  margin-top: 24px;
}

.login-btn-text {
  font-size: 17px;
  font-weight: 600;
  color: #FFFFFF;
}

.register-link {
  text-align: center;
  margin-top: 24px;
}

.link-text {
  font-size: 14px;
  color: #1E40AF;
  font-weight: 500;
}
</style>
