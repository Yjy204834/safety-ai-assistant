﻿﻿﻿﻿﻿﻿<template>
  <div class="container">
    <CustomNavbar title="零部件采购统计" :showBack="true" />
    <div class="page-content">
      <div class="summary-section">
        <div class="summary-card">
          <div class="card-bg"></div>
          <div class="summary-icon">💰</div>
          <span class="summary-value">{{ totalAmount }}</span>
          <span class="summary-label">采购总金额</span>
        </div>
        <div class="summary-card">
          <div class="card-bg secondary"></div>
          <div class="summary-icon">📋</div>
          <span class="summary-value">{{ totalOrders }}</span>
          <span class="summary-label">采购订单数</span>
        </div>
        <div class="summary-card">
          <div class="card-bg accent"></div>
          <div class="summary-icon">🔧</div>
          <span class="summary-value">{{ totalParts }}</span>
          <span class="summary-label">零部件种类</span>
        </div>
      </div>
      <div class="chart-section">
        <div class="section-header">
          <span class="section-title">月度采购趋势</span>
          <span class="section-subtitle">近6个月</span>
        </div>
        <div class="chart-container">
          <div class="chart-bars">
            <div 
              v-for="item in monthlyData" 
              :key="item.month"
              class="bar-item"
            >
              <div class="bar-wrapper">
                <div class="bar" :style="{ height: item.percent + '%' }"></div>
                <div class="bar-glow" :style="{ height: item.percent + '%' }"></div>
              </div>
              <span class="bar-label">{{ item.month }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-header">
          <span class="section-title">采购详情</span>
          <span class="section-count">{{ purchaseData.length }}项</span>
        </div>
        <div class="detail-list">
          <div 
            v-for="item in purchaseData" 
            :key="item.id"
            class="detail-item"
          >
            <div class="detail-icon-wrapper">
              <span class="detail-icon">{{ item.icon }}</span>
            </div>
            <div class="detail-info">
              <span class="detail-name">{{ item.name }}</span>
              <span class="detail-spec">{{ item.spec }}</span>
            </div>
            <div class="detail-amount">
              <span class="amount-value">{{ item.amount }}</span>
              <span class="amount-count">x{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { purchaseData, monthlyPurchaseData } from '@/data/mock.ts'

const totalAmount = computed(() => {
  const total = purchaseData.reduce((sum, item) => sum + item.amount, 0)
  return '¥' + total.toLocaleString()
})

const totalOrders = computed(() => purchaseData.length)

const totalParts = computed(() => {
  return new Set(purchaseData.map(item => item.name)).size
})

const monthlyData = computed(() => {
  const max = Math.max(...monthlyPurchaseData.map(m => m.amount))
  return monthlyPurchaseData.map(m => ({
    month: m.month,
    percent: Math.round((m.amount / max) * 100)
  }))
})
</script>

<style lang="scss" scoped>
.summary-section {
  display: flex;
  padding: 24rpx;
  gap: 16rpx;
}

.summary-card {
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  padding: 24rpx;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.summary-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #1890ff;
}

.summary-label {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-top: 8rpx;
}

.chart-section {
  padding: 0 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.chart-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 24rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200rpx;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-wrapper {
  width: 32rpx;
  height: 160rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #1890ff, #096dd9);
  border-radius: 16rpx;
  transition: height 0.5s;
}

.bar-label {
  font-size: 22rpx;
  color: #999999;
  margin-top: 8rpx;
}

.detail-section {
  padding: 24rpx;
  padding-bottom: 120rpx;
}

.detail-list {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.detail-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.detail-info {
  flex: 1;
}

.detail-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
}

.detail-spec {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-top: 4rpx;
}

.detail-amount {
  text-align: right;
}

.amount-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #1890ff;
}

.amount-count {
  font-size: 22rpx;
  color: #999999;
  display: block;
}
</style>
