<template>
  <div class="container">
    <CustomNavbar title="安全生产培训">
      <div class="tabs-container">
        <div class="tabs-scroll">
          <div class="tabs-wrapper">
            <div 
              v-for="cat in categories" 
              :key="cat.key"
              :class="['tab-item', { active: currentCategory === cat.key }]"
              @click="currentCategory = cat.key"
            >
              <div class="tab-icon">{{ cat.icon }}</div>
              <span class="tab-text">{{ cat.name }}</span>
              <div v-if="currentCategory === cat.key" class="tab-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </CustomNavbar>
    <div class="page-content">
      <div class="courses-scroll-wrapper">
        <div class="courses-content">
        <div v-if="filteredCourses.length > 0" class="courses-list">
          <div 
            v-for="(course, index) in filteredCourses" 
            :key="course.id"
            :class="['course-card', { featured: index === 0 }]"
            @click="goToCourse(course.path)"
          >
            <div v-if="index === 0" class="featured-image">
              <img :src="course.image" class="course-image" mode="aspectFill" />
              <div class="image-gradient"></div>
            </div>
            <div class="course-body">
              <span class="course-title">{{ course.title }}</span>
              <span class="course-desc">{{ course.desc }}</span>
              <div class="course-footer">
                <div class="footer-meta">
                  <span class="meta-icon">📝</span>
                  <span class="meta-text">{{ course.questions }}题</span>
                </div>
                <div class="footer-meta">
                  <span class="meta-icon">⏱️</span>
                  <span class="meta-text">{{ course.time }}</span>
                </div>
                <span class="footer-arrow">→</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📚</div>
          <span class="empty-title">暂无相关课程</span>
          <span class="empty-desc">当前分类下没有课程</span>
        </div>
        </div>
      </div>
    </div>
    <CustomTabBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import CustomTabBar from '@/components/CustomTabBar.vue'

const currentCategory = ref('all')

const categories = [
  { key: 'all', name: '全部', icon: '📚' },
  { key: 'psych', name: '心理测试', icon: '🧠' },
  { key: 'theory', name: '理论学习', icon: '📖' },
  { key: 'video', name: '视频学习', icon: '🎬' },
  { key: 'test', name: '安全测试', icon: '✅' }
]

const courses = [
  { 
    id: 1, 
    category: 'psych',
    title: '安全生产心理测试', 
    desc: '了解员工心理状态、安全意识、应急反应能力',
    questions: 20,
    time: '8分钟',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=mental%20health%20assessment%20professional%20blue%20gradient&image_size=landscape_16_9',
    path: '/training/psych-test'
  },
  { 
    id: 2, 
    category: 'theory',
    title: '安全知识理论课程', 
    desc: '安全生产法律法规、操作规程、应急预案',
    questions: 30,
    time: '15分钟',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=safety%20training%20education%20modern%20corporate&image_size=landscape_16_9',
    path: '/training/theory'
  },
  { 
    id: 3, 
    category: 'video',
    title: '安全操作视频培训', 
    desc: '设备正确操作方法和安全注意事项',
    questions: 15,
    time: '12分钟',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=video%20training%20safety%20equipment%20professional&image_size=landscape_16_9',
    path: '/training/video'
  },
  { 
    id: 4, 
    category: 'test',
    title: '安全常识综合测试', 
    desc: '检验安全知识掌握程度',
    questions: 25,
    time: '10分钟',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=exam%20testing%20assessment%20blue%20modern&image_size=landscape_16_9',
    path: '/training/safety-test'
  }
]

const filteredCourses = computed(() => {
  if (currentCategory.value === 'all') {
    return courses
  }
  return courses.filter(c => c.category === currentCategory.value)
})

const goToCourse = (path: string) => {
  uni.navigateTo({ url: `/pages${path}` })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
}

.page-content {
  padding-top: 0;
  padding-bottom: calc(#{$tabbar-height} + env(safe-area-inset-bottom));
  min-height: calc(100vh - #{$statusbar-height});
  display: flex;
  flex-direction: column;
  margin-top: calc(#{$navbar-height} + #{$statusbar-height} - 8px);
}

.courses-scroll-wrapper {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.tabs-container {
  display: flex;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tabs-scroll {
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.tabs-wrapper {
  display: inline-flex;
  padding: 0 16px;
  gap: 12px;
}

.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  border-radius: 14px;
  cursor: pointer;
  transition: all $transition-bounce;
  background: transparent;
  border: 1px solid transparent;
  
  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    border-color: rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
    
    .tab-icon {
      transform: scale(1.2);
    }
    
    .tab-text {
      color: $primary;
      font-weight: 600;
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.tab-icon {
  font-size: 22px;
  margin-bottom: 6px;
  transition: transform $transition-bounce;
}

.tab-text {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  transition: color $transition-normal;
  letter-spacing: -0.2px;
}

.tab-indicator {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  animation: indicatorPulse 2.5s ease-in-out infinite;
}

@keyframes indicatorPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translateX(-50%) scaleX(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scaleX(1.3);
  }
}

.courses-content {
  padding: $content-spacing;
  padding-bottom: calc(#{$spacing-base} + #{$tabbar-height});
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.course-card {
  background: #ffffff;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all $transition-bounce;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
    border-color: rgba(30, 64, 175, 0.1);
  }
  
  &:active {
    transform: scale(0.99);
  }
  
  &.featured {
    .course-body {
      padding: $spacing-base;
    }
  }
}

.featured-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 100%;
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
  
  .course-card:hover & {
    transform: scale(1.03);
  }
}

.image-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 80%);
}

.course-body {
  padding: $spacing-base;
}

.course-title {
  display: block;
  font-size: $text-size-lg;
  font-weight: $font-weight-bold;
  color: #1D1D1F;
  margin-bottom: $spacing-xs;
  letter-spacing: -0.3px;
}

.course-desc {
  display: block;
  font-size: $text-size-sm;
  color: #6B7280;
  line-height: $line-height-relaxed;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: $spacing-md;
  font-weight: $font-weight-medium;
}

.course-footer {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.meta-icon {
  font-size: 14px;
}

.meta-text {
  font-size: $text-size-xs;
  color: #9CA3AF;
  font-weight: $font-weight-medium;
}

.footer-arrow {
  margin-left: auto;
  font-size: 18px;
  color: #D1D5DB;
  transition: all $transition-normal;
  
  .course-card:hover & {
    color: $primary;
    transform: translateX(3px);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #1D1D1F;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #9CA3AF;
}
</style>
