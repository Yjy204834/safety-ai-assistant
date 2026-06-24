﻿﻿﻿﻿﻿<template>
  <div class="salary-page">
    <CustomNavbar title="薪资查询" :showBack="true" />
    <div class="page-content">
      <div class="salary-summary">
        <div class="summary-header">
          <span class="summary-title">本月薪资</span>
          <span class="summary-date">{{ currentMonth }}</span>
        </div>
        <div class="summary-amount">
          <span class="amount-label">¥</span>
          <span class="amount-value">{{ currentSalary?.actualSalary || 0 }}</span>
        </div>
        <div class="summary-details">
          <div class="detail-item">
            <span class="detail-label">应发薪资</span>
            <span class="detail-value">¥{{ currentSalary?.totalSalary || 0 }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">扣款</span>
            <span class="detail-value">¥{{ currentSalary?.deductions || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="salary-list">
        <div class="list-header">
          <span class="list-title">历史记录</span>
        </div>
        <div 
          v-for="salary in salaryRecords" 
          :key="salary.id"
          class="salary-item"
          @click="toggleDetail(salary.id)"
        >
          <div class="salary-info">
            <div class="salary-month">{{ salary.year }}年{{ salary.month }}月</div>
            <div class="salary-status" :class="{ paid: salary.isPaid }">
              {{ salary.isPaid ? '已发放' : '待发放' }}
            </div>
          </div>
          <div class="salary-right">
            <span class="salary-amount">¥{{ salary.actualSalary }}</span>
            <span class="salary-arrow">›</span>
          </div>
          <div v-if="expandedId === salary.id" class="salary-detail">
            <div class="detail-row">
              <span class="detail-key">基本工资</span>
              <span class="detail-val">¥{{ salary.baseSalary }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">绩效奖金</span>
              <span class="detail-val">¥{{ salary.performanceBonus }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">加班工资</span>
              <span class="detail-val">¥{{ salary.overtimePay }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">津贴</span>
              <span class="detail-val">¥{{ salary.allowance }}</span>
            </div>
            <div class="detail-row total">
              <span class="detail-key">应发合计</span>
              <span class="detail-val">¥{{ salary.totalSalary }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">扣款</span>
              <span class="detail-val deduct">¥{{ salary.deductions }}</span>
            </div>
            <div class="detail-row total">
              <span class="detail-key">实发工资</span>
              <span class="detail-val highlight">¥{{ salary.actualSalary }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">发放日期</span>
              <span class="detail-val">{{ salary.paymentDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { salaryRecords, type SalaryRecord } from '@/data/mock'

const expandedId = ref<number | null>(null)

const currentMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月`
})

const currentSalary = computed(() => {
  return salaryRecords[0]
})

const toggleDetail = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<style lang="scss" scoped>
.salary-page {
  min-height: 100vh;
  background: #F5F7FA;
}

.page-content {
  padding: 12px 16px calc(#{$tabbar-height} + 12px);
}

.salary-summary {
  background: linear-gradient(135deg, #0F52BA 0%, #1E6ED8 50%, #2563EB 100%);
  border-radius: 20px;
  padding: 24px 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(15, 82, 186, 0.25);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.summary-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.summary-date {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.summary-amount {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 24px;
}

.amount-label {
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.amount-value {
  font-size: 40px;
  font-weight: 700;
  color: #FFFFFF;
}

.summary-details {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
}

.salary-list {
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.list-header {
  padding: 16px;
  border-bottom: 1px solid #F0F2F5;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
  color: #1D1D1F;
}

.salary-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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

.salary-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.salary-month {
  font-size: 15px;
  font-weight: 500;
  color: #1D1D1F;
}

.salary-status {
  font-size: 12px;
  color: #86868B;

  &.paid {
    color: #10B981;
  }
}

.salary-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.salary-amount {
  font-size: 18px;
  font-weight: 600;
  color: #1D1D1F;
}

.salary-arrow {
  font-size: 20px;
  color: #C7C7CC;
  font-weight: 300;
  transition: transform 0.2s ease;
}

.salary-detail {
  width: 100%;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #F0F2F5;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 13px;

  &.total {
    padding-top: 12px;
    margin-top: 4px;
    border-top: 1px dashed #E5E7EB;
    font-weight: 500;
  }
}

.detail-key {
  color: #86868B;
}

.detail-val {
  color: #1D1D1F;

  &.deduct {
    color: #EF4444;
  }

  &.highlight {
    font-size: 16px;
    color: #0F52BA;
    font-weight: 600;
  }
}
</style>
