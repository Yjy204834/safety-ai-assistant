<template>
  <div class="container">
    <CustomNavbar title="生产安全在线监测">
      <template v-if="userStore.isAdmin">
        <div class="overview-card">
          <div class="card-bg"></div>
          <div class="card-content">
            <div class="card-header">
              <div class="header-left">
                <span class="card-title">设备状态概览</span>
                <span class="card-subtitle">实时监控设备运行状况</span>
              </div>
              <div class="live-badge">
                <div class="live-indicator"></div>
                <span class="live-text">实时监测</span>
              </div>
            </div>
            <div class="quick-stats">
              <div 
                v-for="stat in statusStats" 
                :key="stat.key"
                :class="['quick-stat', stat.key]"
              >
                <span class="quick-num">{{ stat.value }}</span>
                <span class="quick-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CustomNavbar>
    <div class="page-content">
      <template v-if="userStore.isAdmin">
        <div class="section">
          <div class="function-list">
            <div 
              class="function-card"
              @click="goToPage('/monitor/electrolyzer')"
            >
              <div class="func-icon-box primary">
                <span class="func-icon">⚡</span>
              </div>
              <div class="func-content">
                <span class="func-title">电解槽工艺参数</span>
                <span class="func-desc">实时监测电解槽运行状态</span>
              </div>
              <div class="func-arrow">→</div>
            </div>
            <div 
              v-if="userStore.permissions.monitor.purchase"
              class="function-card"
              @click="goToPage('/monitor/purchase')"
            >
              <div class="func-icon-box secondary">
                <span class="func-icon">📦</span>
              </div>
              <div class="func-content">
                <span class="func-title">零部件采购统计</span>
                <span class="func-desc">采购数据分析报表</span>
              </div>
              <div class="func-arrow">→</div>
            </div>
            <div 
              v-if="userStore.permissions.monitor.settings"
              class="function-card admin"
              @click="goToPage('/monitor/settings')"
            >
              <div class="func-icon-box accent">
                <span class="func-icon">⚙️</span>
              </div>
              <div class="func-content">
                <span class="func-title">预警设置</span>
                <span class="func-desc">配置设备预警参数</span>
              </div>
              <div class="func-arrow">→</div>
            </div>
          </div>
        </div>
      </template>

      <div class="section">
        <div class="section-header">
          <span class="section-title">
            {{ userStore.isAdmin ? '最新告警' : '安全提醒' }}
          </span>
          <span v-if="userStore.isAdmin && userStore.permissions.monitor.settings" class="section-link">管理</span>
        </div>
        
        <div v-if="userStore.isAdmin" class="alert-container">
          <div 
            v-for="alert in recentAlerts" 
            :key="alert.id"
            :class="['alert-card', alert.level]"
            @click="goToPage('/monitor/electrolyzer')"
          >
            <div :class="['alert-line', alert.level]"></div>
            <div class="alert-body">
              <div class="alert-info">
                <span class="alert-title">{{ alert.title }}</span>
                <span class="alert-device">{{ alert.device }}</span>
              </div>
              <div class="alert-meta">
                <span :class="['alert-badge', alert.level]">
                  {{ alert.level === 'error' ? '严重' : '预警' }}
                </span>
                <span class="alert-time">{{ alert.time }}</span>
              </div>
            </div>
            <div class="alert-arrow">→</div>
          </div>
        </div>

        <div v-else class="employee-alerts">
          <div class="alert-banner">
            <div class="banner-icon">🔔</div>
            <div class="banner-content">
              <span class="banner-title">安全提醒通知</span>
              <span class="banner-desc">以下是与您相关的安全提醒信息</span>
            </div>
          </div>

          <div class="alert-list">
            <div 
              v-for="alert in employeeAlerts" 
              :key="alert.id"
              :class="['employee-alert-card', alert.level]"
            >
              <div class="alert-header">
                <div :class="['alert-level-badge', alert.level]">
                  {{ alert.level === 'error' ? '严重警告' : '安全提醒' }}
                </div>
                <span class="alert-date">{{ alert.time }}</span>
              </div>
              <div class="alert-content">
                <span class="alert-message">{{ alert.message }}</span>
                <span class="alert-location">📍 {{ alert.location }}</span>
              </div>
              <div class="alert-footer">
                <span class="alert-tips">💡 {{ alert.tips }}</span>
              </div>
            </div>
          </div>

          <div v-if="employeeAlerts.length === 0" class="no-alerts">
            <div class="no-alerts-icon">✅</div>
            <span class="no-alerts-title">暂无安全提醒</span>
            <span class="no-alerts-desc">当前没有与您相关的安全提醒信息</span>
          </div>
        </div>
      </div>
    </div>
    <CustomTabBar />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { useUserStore } from '@/stores/user'
