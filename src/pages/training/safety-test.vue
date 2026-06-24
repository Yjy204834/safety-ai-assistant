﻿﻿﻿﻿﻿<template>
  <div class="container">
    <CustomNavbar title="安全常识测试" :showBack="true" />
    <div class="page-content">
      <div v-if="!showResult" class="question-card">
        <div class="question-header">
          <span class="question-progress">{{ currentIndex + 1 }} / {{ questions.length }}</span>
        </div>
        <div class="question-content">
          <span class="question-text">{{ currentQuestion.question }}</span>
        </div>
        <div class="options-list">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            :class="['option-item', { selected: selectedAnswer === index }]"
            @click="selectOption(index)"
          >
            <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="option-text">{{ option }}</span>
          </div>
        </div>
        <div class="next-btn" :class="{ active: selectedAnswer !== null }" @click="nextQuestion">
          <span>{{ currentIndex === questions.length - 1 ? '提交答案' : '下一题' }}</span>
        </div>
      </div>
      <div v-else class="result-card">
        <div class="result-header">
          <span class="result-score">{{ score }}/{{ questions.length }}</span>
          <span class="result-icon">{{ resultIcon }}</span>
          <span class="result-title">测试完成</span>
        </div>
        <div class="result-content">
          <span class="result-desc">{{ resultDesc }}</span>
        </div>
        <div class="result-btn" @click="restartTest">
          <span>重新测试</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { safetyTestQuestions } from '@/data/mock.ts'

const questions = safetyTestQuestions
const currentIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)
const answers = ref<(number | null)[]>([])

const currentQuestion = computed(() => questions[currentIndex.value])

const score = computed(() => {
  return answers.value.reduce((count, answer, index) => {
    return count + (answer === questions[index].correct ? 1 : 0)
  }, 0)
})

const selectOption = (index: number) => {
  selectedAnswer.value = index
}

const nextQuestion = () => {
  if (selectedAnswer.value === null) return
  
  answers.value.push(selectedAnswer.value)
  selectedAnswer.value = null
  
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  } else {
    showResult.value = true
  }
}

const resultIcon = computed(() => {
  const rate = score.value / questions.length
  if (rate >= 0.9) return '🎉'
  if (rate >= 0.7) return '👍'
  if (rate >= 0.6) return '😊'
  return '💪'
})

const resultDesc = computed(() => {
  const rate = score.value / questions.length
  if (rate >= 0.9) return '优秀！你对安全知识掌握得很好。'
  if (rate >= 0.7) return '良好！继续努力学习更多安全知识。'
  if (rate >= 0.6) return '及格！建议复习安全知识。'
  return '需要加强学习安全知识，加油！'
})

const restartTest = () => {
  currentIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  answers.value = []
}
</script>

<style lang="scss" scoped>
.question-card {
  background: #ffffff;
  margin: 24rpx;
  border-radius: 12px;
  padding: 32rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.question-header {
  text-align: right;
}

.question-progress {
  font-size: 24rpx;
  color: #1890ff;
  font-weight: 600;
}

.question-content {
  margin-top: 32rpx;
}

.question-text {
  font-size: 32rpx;
  color: #333333;
  line-height: 1.5;
}

.options-list {
  margin-top: 32rpx;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f5f5f5;
  border-radius: 8px;
  border: 2rpx solid transparent;
  transition: all 0.3s;
  
  &.selected {
    background: #e6f7ff;
    border-color: #1890ff;
  }
}

.option-letter {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1890ff;
  color: #ffffff;
  border-radius: 50%;
  font-size: 24rpx;
  font-weight: 600;
  margin-right: 24rpx;
}

.option-text {
  font-size: 28rpx;
  color: #333333;
}

.next-btn {
  margin-top: 32rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #999999;
  font-size: 28rpx;
  transition: all 0.3s;
  
  &.active {
    background: linear-gradient(135deg, #1890ff, #096dd9);
    color: #ffffff;
  }
}

.result-card {
  background: #ffffff;
  margin: 24rpx;
  border-radius: 12px;
  padding: 48rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.result-score {
  font-size: 80rpx;
  font-weight: 700;
  color: #1890ff;
}

.result-icon {
  font-size: 80rpx;
  margin-left: 24rpx;
}

.result-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-top: 24rpx;
  display: block;
}

.result-content {
  margin-top: 32rpx;
}

.result-desc {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.result-btn {
  margin-top: 48rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1890ff, #096dd9);
  border-radius: 8px;
  color: #ffffff;
  font-size: 28rpx;
}
</style>
