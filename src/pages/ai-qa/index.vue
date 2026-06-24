<template>
  <view class="container">
    <CustomNavbar title="AI智能助手" :showBack="true">
      <view class="navbar-tools">
        <view class="tool-btn" @tap="showHistory = !showHistory">
          <text>📋</text>
        </view>
        <view class="tool-btn" @tap="clearChat">
          <text>✨</text>
        </view>
      </view>
    </CustomNavbar>
    
    <view class="page-content">
      <view v-if="showHistory" class="history-panel">
        <view class="history-header">
          <text class="history-title">📋 历史记录</text>
          <view class="history-actions">
            <view v-if="historyList.length > 0" class="clear-btn" @tap="clearAllHistory">清空</view>
            <view class="close-btn" @tap="showHistory = false">✕</view>
          </view>
        </view>
        
        <view v-if="historyList.length === 0" class="history-empty">
          <text class="empty-icon">🔍</text>
          <text class="empty-text">暂无历史记录</text>
          <text class="empty-hint">开始对话后，记录会保存在这里</text>
        </view>
        
        <view v-else class="history-list">
          <view 
            v-for="item in historyList" 
            :key="item.id" 
            class="history-item"
            @tap="loadHistoryItem(item)"
          >
            <view class="history-item-content">
              <text class="history-title-text">{{ item.title }}</text>
              <text class="history-time">{{ formatTime(item.time) }}</text>
            </view>
            <view class="delete-btn" @tap.stop="deleteHistoryItem(item.id)">×</view>
          </view>
        </view>
      </view>
      
      <scroll-view class="chat-section" scroll-y :scroll-into-view="scrollToId">
        <view class="chat-content">
          <view 
            v-for="(item, index) in messages" 
            :key="index"
            :id="'msg-' + index"
            :class="['chat-message', { 'is-user': item.isUser }]"
          >
            <view class="message-avatar">
              <text>{{ item.isUser ? '👤' : '🤖' }}</text>
            </view>
            <view class="message-content">
              <view v-if="item.images && item.images.length > 0" class="message-images">
                <view 
                  v-for="(img, imgIdx) in item.images" 
                  :key="imgIdx"
                  class="message-image-wrapper"
                >
                  <image :src="img" class="message-image" mode="widthFix" />
                </view>
              </view>
              <view v-if="item.attachments && item.attachments.length > 0" class="message-attachments">
                <view 
                  v-for="(file, fileIdx) in item.attachments" 
                  :key="fileIdx"
                  class="attachment-item"
                >
                  <text class="attachment-icon">{{ getFileIcon(file.type) }}</text>
                  <view class="attachment-info">
                    <text class="attachment-name">{{ file.name }}</text>
                    <text class="attachment-size">{{ formatFileSize(file.size) }}</text>
                  </view>
                </view>
              </view>
              <view :class="['message-bubble', { user: item.isUser }]">
                <text class="message-text">{{ item.content }}</text>
              </view>
              <text class="message-time">{{ formatTime(item.id) }}</text>
            </view>
          </view>

          <view v-if="messages.length <= 1 && !messages.some(m => m.isUser)" class="empty-chat">
            <view class="empty-header">
              <view class="avatar-section">
                <view class="avatar">
                  <text class="avatar-icon">🤖</text>
                </view>
                <view class="avatar-ring"></view>
                <view class="avatar-pulse"></view>
              </view>
              <text class="empty-title">AI智能助手</text>
              <text class="empty-description">我可以帮您解答各类问题，支持图片识别和文档分析</text>
            </view>
            
            <view class="quick-section">
              <view class="quick-header">
                <text class="quick-icon">🔥</text>
                <text class="quick-label">热门问题</text>
              </view>
              <view class="quick-tags">
                <view v-for="(q, idx) in quickQuestions" :key="idx" class="quick-tag" @tap="quickQuestion(q)">
                  <text class="tag-text">{{ q }}</text>
                  <text class="tag-arrow">→</text>
                </view>
              </view>
            </view>
          </view>

          <view v-if="isTyping" class="typing-indicator">
            <view class="typing-dots">
              <view class="dot"></view>
              <view class="dot"></view>
              <view class="dot"></view>
            </view>
            <text class="typing-text">AI正在思考...</text>
          </view>
        </view>
      </scroll-view>

      <view class="input-section">
        <view v-if="attachedFiles.length > 0" class="attached-files">
          <view 
            v-for="(file, index) in attachedFiles" 
            :key="index"
            class="attached-file"
          >
            <view class="file-preview">
              <image v-if="file.type.startsWith('image')" :src="file.preview" class="file-thumbnail" mode="aspectFill" />
              <text v-else class="file-icon">{{ getFileIcon(file.type) }}</text>
            </view>
            <text class="file-name">{{ file.name }}</text>
            <text class="file-remove" @tap="removeFile(index)">×</text>
          </view>
        </view>
        <view class="input-wrapper">
          <view class="tool-buttons">
            <view class="tool-btn" @tap="triggerImageUpload">
              <text>🖼️</text>
            </view>
            <view class="tool-btn" @tap="triggerDocUpload">
              <text>📎</text>
            </view>
          </view>
          <input 
            v-model="inputMessage" 
            class="input-field" 
            placeholder="输入您的问题，或上传图片..."
            confirm-type="send"
            @confirm="sendMessage"
          />
          <view 
            :class="['send-button', { active: canSend }]"
            @tap="sendMessage"
          >
            <text class="send-arrow">↑</text>
          </view>
        </view>
      </view>
    </view>
    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { type Message, mockAnswers } from '@/data/mock.ts'

