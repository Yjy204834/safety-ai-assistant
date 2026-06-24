﻿﻿﻿﻿﻿<template>
  <div class="settings-page">
    <CustomNavbar title="设置" :showBack="true" />
    <div class="page-content">
      <div class="settings-section">
        <div class="section-title">通用设置</div>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">🔔</div>
              <div class="setting-label">消息通知</div>
            </div>
            <div class="setting-switch" :class="{ active: settings.notificationEnabled }" @click="toggleSetting('notificationEnabled')">
              <div class="switch-dot"></div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">🔊</div>
              <div class="setting-label">声音提醒</div>
            </div>
            <div class="setting-switch" :class="{ active: settings.soundEnabled }" @click="toggleSetting('soundEnabled')">
              <div class="switch-dot"></div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">📳</div>
              <div class="setting-label">震动提醒</div>
            </div>
            <div class="setting-switch" :class="{ active: settings.vibrationEnabled }" @click="toggleSetting('vibrationEnabled')">
              <div class="switch-dot"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="section-title">显示设置</div>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">🌙</div>
              <div class="setting-label">深色模式</div>
            </div>
            <div class="setting-switch" :class="{ active: settings.darkMode }" @click="toggleSetting('darkMode')">
              <div class="switch-dot"></div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">🌐</div>
              <div class="setting-label">语言</div>
            </div>
            <div class="setting-right">
              <span class="setting-value">{{ settings.language === 'zh-CN' ? '简体中文' : 'English' }}</span>
              <span class="setting-arrow">›</span>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="section-title">账户</div>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">👤</div>
              <div class="setting-label">个人资料</div>
            </div>
            <span class="setting-arrow">›</span>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">🔒</div>
              <div class="setting-label">修改密码</div>
            </div>
            <span class="setting-arrow">›</span>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="section-title">关于</div>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">📱</div>
              <div class="setting-label">关于我们</div>
            </div>
            <span class="setting-arrow">›</span>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">📄</div>
              <div class="setting-label">服务条款</div>
            </div>
            <span class="setting-arrow">›</span>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">🛡️</div>
              <div class="setting-label">隐私政策</div>
            </div>
            <span class="setting-arrow">›</span>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-icon">ℹ️</div>
              <div class="setting-label">版本信息</div>
            </div>
            <span class="setting-value">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { userSettings, type UserSettings } from '@/data/mock'

const settings = ref<UserSettings>({ ...userSettings })

const toggleSetting = (key: keyof UserSettings) => {
  if (typeof settings.value[key] === 'boolean') {
    settings.value[key] = !settings.value[key] as any
  }
}
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: #F5F7FA;
}

.page-content {
  padding: 12px 16px calc(#{$tabbar-height} + 12px);
}

.settings-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 12px;
  font-weight: 500;
  color: #86868B;
  margin-bottom: 8px;
  padding-left: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.settings-list {
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #F0F2F5;
  cursor: pointer;
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #F5F7FA;
  }
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-icon {
  font-size: 20px;
}

.setting-label {
  font-size: 15px;
  font-weight: 500;
  color: #1D1D1F;
}

.setting-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-value {
  font-size: 14px;
  color: #86868B;
}

.setting-arrow {
  font-size: 20px;
  color: #C7C7CC;
  font-weight: 300;
}

.setting-switch {
  position: relative;
  width: 50px;
  height: 30px;
  background: #E5E7EB;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.25s ease;

  &.active {
    background: linear-gradient(90deg, #0F52BA 0%, #1E6ED8 100%);
  }

  .switch-dot {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 26px;
    height: 26px;
    background: #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.25s ease;

    .setting-switch.active & {
      transform: translateX(20px);
    }
  }
}
</style>
