﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿<template>
  <div class="container">
    <CustomNavbar title="电解槽工艺参数" :showBack="true" />
    <div class="page-content">
      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-value normal">{{ normalCount }}</div>
          <div class="stat-label">正常</div>
        </div>
        <div class="stat-item">
          <div class="stat-value warning">{{ warningCount }}</div>
          <div class="stat-label">预警</div>
        </div>
        <div class="stat-item">
          <div class="stat-value error">{{ errorCount }}</div>
          <div class="stat-label">故障</div>
        </div>
      </div>
      <div class="electrolyzer-list">
        <div 
          v-for="item in electrolyzerData" 
          :key="item.id"
          :class="['electrolyzer-card', item.status]"
        >
          <div class="card-header">
            <div class="header-left">
              <div :class="['status-indicator', item.status]"></div>
              <span class="card-title">电解槽{{ item.id }}</span>
            </div>
            <div :class="['status-badge', item.status]">
              <span>{{ statusText(item.status) }}</span>
            </div>
          </div>
          <div class="params-grid">
            <div class="param-item">
              <div class="param-icon current">⚡</div>
              <div class="param-info">
                <span class="param-label">电流</span>
                <span class="param-value">{{ item.current }} A</span>
              </div>
            </div>
            <div class="param-item">
              <div class="param-icon voltage">🔋</div>
              <div class="param-info">
                <span class="param-label">电压</span>
                <span class="param-value">{{ item.voltage }} V</span>
              </div>
            </div>
            <div class="param-item">
              <div class="param-icon temperature">🌡️</div>
              <div class="param-info">
                <span class="param-label">温度</span>
                <span class="param-value" :class="{ highlight: item.temperature > 90 }">{{ item.temperature }} °C</span>
              </div>
            </div>
            <div class="param-item">
              <div class="param-icon pressure">💨</div>
              <div class="param-info">
                <span class="param-label">压力</span>
                <span class="param-value">{{ item.pressure }} MPa</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="update-icon">📅</span>
            <span class="update-time">{{ item.updateTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { electrolyzerData } from '@/data/mock.ts'

const statusText = (status: string) => {
  const map: Record<string, string> = {
    normal: '正常',
    warning: '预警',
    error: '故障'
  }
  return map[status] || status
}

const normalCount = computed(() => electrolyzerData.filter(item => item.status === 'normal').length)
const warningCount = computed(() => electrolyzerData.filter(item => item.status === 'warning').length)
const errorCount = computed(() => electrolyzerData.filter(item => item.status === 'error').length)
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
}

.page-content {
  padding-top: calc(56px + var(--status-bar-height, 24px));
  padding-bottom: calc(68px + env(safe-area-inset-bottom));
}

.stats-bar {
  display: flex;
  gap: 12px;
  padding: 16px;
  margin: 16px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  
  &.normal {
    color: #059669;
  }
  
  &.warning {
    color: #D97706;
  }
  
  &.error {
    color: #DC2626;
  }
}

.stat-label {
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
}

.electrolyzer-list {
  padding: 0 16px 24px;
}

.electrolyzer-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  border-left: 4px solid transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.99);
  }
  
  &.normal {
    border-left-color: #059669;
  }
  
  &.warning {
    border-left-color: #D97706;
    background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
  }
  
  &.error {
    border-left-color: #DC2626;
    background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  
  &.normal {
    background: #059669;
    box-shadow: 0 0 8px rgba(5, 150, 105, 0.5);
  }
  
  &.warning {
    background: #D97706;
    box-shadow: 0 0 8px rgba(217, 119, 6, 0.5);
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  &.error {
    background: #DC2626;
    box-shadow: 0 0 8px rgba(220, 38, 38, 0.5);
    animation: pulse 0.8s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #1D1D1F;
  letter-spacing: -0.3px;
}

.status-badge {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  &.normal {
    background: rgba(5, 150, 105, 0.1);
    color: #059669;
  }
  
  &.warning {
    background: rgba(217, 119, 6, 0.1);
    color: #D97706;
  }
  
  &.error {
    background: rgba(220, 38, 38, 0.1);
    color: #DC2626;
  }
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.param-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.param-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 18px;
  
  &.current {
    background: rgba(59, 130, 246, 0.1);
  }
  
  &.voltage {
    background: rgba(168, 85, 247, 0.1);
  }
  
  &.temperature {
    background: rgba(239, 68, 68, 0.1);
  }
  
  &.pressure {
    background: rgba(5, 150, 105, 0.1);
  }
}

.param-info {
  display: flex;
  flex-direction: column;
}

.param-label {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
}

.param-value {
  font-size: 16px;
  font-weight: 700;
  color: #1D1D1F;
  margin-top: 2px;
  letter-spacing: -0.2px;
  
  &.highlight {
    color: #DC2626;
  }
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #F3F4F6;
}

.update-icon {
  font-size: 14px;
  opacity: 0.6;
}

.update-time {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
}
</style>
