<template>
  <view class="navbar">
    <view class="navbar-bg">
      <view class="bg-gradient"></view>
      <view class="bg-decoration">
        <view class="decoration-circle circle-1"></view>
        <view class="decoration-circle circle-2"></view>
        <view class="decoration-circle circle-3"></view>
      </view>
    </view>
    <view class="navbar-glow"></view>
    <view class="navbar-content">
      <view class="nav-left">
        <view v-if="showBack" class="nav-back" @click="goBack">
          <view class="back-button">
            <text class="back-arrow">←</text>
          </view>
        </view>
        <text class="nav-title">{{ title }}</text>
        <view class="nav-right"></view>
      </view>
    </view>
    <view v-if="$slots.default" class="navbar-extra">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  showBack?: boolean
}>()

const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  min-height: 44px;
}

.navbar-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: $bg-gradient-hero;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.4;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -80px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 70%);
}

.circle-2 {
  width: 140px;
  height: 140px;
  top: -60px;
  right: -60px;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%);
}

.circle-3 {
  width: 120px;
  height: 120px;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%);
}

.navbar-glow {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 0%, rgba(255, 255, 255, 0.18) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(96, 165, 250, 0.12) 0%, transparent 50%);
  pointer-events: none;
}

.navbar-content {
  position: relative;
  z-index: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  padding-top: var(--status-bar-height);
}

.nav-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.nav-back {
  flex: 0 0 auto;
}

.back-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-arrow {
  font-size: 20px;
  color: #ffffff;
  font-weight: 300;
  line-height: 1;
}

.nav-title {
  flex: 1;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.4px;
}

.nav-right {
  flex: 0 0 auto;
  width: 40px;
}

.navbar-extra {
  position: relative;
  z-index: 1;
  padding: 8px 16px 16px;
  background: linear-gradient(180deg, rgba(30, 64, 175, 0.94) 0%, rgba(30, 58, 138, 0.9) 50%, rgba(30, 64, 175, 0.78) 100%);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.18);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
