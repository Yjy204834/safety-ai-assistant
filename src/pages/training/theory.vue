<template>
  <div class="container">
    <CustomNavbar title="理论学习" :showBack="true" />
    <div class="page-content">
      <div class="section-header">
        <span class="section-title">课程列表</span>
        <span class="section-count">共 {{ lessons.length }} 门课程</span>
      </div>
      
      <div class="lesson-list">
        <div 
          v-for="(lesson, index) in lessons" 
          :key="lesson.id"
          :class="['lesson-card']"
          @click="selectLesson(lesson)"
        >
          <div class="lesson-cover">
            <div class="cover-icon">{{ lessonIcons[index % lessonIcons.length] }}</div>
            <div class="cover-overlay">
              <span class="play-icon">▶</span>
            </div>
          </div>
          
          <div class="lesson-content">
            <div class="lesson-header">
              <span class="lesson-title">{{ lesson.title }}</span>
              <div :class="['category-tag', getCategoryClass(lesson.category)]">
                {{ lesson.category }}
              </div>
            </div>
            
            <div class="lesson-meta">
              <div class="meta-item">
                <span class="meta-icon">⏱️</span>
                <span class="meta-text">{{ lesson.duration }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">👁️</span>
                <span class="meta-text">{{ lesson.views }}</span>
              </div>
            </div>
            
            <div class="lesson-preview">
              <span>{{ truncateContent(lesson.content) }}</span>
            </div>
          </div>
          
          <div class="lesson-arrow">
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomNavbar from '@/components/CustomNavbar.vue'
import { theoryLessons, type TheoryLesson } from '@/data/mock.ts'

const lessons = theoryLessons

const lessonIcons = ['📚', '🔬', '🔥', '🌍', '💡', '🛡️']

const getCategoryClass = (category: string) => {
  const classMap: Record<string, string> = {
    '创新课程': 'category-innovation',
    '专项课程': 'category-special',
    '综合课程': 'category-comprehensive'
  }
  return classMap[category] || 'category-default'
}

const truncateContent = (content: string) => {
  return content.length > 60 ? content.slice(0, 60) + '...' : content
}

const selectLesson = (lesson: TheoryLesson) => {
  alert(`${lesson.title}\n\n${lesson.content}`)
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(30, 64, 175, 0.02) 0%, #F8FAFC 8%, #F1F5F9 100%);
}

.page-content {
  padding-top: calc(#{$navbar-height} + #{$statusbar-height});
  padding-bottom: #{$spacing-xl};
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  
  & + .lesson-list {
    margin-top: -$spacing-md;
  }
}

.section-title {
  font-size: $text-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.section-count {
  font-size: $text-size-sm;
  color: $text-muted;
}

.lesson-list {
  padding: 0 $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.lesson-card {
  display: flex;
  align-items: stretch;
  background: #ffffff;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-bounce;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    
    .lesson-cover .cover-overlay {
      opacity: 1;
    }
    
    .lesson-arrow {
      transform: translateX(4px);
      color: $primary;
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
}

.lesson-cover {
  width: 100px;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-icon {
  font-size: 40px;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 64, 175, 0.7);
  opacity: 0;
  transition: opacity $transition-normal;
}

.play-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 50%;
  color: $primary;
  font-size: 14px;
  font-weight: bold;
  padding-left: 4px;
}

.lesson-content {
  flex: 1;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  min-width: 0;
}

.lesson-header {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
}

.lesson-title {
  flex: 1;
  font-size: $text-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  line-height: $line-height-normal;
}

.category-tag {
  flex-shrink: 0;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-xs;
  font-size: $text-size-xs;
  font-weight: $font-weight-medium;
  
  &.category-innovation {
    background: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
  }
  
  &.category-special {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }
  
  &.category-comprehensive {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
  }
  
  &.category-default {
    background: rgba(107, 114, 128, 0.1);
    color: #6B7280;
  }
}

.lesson-meta {
  display: flex;
  gap: $spacing-lg;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.meta-icon {
  font-size: $text-size-sm;
}

.meta-text {
  font-size: $text-size-xs;
  color: $text-muted;
}

.lesson-preview {
  font-size: $text-size-sm;
  color: $text-tertiary;
  line-height: $line-height-relaxed;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.lesson-arrow {
  display: flex;
  align-items: center;
  padding: 0 $spacing-md;
  color: $text-muted;
  font-size: $text-size-xl;
  transition: all $transition-normal;
}
</style>
