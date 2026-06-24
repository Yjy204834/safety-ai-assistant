﻿﻿﻿﻿﻿<template>
  <div class="learning-records-page">
    <CustomNavbar title="学习记录" :showBack="true" />
    <div class="page-content">
      <div class="filter-tabs">
        <div 
          v-for="tab in filterTabs" 
          :key="tab.value"
          :class="['filter-tab', { active: activeFilter === tab.value }]"
          @click="activeFilter = tab.value"
        >
          {{ tab.label }}
        </div>
      </div>

      <div class="records-list">
        <div 
          v-for="record in filteredRecords" 
          :key="record.id"
          class="record-card"
        >
          <div class="record-icon" :class="record.type">
            <span>{{ getTypeIcon(record.type) }}</span>
          </div>
          <div class="record-info">
            <div class="record-title">{{ record.title }}</div>
            <div class="record-meta">
              <span>{{ record.duration }}</span>
              <span v-if="record.completedAt">· {{ record.completedAt }}</span>
              <span v-if="record.score">· {{ record.score }}分</span>
            </div>
            <div v-if="record.progress < 100" class="progress-bar">
              <div class="progress-fill" :style="{ width: record.progress + '%' }"></div>
            </div>
          </div>
          <div class="record-status" :class="record.status">
            {{ getStatusText(record.status) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { learningRecords, type LearningRecord } from '@/data/mock'

const activeFilter = ref<'all' | 'completed' | 'in-progress' | 'not-started'>('all')

const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '进行中', value: 'in-progress' },
  { label: '未开始', value: 'not-started' }
]

const filteredRecords = computed(() => {
  if (activeFilter.value === 'all') {
    return learningRecords
  }
  return learningRecords.filter(r => r.status === activeFilter.value)
})

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    video: '🎬',
    theory: '📖',
    test: '📝'
  }
  return icons[type] || '📚'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    completed: '已完成',
    'in-progress': '进行中',
    'not-started': '未开始'
  }
  return texts[status] || status
}
</script>

<style lang="scss" scoped>
.learning-records-page {
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

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.record-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;

  &.video {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.theory {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.test {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.record-title {
  font-size: 15px;
  font-weight: 500;
  color: #1D1D1F;
}

.record-meta {
  font-size: 12px;
  color: #86868B;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #F0F2F5;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0F52BA 0%, #1E6ED8 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.record-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 10px;
  flex-shrink: 0;

  &.completed {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
  }

  &.in-progress {
    background: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
  }

  &.not-started {
    background: #F5F7FA;
    color: #86868B;
  }
}
</style>