import { electrolyzerData, recentAlerts } from '@/data/mock.ts'

const userStore = useUserStore()

const normalCount = computed(() => 
  electrolyzerData.filter(e => e.status === 'normal').length
)
const warningCount = computed(() => 
  electrolyzerData.filter(e => e.status === 'warning').length
)
const errorCount = computed(() => 
  electrolyzerData.filter(e => e.status === 'error').length
)

const totalCount = computed(() => electrolyzerData.length)

const statusStats = computed(() => [
  {
    key: 'normal',
    icon: '✓',
    label: '正常运行',
    value: normalCount.value,
    percent: Math.round((normalCount.value / totalCount.value) * 100)
  },
  {
    key: 'warning',
    icon: '⚠',
    label: '预警设备',
    value: warningCount.value,
    percent: Math.round((warningCount.value / totalCount.value) * 100)
  },
  {
    key: 'error',
    icon: '✕',
    label: '故障设备',
    value: errorCount.value,
    percent: Math.round((errorCount.value / totalCount.value) * 100)
  }
])

const employeeAlerts = computed(() => [
  {
    id: 1,
    level: 'warning',
    message: '您所在的区域即将进行设备检修，请注意安全',
    location: '生产车间A区',
    time: '2024-01-15 14:30',
    tips: '请佩戴好安全帽，远离检修区域'
  },
  {
    id: 2,
    level: 'error',
    message: '检测到您所在的区域温度异常，请立即撤离',
    location: '生产车间B区',
    time: '2024-01-15 10:15',
    tips: '请按照安全通道指示撤离到安全区域'
  },
  {
    id: 3,
    level: 'warning',
    message: '明日将进行安全演练，请提前做好准备',
    location: '全厂区域',
    time: '2024-01-14 16:00',
    tips: '演练时间为上午9:00-11:00，请准时参加'
  }
])

const goToPage = (path: string) => {
  uni.navigateTo({ url: path })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
}

