<template>
  <div class="container">
    <CustomNavbar title="视频学习" :showBack="true" />
    <div class="page-content">
      <div class="section-header">
        <span class="section-title">视频课程</span>
        <span class="section-count">共 {{ videos.length }} 个视频</span>
      </div>
      
      <div class="video-list">
        <div 
          v-for="video in videos" 
          :key="video.id"
          :class="['video-card']"
          @click="playVideo(video)"
        >
          <div class="video-cover-wrapper">
            <div class="video-cover">
              <img :src="video.cover" mode="aspectFill" />
              <div class="cover-overlay">
                <div class="play-button">
                  <span class="play-icon">▶</span>
                </div>
              </div>
              <div class="duration-badge">{{ video.duration }}</div>
            </div>
          </div>
          
          <div class="video-content">
            <div class="video-header">
              <span class="video-title">{{ video.title }}</span>
            </div>
            
            <div class="video-meta">
              <div :class="['category-tag', getCategoryClass(video.category)]">
                {{ video.category }}
              </div>
              <div class="meta-info">
                <span class="meta-item">👁️ {{ video.views }}</span>
              </div>
            </div>
            
            <div class="video-desc">
              <span>{{ truncateDesc(video.description) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="videos.length === 0" class="empty-state">
        <div class="empty-icon">📹</div>
        <span class="empty-title">暂无视频课程</span>
        <span class="empty-desc">敬请期待更多精彩内容</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomNavbar from '@/components/CustomNavbar.vue'
import { videoLessons, type VideoLesson } from '@/data/mock.ts'

const videos = videoLessons

const getCategoryClass = (category: string) => {
  const classMap: Record<string, string> = {
    '安全培训': 'category-safety',
    '技能提升': 'category-skill',
    '科普知识': 'category-knowledge'
  }
  return classMap[category] || 'category-default'
}

const truncateDesc = (desc: string) => {
  return desc.length > 80 ? desc.slice(0, 80) + '...' : desc
}

const playVideo = (video: VideoLesson) => {
  alert(`即将播放: ${video.title}`)
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

.video-list {
  padding: 0 $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.video-card {
  background: #ffffff;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-bounce;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    
    .video-cover .cover-overlay {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
}

.video-cover-wrapper {
  position: relative;
}

.video-cover {
  position: relative;
  width: 100%;
  height: 180px;
  
  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity $transition-normal;
}

.play-button {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all $transition-bounce;
  
  &:hover {
    transform: scale(1.1);
  }
}

.play-icon {
  color: $primary;
  font-size: 18px;
  font-weight: bold;
  padding-left: 4px;
}

.duration-badge {
  position: absolute;
  bottom: $spacing-md;
  right: $spacing-md;
  padding: $spacing-xs $spacing-sm;
  background: rgba(0, 0, 0, 0.7);
  border-radius: $radius-xs;
  font-size: $text-size-xs;
  color: #ffffff;
  font-weight: $font-weight-medium;
}

.video-content {
  padding: $spacing-lg;
}

.video-header {
  margin-bottom: $spacing-sm;
}

.video-title {
  font-size: $text-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  line-height: $line-height-normal;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;
}

.category-tag {
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-xs;
  font-size: $text-size-xs;
  font-weight: $font-weight-medium;
  
  &.category-safety {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }
  
  &.category-skill {
    background: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
  }
  
  &.category-knowledge {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
  }
  
  &.category-default {
    background: rgba(107, 114, 128, 0.1);
    color: #6B7280;
  }
}

.meta-info {
  display: flex;
  gap: $spacing-md;
}

.meta-item {
  font-size: $text-size-xs;
  color: $text-muted;
}

.video-desc {
  font-size: $text-size-sm;
  color: $text-tertiary;
  line-height: $line-height-relaxed;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-5xl $spacing-xl;
  
  .empty-icon {
    font-size: 80px;
    margin-bottom: $spacing-lg;
  }
  
  .empty-title {
    font-size: $text-size-xl;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }
  
  .empty-desc {
    font-size: $text-size-base;
    color: $text-muted;
  }
}
</style>