interface AttachmentFile {
  name: string
  type: string
  size: number
  preview?: string
  content?: string
}

interface HistoryItem {
  id: string
  title: string
  messages: Message[]
  time: number
}

const quickQuestions = [
  '电解槽的工作原理是什么？',
  '如何提高生产效率？',
  '设备维护的注意事项'
]

const inputMessage = ref('')
const messages = ref<Message[]>([])
const isTyping = ref(false)
const attachedFiles = ref<AttachmentFile[]>([])
const showHistory = ref(false)
const historyList = ref<HistoryItem[]>([])
const scrollToId = ref('')

const canSend = computed(() => {
  return inputMessage.value.trim() || attachedFiles.value.length > 0
})

const loadHistory = () => {
  const stored = uni.getStorageSync('ai-chat-history')
  if (stored) {
    try {
      historyList.value = JSON.parse(stored)
    } catch (e) {
      console.error('加载历史记录失败:', e)
    }
  }
}

const saveHistory = () => {
  uni.setStorageSync('ai-chat-history', JSON.stringify(historyList.value))
}

const addToHistory = () => {
  const userMessages = messages.value.filter(m => m.isUser)
  if (userMessages.length === 0) return
  
  const lastUserMessage = userMessages[userMessages.length - 1]
  
  const newHistory: HistoryItem = {
    id: Date.now().toString(),
    title: lastUserMessage.content.substring(0, 30) + (lastUserMessage.content.length > 30 ? '...' : ''),
    messages: [...messages.value],
    time: Date.now()
  }
  
  historyList.value.unshift(newHistory)
  if (historyList.value.length > 20) {
    historyList.value = historyList.value.slice(0, 20)
  }
  saveHistory()
}

const loadHistoryItem = (item: HistoryItem) => {
  messages.value = [...item.messages]
  showHistory.value = false
  nextTick(() => {
    scrollToId.value = 'msg-' + (messages.value.length - 1)
  })
}

const deleteHistoryItem = (id: string) => {
  historyList.value = historyList.value.filter(item => item.id !== id)
  saveHistory()
}

const clearAllHistory = () => {
  historyList.value = []
  saveHistory()
}

onMounted(() => {
  loadHistory()
  messages.value = [{
    id: Date.now(),
    content: '您好！我是AI智能助手，可以帮您解答各类问题，支持图片识别和文档分析。请问有什么可以帮助您的？',
    isUser: false
  }]
})

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return '📕'
  if (type.includes('word') || type.includes('document')) return '📘'
  if (type.includes('sheet') || type.includes('excel')) return '📗'
  if (type.includes('image')) return '🖼️'
  return '📄'
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const triggerImageUpload = () => {
  uni.chooseImage({
    count: 9,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      res.tempFiles.forEach(file => {
        attachedFiles.value.push({
          name: file.name || 'image.jpg',
          type: 'image/jpeg',
          size: file.size,
          preview: file.tempFilePath
        })
      })
    }
  })
}

const triggerDocUpload = () => {
  uni.showToast({
    title: '文档上传功能开发中',
    icon: 'none'
  })
}

const removeFile = (index: number) => {
  attachedFiles.value.splice(index, 1)
}

