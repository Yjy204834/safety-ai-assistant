<template>
  <div class="container">
    <CustomNavbar title="集团动态">
      <div class="tabs-container">
        <div class="tabs-wrapper">
          <div 
            v-for="cat in categories" 
            :key="cat.key"
            :class="['tab-item', { active: currentCategory === cat.key }]"
            @click="currentCategory = cat.key"
          >
            <span class="tab-text">{{ cat.label }}</span>
          </div>
        </div>
      </div>
    </CustomNavbar>
    <div class="page-content">
      <div class="news-content">
        <div v-if="filteredNews.length > 0" class="news-list">
          <div 
            v-for="(news, index) in filteredNews" 
            :key="news.id"
            :class="['news-card', { featured: index === 0 }]"
            @click="goToDetail(news.id)"
          >
            <div v-if="index === 0" class="featured-image">
              <img :src="news.image" class="news-image" mode="aspectFill" />
              <div class="image-gradient"></div>
              <div class="featured-badge">{{ news.category }}</div>
            </div>
            <div v-else class="news-image-wrapper">
              <img :src="news.image" class="news-image" mode="aspectFill" />
            </div>
            <div class="news-body">
              <span class="news-title">{{ news.title }}</span>
              <span class="news-summary">{{ news.summary }}</span>
              <div class="news-footer">
                <span class="footer-author">{{ news.author }}</span>
                <span class="footer-time">{{ news.time }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">📭</div>
          <span class="empty-title">暂无相关动态</span>
          <span class="empty-desc">当前分类下没有内容</span>
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
import { newsList } from '@/data/mock.ts'

const currentCategory = ref('all')

const categories = [
  { key: 'all', label: '全部' },
  { key: '公司动态', label: '公司动态' },
  { key: '行业资讯', label: '行业资讯' },
  { key: '安全公告', label: '安全公告' },
  { key: '政策法规', label: '政策法规' }
]

const filteredNews = computed(() => {
  if (currentCategory.value === 'all') {
    return newsList
  }
  return newsList.filter(n => n.category === currentCategory.value)
})

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/news/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #F5F5F5;
}

.page-content {
  padding-top: calc(56px + var(--status-bar-height, 24px));
  padding-bottom: calc(68px + env(safe-area-inset-bottom));
}

.tabs-container {
  display: flex;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 5px;
}

.tabs-wrapper {
  display: flex;
  gap: 10px;
  width: 100%;
  padding: 0 16px;
}

.tab-item {
  flex: 1;
  padding: 10px 12px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &.active {
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    .tab-text {
      color: #1E40AF;
      font-weight: 600;
    }
  }
}

.tab-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.news-content {
  padding: 16px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  
  &.featured {
    .news-body {
      padding: 20px;
    }
  }
  
  &:not(.featured) {
    display: flex;
    
    .news-body {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
    }
    
    .news-summary {
      flex: 1;
    }
  }
}

.featured-image {
  position: relative;
  height: 200px;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 70%);
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #1E40AF;
}

.news-card:not(.featured) .news-image-wrapper {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;
}

.news-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1D1D1F;
  line-height: 1.4;
  margin-bottom: 8px;
}

.news-summary {
  display: block;
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
}

.footer-author {
  font-size: 12px;
  color: #1E40AF;
  font-weight: 600;
}

.footer-time {
  font-size: 12px;
  color: #9CA3AF;
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
