<template>
  <div class="container">
    <CustomNavbar title="心理测试" :showBack="true" />
    <div class="page-content">
      <div v-if="!showResult" class="question-card">
        <div class="card-header">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">
            <span>{{ currentIndex + 1 }} / {{ questions.length }}</span>
            <span class="progress-label">完成进度</span>
          </div>
        </div>
        
        <div class="question-wrapper">
          <div class="question-icon">💭</div>
          <div class="question-content">
            <span class="question-number">第 {{ currentIndex + 1 }} 题</span>
            <span class="question-text">{{ currentQuestion.question }}</span>
          </div>
        </div>
        
        <div class="options-list">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            :class="['option-item', { selected: selectedAnswer === index }]"
            @click="selectOption(index)"
          >
            <div class="option-indicator">
              <span class="option-number">{{ ['A', 'B', 'C', 'D'][index] }}</span>
            </div>
            <span class="option-text">{{ option }}</span>
            <div v-if="selectedAnswer === index" class="option-check">✓</div>
          </div>
        </div>
        
        <div class="action-area">
          <div 
            :class="['next-btn', { active: selectedAnswer !== null }]" 
            @click="nextQuestion"
          >
            <span>{{ currentIndex === questions.length - 1 ? '提交答案' : '下一题' }}</span>
            <span v-if="selectedAnswer !== null" class="btn-arrow">→</span>
          </div>
        </div>
      </div>
      
      <div v-else class="result-card">
        <div class="result-header">
          <div class="result-icon-wrapper">
            <span class="result-icon">{{ resultIcon }}</span>
            <div class="icon-glow"></div>
          </div>
          <span class="result-title">测试结果</span>
        </div>
        
        <div class="result-content">
          <span class="result-desc">{{ resultDesc }}</span>
          
          <div class="result-stats">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <span class="stat-value">{{ stressLevel }}</span>
                <span class="stat-label">压力指数</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🧠</div>
              <div class="stat-info">
                <span class="stat-value">{{ mentalScore }}分</span>
                <span class="stat-label">心理健康</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💡</div>
              <div class="stat-info">
                <span class="stat-value">{{ suggestion }}</span>
                <span class="stat-label">建议</span>
              </div>
            </div>
          </div>
          
          <div class="score-bar">
            <div class="score-label">心理健康评分</div>
            <div class="score-track">
              <div 
                class="score-fill" 
                :style="{ width: mentalScore + '%' }"
                :class="scoreColorClass"
              ></div>
              <div class="score-markers">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
            <div class="score-value">{{ mentalScore }}/100</div>
          </div>
        </div>
        
        <div class="result-btn" @click="restartTest">
          <span>🔄 重新测试</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import { psychTestQuestions } from '@/data/mock.ts'

const questions = psychTestQuestions
const currentIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)
const answers = ref<number[]>([])

const currentQuestion = computed(() => questions[currentIndex.value])

const progressPercent = computed(() => ((currentIndex.value + 1) / questions.length) * 100)

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

const stressLevel = computed(() => {
  const avg = answers.value.reduce((a, b) => a + b, 0) / answers.value.length
  if (avg <= 1.5) return '低'
  if (avg <= 2.5) return '中'
  return '高'
})

const mentalScore = computed(() => {
  const avg = answers.value.reduce((a, b) => a + b, 0) / answers.value.length
  return Math.max(0, 100 - avg * 20).toFixed(0)
})

const scoreColorClass = computed(() => {
  const score = parseInt(mentalScore.value)
  if (score >= 70) return 'good'
  if (score >= 40) return 'medium'
  return 'danger'
})

const resultIcon = computed(() => {
  const score = parseInt(mentalScore.value)
  if (score >= 80) return '😊'
  if (score >= 60) return '😐'
  return '😔'
})

const resultDesc = computed(() => {
  const score = parseInt(mentalScore.value)
  if (score >= 80) return '你的心理状态良好，请继续保持积极乐观的心态！'
  if (score >= 60) return '你的心理状态一般，建议适当放松休息，多与他人交流。'
  return '你的心理状态需要关注，建议寻求专业心理咨询师的帮助。'
})

const suggestion = computed(() => {
  const score = parseInt(mentalScore.value)
  if (score >= 80) return '保持乐观'
  if (score >= 60) return '适当休息'
  return '寻求帮助'
})

const restartTest = () => {
  currentIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  answers.value = []
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

.question-card {
  margin: $spacing-lg;
  background: #ffffff;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
}

.card-header {
  padding: $spacing-lg;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%);
}