const clearChat = () => {
  messages.value = [{
    id: Date.now(),
    content: '您好！我是AI智能助手，可以帮您解答各类问题，支持图片识别和文档分析。请问有什么可以帮助您的？',
    isUser: false
  }]
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.getHours().toString().padStart(2, '0') + ':' + 
         date.getMinutes().toString().padStart(2, '0')
}

const quickQuestion = (question: string) => {
  inputMessage.value = question
  sendMessage()
}

const getMockAnswer = (question: string, images?: string[], attachments?: AttachmentFile[]) => {
  if (images && images.length > 0) {
    return '我已经收到了您上传的图片！让我来分析一下：图片显示的内容看起来与工业生产或安全管理相关。根据图片内容，我建议您可以关注以下几个方面...'
  }
  
  if (attachments && attachments.length > 0) {
    return '我已经收到了您上传的文档"' + attachments[0].name + '"！正在分析文档内容...根据文档内容，我可以为您提供以下建议和解读...'
  }

  if (question.includes('工作原理') || question.includes('原理')) {
    return '电解槽是通过电解作用将电能转化为化学能的装置。其工作原理是：在电场作用下，电解液中的离子定向移动，在阳极发生氧化反应，在阴极发生还原反应。通过控制电流、电压和温度等参数，可以实现高效的电解过程。'
  }
  
  if (question.includes('效率') || question.includes('提高')) {
    return '提高生产效率可以从以下几个方面入手：1.优化工艺流程，减少不必要的环节；2.引入自动化和智能化设备；3.加强员工培训，提高操作技能；4.建立完善的质量管理体系；5.定期维护设备，保证设备正常运行。'
  }
  
  if (question.includes('维护') || question.includes('保养')) {
    return '设备维护的注意事项：1.制定定期维护计划；2.做好维护记录；3.使用原厂配件；4.维护人员需持证上岗；5.维护前确保设备断电；6.维护后进行试运行检查。'
  }
  
  if (question.includes('安全') || question.includes('生产')) {
    return '安全生产是企业发展的基石，请务必重视。安全生产的基本原则包括：1.安全第一原则；2.预防为主原则；3.综合治理原则。遇到安全问题请及时上报，共同维护安全环境。'
  }
  
  if (question.includes('紧急') || question.includes('应急')) {
    return '遇到紧急情况时，请保持冷静：1.立即停止作业；2.评估现场风险；3.按照应急预案采取措施；4.及时向上级报告；5.组织人员疏散；6.配合救援工作。'
  }
  
  return '感谢您的提问！这是一个很好的话题。让我为您提供一些专业建议：根据您的问题，我建议从以下几个方面考虑...如果您需要更详细的解答，请提供更多背景信息，我会尽力为您服务。'
}

