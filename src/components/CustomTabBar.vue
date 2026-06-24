<template>
  <view class="tabbar">
    <view class="tabbar-bg">
      <view class="tabbar-blur"></view>
      <view class="tabbar-border"></view>
      <view class="tabbar-gradient"></view>
    </view>
    <view class="tabbar-content">
      <view 
        v-for="item in visibleTabs" 
        :key="item.path"
        :class="['tab-item', { active: currentPath === item.path }]"
        @click="switchTab(item.path)"
      >
        <view class="tab-icon-wrapper">
          <text class="tab-icon">{{ item.icon }}</text>
          <view v-if="currentPath === item.path" class="icon-glow"></view>
        </view>
        <text class="tab-label">{{ item.text }}</text>
        <view v-if="currentPath === item.path" class="tab-indicator">
          <view class="indicator-pulse"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const currentPath = ref('/ai-qa')

const adminTabs = [
  { path: '/pages/ai-qa/index', text: 'AI问答', icon: '🤖' },
  { path: '/pages/news/index', text: '集团动态', icon: '📰' },
  { path: '/pages/training/index', text: '安全培训', icon: '📚' },
  { path: '/pages/monitor/index', text: '安全监测', icon: '📊' },
  { path: '/pages/profile/index', text: '我的', icon: '👤' }
]

const employeeTabs = [
  { path: '/pages/ai-qa/index', text: 'AI问答', icon: '🤖' },
  { path: '/pages/news/index', text: '集团动态', icon: '📰' },
  { path: '/pages/training/index', text: '安全培训', icon: '📚' },
  { path: '/pages/monitor/index', text: '安全提醒', icon: '🔔' },
  { path: '/pages/profile/index', text: '我的', icon: '👤' }
]

const visibleTabs = computed(() => {
  return userStore.isAdmin ? adminTabs : employeeTabs
})

onMounted(() => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    currentPath.value = '/' + currentPage.route
  }
})

const switchTab = (path: string) => {
  if (currentPath.value === path) return
  currentPath.value = path
  uni.redirectTo({ url: path })
}
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: $z-fixed;
  height: $tabbar-height;
  padding-bottom: var(--safe-area-inset-bottom, #{$safe-area-bottom});
}

.tabbar-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.tabbar-blur {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
}

.tabbar-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(30, 64, 175, 0.03) 20%, 
    rgba(30, 64, 175, 0.05) 50%, 
    rgba(30, 64, 175, 0.03) 80%, 
    transparent 100%
  );
}

.tabbar-gradient {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  bottom: 0;
  background: linear-gradient(to bottom, 
    rgba(59, 130, 246, 0.015) 0%, 
    transparent 50%
  );
  pointer-events: none;
}

.tabbar-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: $tabbar-height;
  padding: 0 $spacing-sm;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xs 0;
  position: relative;
  transition: all $transition-normal;
  
  &.active {
    .tab-icon-wrapper {
      transform: translateY(-4px) scale(1.08);
      
      .tab-icon {
        filter: drop-shadow(0 4px 12px rgba(30, 64, 175, 0.3));
      }
    }
    
    .tab-label {
      color: $primary;
      font-weight: $font-weight-semibold;
      transform: translateY(-2px);
    }
  }
  
  &:hover:not(.active) {
    .tab-icon-wrapper {
      transform: scale(1.05);
    }
  }
  
  &:active {
    opacity: 0.88;
    transform: scale(0.99);
  }
}

.tab-icon-wrapper {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  transition: all $transition-bounce;
  margin-bottom: 2px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(59, 130, 246, 0.05);
    border-radius: $radius-lg;
    opacity: 0;
    transition: opacity $transition-normal;
  }
  
  &:hover::before {
    opacity: 1;
  }
}

.tab-icon {
  font-size: 24px;
  line-height: 1;
  transition: all $transition-normal;
  z-index: 1;
  position: relative;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  background: $primary-gradient;
  opacity: 0.1;
  border-radius: $radius-md;
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.18;
  }
}

.tab-label {
  font-size: $text-size-xs;
  color: $text-tertiary;
  transition: all $transition-normal;
  letter-spacing: -0.2px;
}

.tab-indicator {
  position: absolute;
  bottom: 8px;
  width: 28px;
  height: 4px;
  background: $gradient-button;
  border-radius: $radius-full;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
  overflow: hidden;
}

.indicator-pulse {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.5) 50%, 
    transparent 100%
  );
  animation: indicatorShine 3s ease-in-out infinite;
}

@keyframes indicatorShine {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(200%);
  }
}
</style>