.page-content {
  padding: 0 $content-spacing;
  padding-top: 0;
  padding-bottom: calc(#{$tabbar-height} + env(safe-area-inset-bottom) + #{$spacing-base});
  min-height: calc(100vh - #{$statusbar-height});
  margin-top: calc(#{$navbar-height} + #{$statusbar-height} - 8px);
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
}

.overview-card {
  position: relative;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: $radius-lg;
  padding: $spacing-base $spacing-lg;
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 15% 0%, rgba(255, 255, 255, 0.16) 0%, transparent 45%),
    radial-gradient(ellipse at 85% 100%, rgba(96, 165, 250, 0.1) 0%, transparent 45%);
}

.card-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-base;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.card-title {
  font-size: $text-size-xl;
  font-weight: $font-weight-bold;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.card-subtitle {
  font-size: $text-size-sm;
  color: rgba(255, 255, 255, 0.8);
}

.live-badge {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-md;
  background: rgba(255, 255, 255, 0.18);
  border-radius: $radius-sm;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.live-indicator {
  width: 8px;
  height: 8px;
  background: $success-light;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.live-text {
  font-size: $text-size-xs;
  color: rgba(255, 255, 255, 0.95);
  font-weight: $font-weight-semibold;
}

.card-content {
  position: relative;
  z-index: 1;
}

.quick-stats {
  display: flex;
  justify-content: space-between;
  gap: $spacing-base;
  margin-top: $spacing-md;
  padding-top: $spacing-base;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.quick-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  flex: 1;
  padding: 10px 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &.normal .quick-num { color: #34D399; }
  &.warning .quick-num { color: #FBBF24; }
  &.error .quick-num { color: #F87171; }
}

.quick-num {
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.quick-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding: 0 4px;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #1D1D1F;
  letter-spacing: -0.2px;
}

.section-link {
  font-size: 14px;
  color: $primary;
  font-weight: 600;
}

.function-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.function-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.04),
    0 1px 4px rgba(0, 0, 0, 0.015);
  border: 1px solid rgba(0, 0, 0, 0.025);
  cursor: pointer;
  transition: all $transition-bounce;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 14px 32px rgba(0, 0, 0, 0.08),
      0 6px 14px rgba(0, 0, 0, 0.04);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &.admin {
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, #ffffff 100%);
    border-color: rgba(30, 64, 175, 0.08);
  }
}

.func-icon-box {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  flex-shrink: 0;
  transition: all $transition-normal;
  
  &.primary {
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.12) 0%, rgba(30, 64, 175, 0.06) 100%);
    border: 1px solid rgba(30, 64, 175, 0.1);
  }
  
  &.secondary {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%);
    border: 1px solid rgba(16, 185, 129, 0.1);
  }
  
  &.accent {
    background: $primary-gradient;
    box-shadow: 0 6px 16px rgba(30, 64, 175, 0.35);
  }
}

.func-icon {
  font-size: 26px;
}

.func-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.func-title {
  font-size: 16px;
  font-weight: 700;
  color: #1D1D1F;
  letter-spacing: -0.2px;
}

.func-desc {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.func-arrow {
  font-size: 20px;
  color: #D1D5DB;
  transition: all $transition-normal;
  
  .function-card:hover & {
    color: $primary;
    transform: translateX(4px);
  }
}

.alert-container {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.04),
    0 1px 4px rgba(0, 0, 0, 0.015);
  border: 1px solid rgba(0, 0, 0, 0.025);
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all $transition-normal;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #F9FAFB;
  }
  
  &:active {
    transform: scale(0.995);
  }
  
  &.error {
    .alert-line { background: linear-gradient(180deg, #EF4444 0%, #DC2626 100%); }
  }
  
  &.warning {
    .alert-line { background: linear-gradient(180deg, #F59E0B 0%, #D97706 100%); }
  }
}

.alert-line {
  width: 4px;
  height: 44px;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.alert-body {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alert-title {
  font-size: 15px;
  font-weight: 600;
  color: #1D1D1F;
  letter-spacing: -0.2px;
}

.alert-device {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.alert-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.alert-badge {
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.2px;
  
  &.error {
    background: rgba(239, 68, 68, 0.12);
    color: #EF4444;
  }
  
  &.warning {
    background: rgba(245, 158, 11, 0.12);
    color: #F59E0B;
  }
}

.alert-time {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
}

.alert-arrow {
  font-size: 18px;
  color: #D1D5DB;
  transition: all $transition-normal;
  
  .alert-card:hover & {
    color: $primary;
    transform: translateX(4px);
  }
}

.employee-alerts {
  .alert-banner {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
    background: $primary-gradient;
    border-radius: 20px;
    margin-bottom: 16px;
    box-shadow: 0 10px 32px rgba(30, 64, 175, 0.22);
  }
  
  .banner-icon {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 18px;
    font-size: 26px;
  }
  
  .banner-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .banner-title {
    font-size: 17px;
    font-weight: 700;
    color: #ffffff;
  }
  
  .banner-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.88);
  }
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.employee-alert-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.04),
    0 1px 4px rgba(0, 0, 0, 0.015);
  border: 1px solid rgba(0, 0, 0, 0.025);
  
  &.error {
    border-left: 4px solid #EF4444;
  }
  
  &.warning {
    border-left: 4px solid #F59E0B;
  }
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.alert-level-badge {
  padding: 5px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  
  &.error {
    background: rgba(239, 68, 68, 0.12);
    color: #EF4444;
  }
  
  &.warning {
    background: rgba(245, 158, 11, 0.12);
    color: #F59E0B;
  }
}

.alert-date {
  font-size: 13px;
  color: #9CA3AF;
  font-weight: 500;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}

.alert-message {
  font-size: 15px;
  font-weight: 600;
  color: #1D1D1F;
  line-height: 1.55;
}

.alert-location {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.alert-footer {
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.alert-tips {
  font-size: 14px;
  color: $primary;
  font-weight: 500;
}

.no-alerts {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 70px 20px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.05),
    0 1px 4px rgba(0, 0, 0, 0.02);
}

.no-alerts-icon {
  font-size: 72px;
  margin-bottom: 20px;
}

.no-alerts-title {
  font-size: 19px;
  font-weight: 700;
  color: #1D1D1F;
  margin-bottom: 10px;
}

.no-alerts-desc {
  font-size: 14px;
  color: #9CA3AF;
  text-align: center;
}
</style>