const sendMessage = async () => {
  if (!canSend.value) return
  
  const images = attachedFiles.value
    .filter(f => f.type.startsWith('image'))
    .map(f => f.preview || '')
  
  const attachments = attachedFiles.value
    .filter(f => !f.type.startsWith('image'))
  
  messages.value.push({
    id: Date.now(),
    content: inputMessage.value,
    isUser: true,
    images: images.length > 0 ? images : undefined,
    attachments: attachments.length > 0 ? attachments : undefined
  })
  
  const userQuestion = inputMessage.value
  inputMessage.value = ''
  attachedFiles.value = []
  
  nextTick(() => {
    scrollToId.value = 'msg-' + (messages.value.length - 1)
  })
  
  isTyping.value = true
  
  setTimeout(() => {
    const response = getMockAnswer(userQuestion, images, attachments)
    messages.value.push({
      id: Date.now() + 1,
      content: response,
      isUser: false
    })
    isTyping.value = false
    
    nextTick(() => {
      scrollToId.value = 'msg-' + (messages.value.length - 1)
    })
    
    addToHistory()
  }, 800)
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(30, 64, 175, 0.015) 0%, #F8FAFC 8%, #F1F5F9 100%);
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: calc(#{$navbar-height} + #{$statusbar-height});
  padding-bottom: calc(#{$tabbar-height} + #{$spacing-xl});
}

.history-panel {
  position: fixed;
  top: calc(#{$navbar-height} + #{$statusbar-height} + 10px);
  left: 10px;
  right: 10px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 100;
  max-height: 60vh;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.clear-btn, .close-btn {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.clear-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.close-btn {
  background: #F1F5F9;
  color: #64748B;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: #64748B;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 12px;
  color: #9CA3AF;
}

.history-list {
  max-height: 45vh;
  overflow-y: auto;
  padding: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.history-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.history-title-text {
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 12px;
  color: #9CA3AF;
}

.delete-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  border-radius: 50%;
  color: #64748B;
  opacity: 0;
  transition: all 0.2s ease;
}

.history-item:active .delete-btn {
  opacity: 1;
}

.chat-section {
  flex: 1;
  height: calc(100vh - 300px);
}

.chat-content {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: messageIn 0.3s ease;
}

.chat-message.is-user {
  flex-direction: row-reverse;
  
  .message-avatar {
    background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.28);
  }
  
  .message-content {
    align-items: flex-end;
  }
  
  .message-bubble {
    background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
    border-radius: 16px 4px 16px 16px;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.28);
    
    .message-text {
      color: #ffffff;
    }
  }
  
  .message-time {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .message-images {
    justify-content: flex-end;
  }
  
  .message-attachments {
    justify-content: flex-end;
  }
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E2E8F0;
  border-radius: 12px;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 78%;
  gap: 8px;
}

.message-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
}

.message-image-wrapper {
  max-width: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.message-image {
  width: 100%;
  display: block;
}

.message-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #F1F5F9;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
}

.attachment-icon {
  font-size: 20px;
}

.attachment-info {
  display: flex;
  flex-direction: column;
}

.attachment-name {
  font-size: 13px;
  font-weight: 500;
  color: #1E293B;
}

.attachment-size {
  font-size: 11px;
  color: #9CA3AF;
}

.message-bubble {
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 4px 16px 16px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.message-text {
  font-size: 15px;
  line-height: 1.6;
  color: #1E293B;
  white-space: pre-wrap;
}

.message-time {
  font-size: 11px;
  color: #9CA3AF;
  padding: 0 8px;
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-header {
  text-align: center;
  margin-bottom: 32px;
}

.avatar-section {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
}

.avatar {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.avatar-icon {
  font-size: 48px;
}

.avatar-ring {
  position: absolute;
  z-index: 2;
  inset: -8px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  animation: ringPulse 3s ease-in-out infinite;
}

.avatar-pulse {
  position: absolute;
  z-index: 1;
  inset: -16px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

.empty-title {
  font-size: 26px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.empty-description {
  font-size: 15px;
  color: #64748B;
  text-align: center;
  max-width: 320px;
  line-height: 1.6;
}

.quick-section {
  width: 100%;
  max-width: 360px;
  animation: slideUp 0.3s ease 0.1s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 14px;
}

.quick-icon {
  font-size: 18px;
}

.quick-label {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
}

.quick-tags {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.tag-text {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  line-height: 1.5;
  flex: 1;
  text-align: left;
}

.tag-arrow {
  font-size: 16px;
  color: #9CA3AF;
  transition: all 0.25s ease;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

.typing-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #3B82F6;
  border-radius: 50%;
  animation: bounceDot 1.4s infinite ease-in-out;
  
  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.15s; }
  &:nth-child(3) { animation-delay: 0.3s; }
}

@keyframes bounceDot {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.typing-text {
  font-size: 13px;
  color: #9CA3AF;
  font-weight: 500;
}

.input-section {
  position: fixed;
  bottom: calc(#{$tabbar-height} + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.04);
  padding: 12px 16px;
  z-index: 20;
}

.attached-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E2E8F0;
}

.attached-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F1F5F9;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  position: relative;
}

.file-preview {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
}

.file-thumbnail {
  width: 100%;
  height: 100%;
}

.file-icon {
  font-size: 20px;
}

.file-name {
  font-size: 12px;
  font-weight: 500;
  color: #1E293B;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-remove {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EF4444;
  color: #ffffff;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
}

.tool-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.tool-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 12px;
  font-size: 18px;
}

.input-field {
  flex: 1;
  height: 40px;
  padding: 0 14px;
  background: transparent;
  border-radius: 20px;
  font-size: 15px;
  color: #1E293B;
  border: none;
}

.send-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 4px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.send-button.active {
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.32);
  transform: scale(1.05);
  
  .send-arrow {
    color: #ffffff;
  }
}

.send-arrow {
  font-size: 16px;
  color: #9CA3AF;
  font-weight: 600;
}

.navbar-tools {
  display: flex;
  gap: 12px;
}

.navbar-tools .tool-btn {
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}
</style>