.progress-bar {
  height: 6px;
  background: #E2E8F0;
  border-radius: $radius-full;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $primary-gradient;
  border-radius: $radius-full;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: $spacing-sm;
  
  span {
    font-size: $text-size-sm;
    font-weight: $font-weight-medium;
    color: $text-secondary;
  }
  
  .progress-label {
    color: $text-muted;
    font-weight: $font-weight-normal;
  }
}

.question-wrapper {
  display: flex;
  gap: $spacing-base;
  padding: $spacing-lg;
}

.question-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.08);
  border-radius: $radius-md;
  font-size: 24px;
  flex-shrink: 0;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.question-number {
  font-size: $text-size-xs;
  color: $accent;
  font-weight: $font-weight-medium;
}

.question-text {
  font-size: $text-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  line-height: $line-height-relaxed;
}

.options-list {
  padding: 0 $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.option-item {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  padding: $spacing-lg;
  background: $bg-tertiary;
  border-radius: $radius-md;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all $transition-normal;
  
  &:hover {
    background: $bg-hover;
    transform: translateX(4px);
  }
  
  &.selected {
    background: rgba(30, 64, 175, 0.06);
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.08);
    
    .option-indicator {
      background: $primary-gradient;
      border-color: $primary;
      
      .option-number {
        color: #ffffff;
      }
    }
  }
}

.option-indicator {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 2px solid $border-color;
  border-radius: $radius-full;
  transition: all $transition-normal;
  flex-shrink: 0;
}

.option-number {
  font-size: $text-size-xs;
  font-weight: $font-weight-bold;
  color: $text-tertiary;
}

.option-text {
  flex: 1;
  font-size: $text-size-base;
  color: $text-primary;
  line-height: $line-height-normal;
}

.option-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary;
  color: #ffffff;
  border-radius: $radius-full;
  font-size: 12px;
  font-weight: bold;
}

.action-area {
  padding: $spacing-lg;
}

.next-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  height: $button-height-lg;
  padding: 0 $spacing-xl;
  background: $bg-tertiary;
  border-radius: $radius-md;
  font-size: $text-size-base;
  font-weight: $font-weight-semibold;
  color: $text-muted;
  cursor: pointer;
  transition: all $transition-bounce;
  
  &.active {
    background: $gradient-button;
    color: #ffffff;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.35);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(30, 64, 175, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

.btn-arrow {
  font-size: $text-size-lg;
  font-weight: $font-weight-normal;
}

.result-card {
  margin: $spacing-lg;
  background: #ffffff;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
}

.result-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-2xl $spacing-lg;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.result-icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-icon {
  font-size: 56px;
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.result-title {
  font-size: $text-size-2xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin-top: $spacing-md;
}

.result-content {
  padding: $spacing-lg;
}

.result-desc {
  font-size: $text-size-base;
  color: $text-secondary;
  line-height: $line-height-relaxed;
  text-align: center;
  display: block;
}

.result-stats {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-top: $spacing-lg;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  padding: $spacing-lg;
  background: $bg-tertiary;
  border-radius: $radius-md;
  border: 1px solid $border-subtle;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 64, 175, 0.08);
  border-radius: $radius-md;
  font-size: 24px;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: $text-size-lg;
  font-weight: $font-weight-bold;
  color: $primary;
}

.stat-label {
  font-size: $text-size-xs;
  color: $text-muted;
  margin-top: 2px;
}

.score-bar {
  margin-top: $spacing-xl;
  padding: $spacing-lg;
  background: $bg-tertiary;
  border-radius: $radius-md;
}

.score-label {
  font-size: $text-size-sm;
  font-weight: $font-weight-medium;
  color: $text-secondary;
  margin-bottom: $spacing-md;
  display: block;
}

.score-track {
  position: relative;
  height: 12px;
  background: #E2E8F0;
  border-radius: $radius-full;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: $radius-full;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.good {
    background: linear-gradient(90deg, #10B981, #34D399);
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
  }
  
  &.medium {
    background: linear-gradient(90deg, #F59E0B, #FBBF24);
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
  }
  
  &.danger {
    background: linear-gradient(90deg, #EF4444, #F87171);
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
  }
}

.score-markers {
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-xs;
  
  span {
    font-size: $text-size-xxs;
    color: $text-muted;
  }
}

.score-value {
  display: block;
  text-align: right;
  font-size: $text-size-md;
  font-weight: $font-weight-bold;
  color: $primary;
  margin-top: $spacing-sm;
}

.result-btn {
  margin: $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  height: $button-height-lg;
  padding: 0 $spacing-xl;
  background: $gradient-button;
  border-radius: $radius-md;
  font-size: $text-size-base;
  font-weight: $font-weight-semibold;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.35);
  transition: all $transition-bounce;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(30, 64, 175, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>
