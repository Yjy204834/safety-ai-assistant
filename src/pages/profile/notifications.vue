﻿﻿﻿﻿﻿<template>
  <div class="notifications-page">
    <CustomNavbar title="通知中心" :showBack="true" />
    <div class="page-content">
      <div class="filter-tabs">
        <div 
          v-for="tab in filterTabs" 
          :key="tab.value"
          :class="['filter-tab', { active: activeFilter === tab.value }]"
          @click="activeFilter = tab.value"
        >
          {{ tab.label }}
          <div v-if="getUnreadCount(tab.value) > 0" class="tab-badge">{{ getUnreadCount(tab.value) }}</div>
        </div>
      </div>

      <div class="notifications-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          :class="['notification-card', { unread: !notification.isRead }]"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon" :class="notification.type">
            <span>{{ getTypeIcon(notification.type) }}</span>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-desc">{{ notification.content }}</div>
            <div class="notification-time">{{ notification.time }}</div>
          </div>
          <div v-if="!notification.isRead" class="unread-dot"></div>
        </div>
      </div>

      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <span class="empty-text">暂无通知</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { notifications, type Notification } from '@/data/mock'

const activeFilter = ref<'all' | 'system' | 'training' | 'security' | 'salary'>('all')

const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '系统', value: 'system' },
  { label: '培训', value: 'training' },
  { label: '安全', value: 'security' },
  { label: '薪资', value: 'salary' }
]

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notifications
  }
  return notifications.filter(n => n.type === activeFilter.value)
})

const getUnreadCount = (type: string) => {
  let list = notifications
  if (type !== 'all') {
    list = notifications.filter(n => n.type === type)
  }
  return list.filter(n => !n.isRead).length
}

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    system: '⚙️',
    training: '📚',
    security: '🛡️',
    salary: '💰'
  }
  return icons[type] || '📬'
}

const markAsRead = (id: number) => {
  const notification = notifications.find(n => n.id === id)
  if (notification) {
    notification.isRead = true
  }
}
</script>

<style lang="scss" scoped>
.notifications-page {
  min-height: 100vh;
  background: #F5F7FA;
}

.page-content {
  padding: 12px 16px calc(#{$tabbar-height} + 12px);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-tab {
  position: relative;
  flex: 1;
  min-width: fit-content;
  padding: 8px 16px;
  background: #FFFFFF;
  border-radius: 20px;
  font-size: 13px;
  color: #86868B;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);

  &.active {
    background: linear-gradient(135deg, #0F52BA 0%, #1E6ED8 100%);
    color: #FFFFFF;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(15, 82, 186, 0.2);
  }
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: #FF3B30;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  cursor: pointer;
  transition: all 0.15s ease;

  &.unread {
    background: #F8FAFF;
    border-left: 3px solid #0F52BA;
  }

  &:active {
    opacity: 0.8;
  }
}

.notification-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;

  &.system {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.training {
    background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  }

  &.security {
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  }

  &.salary {
    background: linear-gradient(135deg, #F093FB 0%, #F5576C 100%);
  }
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-title {
  font-size: 15px;
  font-weight: 500;
  color: #1D1D1F;
}

.notification-desc {
  font-size: 13px;
  color: #86868B;
  line-height: 1.5;
}

.notification-time {
  font-size: 11px;
  color: #C7C7CC;
  margin-top: 4px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #FF3B30;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: #86868B;
}
</style>
