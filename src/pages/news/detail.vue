﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿<template>
  <div class="container">
    <CustomNavbar title="新闻详情" :showBack="true" />
    <div class="page-content">
      <div class="detail-card">
        <div class="detail-header">
          <span class="detail-title">{{ news?.title }}</span>
          <div class="detail-meta">
            <span class="meta-author">{{ news?.author }}</span>
            <span class="meta-divider">·</span>
            <span class="meta-time">{{ news?.time }}</span>
          </div>
        </div>
        
        <div v-if="news?.image" class="detail-image-wrapper">
          <img :src="news.image" class="detail-image" mode="aspectFill" />
          <div class="image-overlay"></div>
        </div>
        
        <div class="detail-content">
          <div class="content-section">
            <span v-for="(paragraph, index) in contentParagraphs" :key="index" class="content-paragraph">
              {{ paragraph }}
            </span>
          </div>
          
          <div class="content-highlights" v-if="contentParagraphs.length > 2">
            <div class="highlights-title">📌 重点内容</div>
            <ul class="highlights-list">
              <li v-for="(item, index) in highlightedItems" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
        
        <div class="detail-footer">
          <div class="share-buttons">
            <button class="share-btn">
              <span class="share-icon">📤</span>
              <span>分享</span>
            </button>
            <button class="favorite-btn">
              <span class="favorite-icon">❤️</span>
              <span>收藏</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { newsList } from '@/data/mock.ts'

const newsId = ref(1)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = (currentPage as any).$page?.options || {}
  newsId.value = Number(options.id) || 1
})

const news = computed(() => {
  return newsList.find(n => n.id === newsId.value)
})

const contentParagraphs = computed(() => {
  if (!news.value?.content) return []
  return news.value.content.split('\n\n').filter(p => p.trim())
})

const highlightedItems = computed(() => {
  if (!news.value?.content) return []
  const content = news.value.content
  const lines = content.split('\n')
  const items: string[] = []
  
  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || 
        trimmed.startsWith('4.') || trimmed.startsWith('5.') || trimmed.startsWith('·')) {
      items.push(trimmed.replace(/^[1-5]\.\s*/, '').replace(/^·\s*/, ''))
    }
  })
  
  return items.slice(0, 5)
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
}

.page-content {
  padding-top: calc(#{$navbar-height} + #{$statusbar-height});
  padding-bottom: calc(#{$tabbar-height} + env(safe-area-inset-bottom) + 20px);
  min-height: 100vh;
}

.detail-card {
  background: #ffffff;
  margin: 16px;
  border-radius: 20px;
  padding: 0;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.detail-header {
  padding: 24px;
}

.detail-title {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #1D1D1F;
  line-height: 1.5;
  letter-spacing: -0.3px;
  margin-bottom: 16px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-author {
  font-size: 14px;
  color: $primary;
  font-weight: 600;
  padding: 4px 12px;
  background: rgba(30, 64, 175, 0.08);
  border-radius: 12px;
}

.meta-divider {
  color: #D1D5DB;
  font-size: 12px;
}

.meta-time {
  font-size: 13px;
  color: #9CA3AF;
  font-weight: 500;
}

.detail-image-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  
  .detail-card & {
    margin: 0;
    border-radius: 0;
  }
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3) 100%);
}

.detail-content {
  padding: 24px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-paragraph {
  display: block;
  font-size: 15px;
  color: #4B5563;
  line-height: 1.8;
  text-align: justify;
  letter-spacing: 0.3px;
  
  &:first-child {
    font-weight: 500;
    color: #374151;
  }
}

.content-highlights {
  margin-top: 28px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(30, 64, 175, 0.1);
}

.highlights-title {
  font-size: 14px;
  font-weight: 700;
  color: #1D1D1F;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.highlights-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlights-list li {
  font-size: 14px;
  color: #4B5563;
  line-height: 1.6;
  padding-left: 20px;
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, $primary 0%, #1d4ed8 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: white;
    font-weight: 700;
  }
}

.detail-footer {
  padding: 20px 24px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.share-buttons {
  display: flex;
  gap: 16px;
}

.share-btn,
.favorite-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #F9FAFB;
  font-size: 14px;
  font-weight: 600;
  color: #4B5563;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: #F3F4F6;
    border-color: rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
}

.share-icon,
.favorite-icon {
  font-size: 18px;
}
</style>
