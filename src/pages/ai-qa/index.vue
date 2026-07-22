<template>
  <view class="container">
    <!-- 动态背景层 -->
    <view class="dynamic-bg">
      <view class="bg-orb orb-1"></view>
      <view class="bg-orb orb-2"></view>
      <view class="bg-orb orb-3"></view>
      <view class="bg-grid"></view>
      <view class="bg-particles">
        <view v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></view>
      </view>
    </view>

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
      <!-- 历史记录面板 -->
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
          <view v-for="item in historyList" :key="item.id" class="history-item" @tap="loadHistoryItem(item)">
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
          <view v-for="(item, index) in messages" :key="index" :id="'msg-' + index"
            :class="['chat-message', { 'is-user': item.isUser, 'fade-in': true }]"
            :style="{ animationDelay: (index * 0.05) + 's' }">
            <view class="message-avatar">
              <view v-if="!item.isUser" class="ai-avatar">
                <text class="ai-avatar-icon">🤖</text>
                <view class="avatar-pulse-ring"></view>
                <view class="avatar-pulse-ring delay-1"></view>
              </view>
              <text v-else class="user-avatar">👤</text>
            </view>
            <view class="message-content">
              <view v-if="item.images && item.images.length > 0" class="message-images">
                <view v-for="(img, imgIdx) in item.images" :key="imgIdx" class="message-image-wrapper">
                  <image :src="img" class="message-image" mode="widthFix" />
                </view>
              </view>
              <view v-if="item.attachments && item.attachments.length > 0" class="message-attachments">
                <view v-for="(file, fileIdx) in item.attachments" :key="fileIdx" class="attachment-item">
                  <text class="attachment-icon">{{ getFileIcon(file.type) }}</text>
                  <view class="attachment-info">
                    <text class="attachment-name">{{ file.name }}</text>
                    <text class="attachment-size">{{ formatFileSize(file.size) }}</text>
                  </view>
                </view>
              </view>
              <view :class="['message-bubble', { user: item.isUser, ai: !item.isUser }]">
                <view v-if="!item.isUser" class="bubble-glow"></view>
                <text class="message-text">{{ item.content }}</text>
              </view>
              <text class="message-time">{{ formatTime(item.id) }}</text>
            </view>
          </view>

          <!-- 动态欢迎界面 -->
          <view v-if="messages.length <= 1 && !messages.some(m => m.isUser)" class="empty-chat">
            <view class="welcome-section">
              <view class="welcome-orb-wrapper">
                <view class="welcome-orb-outer"></view>
                <view class="welcome-orb-middle"></view>
                <view class="welcome-orb">
                  <text class="welcome-orb-icon">🤖</text>
                </view>
                <view class="welcome-ring welcome-ring-1"></view>
                <view class="welcome-ring welcome-ring-2"></view>
                <view class="welcome-ring welcome-ring-3"></view>
              </view>
              <text class="welcome-title">AI 智能助手</text>
              <text class="welcome-subtitle">智能问答 · 数学计算 · 物理知识 · 文档分析</text>
              <text class="welcome-tip">我能回答所有问题，随时为您服务 ✨</text>
            </view>
          </view>

          <!-- 打字动画 -->
          <view v-if="isTyping" class="typing-indicator">
            <view class="message-avatar">
              <view class="ai-avatar">
                <text class="ai-avatar-icon">🤖</text>
                <view class="avatar-pulse-ring"></view>
              </view>
            </view>
            <view class="typing-content">
              <view class="typing-bubble">
                <view class="typing-dots">
                  <view class="dot dot-1"></view>
                  <view class="dot dot-2"></view>
                  <view class="dot dot-3"></view>
                </view>
                <view class="typing-wave"></view>
              </view>
              <text class="typing-text">{{ typingText }}</text>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 输入区 -->
      <view class="input-section">
        <view v-if="attachedFiles.length > 0" class="attached-files">
          <view v-for="(file, index) in attachedFiles" :key="index" class="attached-file">
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
            <view class="tool-btn" @tap="triggerImageUpload" @click="triggerImageUpload">
              <text>🖼️</text>
            </view>
            <view class="tool-btn" @tap="triggerDocUpload" @click="triggerDocUpload">
              <text>📎</text>
            </view>
            <view class="tool-btn" @tap="triggerTemplateUpload" @click="triggerTemplateUpload">
              <text>📋</text>
            </view>
          </view>
          <input v-model="inputMessage" class="input-field" placeholder="问我任何问题..." confirm-type="send" @confirm="sendMessage" />
          <view :class="['send-button', { active: canSend }]" @tap="sendMessage">
            <view v-if="canSend" class="send-pulse"></view>
            <text class="send-arrow">↑</text>
          </view>
        </view>
      </view>
    </view>
    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { type Message } from '@/data/mock.ts'
import { ask, addDocument, getAllDocuments, type DocumentItem, type RAGResponse } from '@/services/rag-service.ts'

const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)
const fileAcceptTypes = '.txt,.json,.csv,.md,.log,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html,.xml,.yaml,.yml,.js,.ts,.py,.java,.c,.cpp,.h'

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

const inputMessage = ref('')
const messages = ref<Message[]>([])
const isTyping = ref(false)
const attachedFiles = ref<AttachmentFile[]>([])
const showHistory = ref(false)
const historyList = ref<HistoryItem[]>([])
const scrollToId = ref('')
const typingText = ref('AI正在思考')

const canSend = computed(() => {
  return inputMessage.value.trim() || attachedFiles.value.length > 0
})

let typingInterval: any = null
let typingTexts = ['AI正在思考', 'AI正在思考.', 'AI正在思考..', 'AI正在思考...']
let typingIndex = 0

const getParticleStyle = (i: number) => {
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 5
  const duration = 8 + Math.random() * 12
  const size = 2 + Math.random() * 4
  return {
    left: left + '%',
    top: top + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    animationDuration: duration + 's'
  }
}

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
  nextTick(() => { scrollToId.value = 'msg-' + (messages.value.length - 1) })
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
    content: '您好！我是AI智能助手 ✨',
    isUser: false
  }]
})

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
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
  console.log('triggerImageUpload被调用')
  if (typeof document !== 'undefined') {
    // H5 环境：动态创建图片选择 input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.style.position = 'fixed'
    input.style.top = '-9999px'
    input.style.left = '-9999px'
    input.style.opacity = '0'
    
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files || [])
      console.log('选择了图片:', files.length)
      if (files.length > 0) {
        files.forEach((file: File) => {
          const reader = new FileReader()
          reader.onload = (ev) => {
            attachedFiles.value.push({
              name: file.name,
              type: file.type,
              size: file.size,
              preview: ev.target?.result as string
            })
          }
          reader.readAsDataURL(file)
        })
        uni.showToast({ title: `已选择 ${files.length} 张图片`, icon: 'success' })
      }
      document.body.removeChild(input)
    }
    
    document.body.appendChild(input)
    input.click()
  } else {
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
}

const triggerDocUpload = () => {
  console.log('triggerDocUpload被调用')
  // H5 环境使用原生文件选择器
  if (typeof document !== 'undefined') {
    // 直接动态创建 input，避免 ref 失效问题
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.json,.csv,.md,.log,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html,.xml,.yaml,.yml,.js,.ts,.py,.java,.c,.cpp,.h'
    input.multiple = true
    input.style.position = 'fixed'
    input.style.top = '-9999px'
    input.style.left = '-9999px'
    input.style.opacity = '0'
    
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files || [])
      console.log('选择了文件:', files.length)
      if (files.length > 0) {
        handleBrowserFiles(files)
      }
      document.body.removeChild(input)
    }
    
    document.body.appendChild(input)
    input.click()
  } else if (typeof uni.chooseMessageFile === 'function') {
    uni.chooseMessageFile({
      count: 5,
      type: 'file',
      success: (res) => handleSelectedFiles(res.tempFiles),
      fail: () => showUploadMenu()
    })
  } else {
    showUploadMenu()
  }
}

const triggerTemplateUpload = () => {
  showTemplates()
}

// H5 环境：直接通过文件选择器选择
const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const files = Array.from(target.files)
  handleBrowserFiles(files)
  // 重置以便选择相同文件
  target.value = ''
}

// H5 环境：选择文件夹
const onFolderSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const files = Array.from(target.files)
  handleBrowserFiles(files)
  target.value = ''
}

// 处理浏览器选择的文件
const handleBrowserFiles = async (files: File[]) => {
  uni.showLoading({ title: `正在处理 ${files.length} 个文件...` })

  let successCount = 0
  let failCount = 0

  for (const file of files) {
    try {
      const content = await readBrowserFile(file)
      addFileToList({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        content
      })
      successCount++
    } catch (err) {
      console.error('读取文件失败:', file.name, err)
      // 即使读取失败，也添加元信息
      addFileToList({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        content: `[${file.name.split('.').pop()?.toUpperCase() || 'FILE'}] 文件: ${file.name}\n大小: ${(file.size / 1024).toFixed(1)} KB\n上传时间: ${new Date().toLocaleString('zh-CN')}\n注: 二进制文件已加入知识库，AI 可基于文件名参与分析。`
      })
      successCount++
    }
  }

  uni.hideLoading()
  if (successCount > 0) {
    uni.showToast({ title: `成功上传 ${successCount} 个文件`, icon: 'success' })
  }
  if (failCount > 0) {
    console.warn(`${failCount} 个文件处理失败`)
  }
}

// 在浏览器中读取文件内容
const readBrowserFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    // 文本类文件读取内容
    const textExts = ['txt', 'json', 'csv', 'md', 'log', 'xml', 'yaml', 'yml', 'html', 'htm', 'js', 'ts', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'css', 'scss', 'sass', 'less', 'vue', 'jsx', 'tsx', 'sh', 'bat', 'sql', 'ini', 'conf', 'properties']
    
    if (textExts.includes(ext) || file.type.startsWith('text/')) {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file, 'utf-8')
    } else {
      // 二进制文件返回元信息
      resolve(`[${ext.toUpperCase() || 'FILE'} 文件]\n文件名: ${file.name}\n大小: ${(file.size / 1024).toFixed(1)} KB\n类型: ${file.type || '未知'}\n上传时间: ${new Date().toLocaleString('zh-CN')}\n\n注: 这是一个二进制文件，无法直接读取文本内容。AI 将基于文件名和元信息参与对话分析。`)
    }
  })
}

const showUploadMenu = () => {
  uni.showActionSheet({
    itemList: ['📁 从聊天文件选择', '📝 上传本地文本', '📊 导入聊天记录', '📋 快速模板'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          chooseLocalFile()
          break
        case 1:
          inputTextContent()
          break
        case 2:
          importChatHistory()
          break
        case 3:
          showTemplates()
          break
      }
    }
  })
}

const chooseLocalFile = () => {
  // 尝试使用 chooseMessageFile (微信小程序)
  if (typeof uni.chooseMessageFile === 'function') {
    uni.chooseMessageFile({
      count: 5,
      type: 'file',
      success: (res) => {
        handleSelectedFiles(res.tempFiles)
      },
      fail: (err) => {
        console.log('chooseMessageFile失败', err)
        uni.showToast({ title: '请使用文件选择器', icon: 'none' })
      }
    })
  } else {
    uni.showToast({ title: '当前环境不支持', icon: 'none' })
  }
}

const handleSelectedFiles = (files: any[]) => {
  let successCount = 0
  files.forEach((file) => {
    const fileName = file.name || 'unknown'
    const fileSize = file.size || 0
    const filePath = file.path || file.tempFilePath

    // 读取文件内容
    if (typeof uni.getFileSystemManager === 'function') {
      const fs = uni.getFileSystemManager()
      const ext = fileName.split('.').pop()?.toLowerCase() || ''

      // 文本类型文件直接读取
      if (['txt', 'json', 'csv', 'md', 'log'].includes(ext)) {
        try {
          fs.readFile({
            filePath: filePath,
            encoding: 'utf-8',
            success: (readRes) => {
              addFileToList({
                name: fileName,
                type: file.type || 'text/plain',
                size: fileSize,
                content: readRes.data as string
              })
              successCount++
              if (successCount === files.length) {
                uni.showToast({ title: `成功上传 ${files.length} 个文件`, icon: 'success' })
              }
            },
            fail: () => {
              addFileToList({
                name: fileName,
                type: file.type || 'application/octet-stream',
                size: fileSize,
                content: `[二进制文件: ${fileName}]\n大小: ${(fileSize / 1024).toFixed(1)} KB\n无法直接读取内容，但已加入知识库参与分析。`
              })
              successCount++
            }
          })
        } catch (e) {
          addFileToList({
            name: fileName,
            type: file.type || 'application/octet-stream',
            size: fileSize,
            content: `[文件: ${fileName}]`
          })
          successCount++
        }
      } else {
        // 二进制文件（PDF、Word、Excel等）添加元信息
        addFileToList({
          name: fileName,
          type: file.type || 'application/octet-stream',
          size: fileSize,
          content: `[${ext.toUpperCase()} 文件: ${fileName}]\n大小: ${(fileSize / 1024).toFixed(1)} KB\n上传时间: ${new Date().toLocaleString('zh-CN')}\n注: 二进制文件已索引，AI 可基于文件名和类型进行分析。`
        })
        successCount++
      }
    } else {
      addFileToList({
        name: fileName,
        type: file.type || 'application/octet-stream',
        size: fileSize,
        content: `[文件: ${fileName}]`
      })
      successCount++
    }
  })

  if (successCount === files.length) {
    setTimeout(() => {
      uni.showToast({ title: `成功上传 ${files.length} 个文件`, icon: 'success' })
    }, 500)
  }
}

const addFileToList = (file: AttachmentFile) => {
  attachedFiles.value.push(file)
  const doc = addDocument(file.name, file.type, file.size, file.content || '')
  console.log('已添加文档:', doc.name)
}

const inputTextContent = () => {
  uni.showModal({
    title: '上传文本内容',
    editable: true,
    placeholderText: '请输入要上传的文本内容（支持粘贴已下载的文档内容）',
    success: (res) => {
      if (res.confirm && res.content) {
        const fileName = `文本_${new Date().toLocaleString('zh-CN').replace(/[/: ]/g, '-')}.txt`
        addFileToList({
          name: fileName,
          type: 'text/plain',
          size: new Blob([res.content]).size,
          content: res.content
        })
        uni.showToast({ title: '文本上传成功', icon: 'success' })
      }
    }
  })
}

const importChatHistory = () => {
  // 导入当前聊天的历史记录
  const chatContent = messages.value
    .map(m => `${m.isUser ? '用户' : 'AI'} (${formatTime(m.id)}): ${m.content}`)
    .join('\n\n')

  if (!chatContent || messages.value.length <= 1) {
    uni.showToast({ title: '暂无聊天记录', icon: 'none' })
    return
  }

  const fileName = `聊天记录_${new Date().toLocaleString('zh-CN').replace(/[/: ]/g, '-')}.txt`
  addFileToList({
    name: fileName,
    type: 'text/plain',
    size: new Blob([chatContent]).size,
    content: chatContent
  })
  uni.showToast({ title: '聊天记录已导入', icon: 'success' })
}

const showTemplates = () => {
  uni.showActionSheet({
    itemList: ['⚡ 电解槽安全手册', '🔥 消防安全规范', '⚡ 电气安全制度', '📋 应急预案'],
    success: (res) => {
      const templates: Record<number, { name: string; content: string }> = {
        0: {
          name: '电解槽安全手册.txt',
          content: '电解槽安全操作手册\n\n第1章 设备介绍\n1.1 电解槽结构\n电解槽由阳极、阴极、电解液、隔膜等组成。\n1.2 工作原理\n通过电解反应将原料转化为目标产品。\n\n第2章 安全操作规程\n2.1 开机前检查\n- 检查电解液液位是否正常\n- 确认电极连接牢固\n- 验证冷却系统正常\n- 检查电源和控制系统\n\n2.2 运行监控\n- 槽电压应控制在4.0-4.5V之间\n- 温度保持在80-90°C\n- 电流密度不超过2.2A/cm²\n- 定期检查电解液浓度\n\n2.3 应急处理\n- 发生异常立即断电\n- 保持通风良好\n- 启动应急预案\n- 报告上级和相关部门'
        },
        1: {
          name: '消防安全规范.txt',
          content: '消防安全管理制度\n\n第一章 总则\n1.1 编制目的\n加强公司消防安全管理，预防火灾事故。\n1.2 适用范围\n适用于公司所有区域和员工。\n\n第二章 消防设施\n2.1 灭火器配置\n- A类火灾区域：干粉灭火器\n- B类火灾区域：泡沫灭火器\n- C类火灾区域：二氧化碳灭火器\n- 每季度检查一次\n\n2.2 消防栓管理\n- 每月检查水压\n- 每年维护保养\n- 保持周围无杂物\n\n第三章 火灾预防\n3.1 禁止行为\n- 禁止明火作业\n- 禁止乱拉电线\n- 禁止存放易燃物\n\n3.2 应急疏散\n- 熟悉疏散路线\n- 定期演练\n- 服从指挥有序撤离'
        },
        2: {
          name: '电气安全制度.txt',
          content: '电气安全管理制度\n\n一、用电安全基本要求\n1. 安全电压：36V以下\n2. 湿手禁止触摸电器\n3. 设备必须接地良好\n4. 定期检查电线电缆\n\n二、电气作业规范\n1. 维护前必须断电\n2. 悬挂"禁止合闸"标识\n3. 设置专人监护\n4. 穿戴绝缘防护用品\n\n三、电气设备管理\n1. 设备台账管理\n2. 定期预防性试验\n3. 故障及时处理\n4. 老化设备及时更换\n\n四、培训教育\n1. 三级安全教育\n   - 公司级\n   - 车间级\n   - 班组级\n2. 特种作业人员持证上岗\n3. 每年复训一次'
        },
        3: {
          name: '应急预案.txt',
          content: '安全生产应急预案\n\n一、总则\n1.1 编制目的\n快速有效处置安全生产事故，最大程度减少人员伤亡和财产损失。\n1.2 工作原则\n以人为本、预防为主、统一指挥、快速反应。\n\n二、组织机构\n2.1 应急指挥部\n总指挥：总经理\n副总指挥：分管副总\n成员：各部门负责人\n\n2.2 应急办公室\n设在安全管理部，负责日常应急管理工作。\n\n三、应急响应\n3.1 响应分级\n- 特别重大（Ⅰ级）\n- 重大（Ⅱ级）\n- 较大（Ⅲ级）\n- 一般（Ⅳ级）\n\n3.2 响应程序\n1. 事故报告\n2. 启动预案\n3. 应急处置\n4. 救援救护\n5. 善后处理\n\n四、培训演练\n每年至少组织2次应急演练。'
        }
      }
      const template = templates[res.tapIndex]
      if (template) {
        addFileToList({
          name: template.name,
          type: 'text/plain',
          size: new Blob([template.content]).size,
          content: template.content
        })
        uni.showToast({ title: '模板已添加', icon: 'success' })
      }
    }
  })
}

const removeFile = (index: number) => {
  attachedFiles.value.splice(index, 1)
}

const clearChat = () => {
  messages.value = [{
    id: Date.now(),
    content: '对话已清空 ✨\n\n有什么新问题想问我的吗？',
    isUser: false
  }]
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
}

const quickQuestion = (question: string) => {
  inputMessage.value = question
  sendMessage()
}

const startTypingAnimation = () => {
  typingIndex = 0
  typingText.value = typingTexts[0]
  typingInterval = setInterval(() => {
    typingIndex = (typingIndex + 1) % typingTexts.length
    typingText.value = typingTexts[typingIndex]
  }, 400)
}

const stopTypingAnimation = () => {
  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }
}

const getAnswerTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    safety: '安全知识',
    math: '数学计算',
    physics: '物理知识',
    general: '通用问答',
    document: '文档分析',
    'real-time': '实时信息'
  }
  return labels[type] || 'AI回答'
}

const sendMessage = async () => {
  if (!canSend.value) return

  const images = attachedFiles.value.filter(f => f.type.startsWith('image')).map(f => f.preview || '')
  const attachments = attachedFiles.value.filter(f => !f.type.startsWith('image'))

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

  nextTick(() => { scrollToId.value = 'msg-' + (messages.value.length - 1) })

  isTyping.value = true
  startTypingAnimation()

  try {
    const ragResponse: RAGResponse = await ask(userQuestion)
    let response = ragResponse.answer
    if (ragResponse.sources && ragResponse.sources.length > 0) {
      response += '\n\n📚 参考来源：\n' + ragResponse.sources.map(s => '- ' + s).join('\n')
    }
    response += `\n\n[${getAnswerTypeLabel(ragResponse.type)}]`
    messages.value.push({ id: Date.now() + 1, content: response, isUser: false })
    isTyping.value = false
    stopTypingAnimation()
    nextTick(() => { scrollToId.value = 'msg-' + (messages.value.length - 1) })
    addToHistory()
  } catch (error) {
    console.error('RAG调用失败:', error)
    isTyping.value = false
    stopTypingAnimation()
    messages.value.push({ id: Date.now() + 1, content: '抱歉，处理您的问题时出现了错误。请稍后重试。', isUser: false })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  min-height: 100vh;
  position: relative;
  background: $bg-secondary;
  overflow: hidden;
}

/* ============ 动态背景 ============ */
.dynamic-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  animation: float-orb 20s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  top: -50px;
  left: -50px;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%);
  top: 40%;
  right: -80px;
  animation-delay: -7s;
  animation-duration: 25s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
  bottom: -50px;
  left: 30%;
  animation-delay: -14s;
  animation-duration: 22s;
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(40px, -40px) scale(1.1); }
  50% { transform: translate(-30px, 30px) scale(0.95); }
  75% { transform: translate(50px, 20px) scale(1.05); }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(30, 64, 175, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30, 64, 175, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
}

.bg-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  background: $primary;
  border-radius: 50%;
  opacity: 0.3;
  animation: particle-float linear infinite;
}

@keyframes particle-float {
  0% { transform: translateY(100vh) translateX(0) scale(0); opacity: 0; }
  10% { opacity: 0.4; transform: translateY(80vh) scale(1); }
  90% { opacity: 0.4; }
  100% { transform: translateY(-10vh) translateX(50px) scale(0.5); opacity: 0; }
}

.page-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: calc(#{$navbar-height} + #{$statusbar-height});
  padding-bottom: calc(#{$tabbar-height} + #{$spacing-xl});
  height: 100vh;
}

/* ============ 顶部工具栏 ============ */
.navbar-tools {
  display: flex;
  gap: 8px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-normal;
  font-size: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:active {
    transform: scale(0.9);
    background: rgba(255, 255, 255, 0.25);
  }
}

/* ============ 历史记录面板 ============ */
.history-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  z-index: 10;
  padding: 16px;
  display: flex;
  flex-direction: column;
  animation: slide-down 0.3s ease;
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid $border-light;
  margin-bottom: 12px;
}

.history-title {
  font-size: 17px;
  font-weight: 600;
  color: $text-primary;
}

.history-actions {
  display: flex;
  gap: 12px;
}

.clear-btn, .close-btn {
  font-size: 13px;
  color: $primary;
  font-weight: 500;
  padding: 4px 8px;
}

.close-btn {
  font-size: 18px;
  color: $text-tertiary;
}

.history-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.empty-icon {
  font-size: 60px;
  opacity: 0.4;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.1); opacity: 0.6; }
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
}

.empty-hint {
  font-size: 13px;
  color: $text-tertiary;
}

.history-list {
  flex: 1;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 14px 12px;
  background: $bg-secondary;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid transparent;
  transition: all $transition-normal;
  animation: fade-in 0.4s ease both;
  
  &:active {
    transform: scale(0.98);
    background: $bg-hover;
  }
}

.history-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-title-text {
  font-size: 14px;
  color: $text-primary;
  font-weight: 500;
}

.history-time {
  font-size: 12px;
  color: $text-tertiary;
}

.delete-btn {
  width: 24px;
  height: 24px;
  background: $bg-tertiary;
  color: $text-tertiary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ============ 聊天区域 ============ */
.chat-section {
  flex: 1;
  overflow: hidden;
}

.chat-content {
  padding: 16px;
  padding-bottom: 24px;
}

.chat-message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
  
  &.is-user {
    flex-direction: row-reverse;
  }
}

.chat-message.fade-in {
  animation: message-in 0.4s ease both;
}

@keyframes message-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  margin: 0 8px;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
}

.ai-avatar-icon {
  font-size: 20px;
  position: relative;
  z-index: 1;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.avatar-pulse-ring {
  position: absolute;
  inset: -4px;
  border: 1.5px solid $primary;
  border-radius: 50%;
  opacity: 0;
  animation: ring-pulse 2s ease-out infinite;
}

.avatar-pulse-ring.delay-1 {
  animation-delay: 1s;
}

@keyframes ring-pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

.message-content {
  flex: 1;
  max-width: 75%;
  display: flex;
  flex-direction: column;
}

.chat-message.is-user .message-content {
  align-items: flex-end;
}

.message-images {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.message-image-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
}

.message-image {
  width: 100%;
  height: 100%;
}

.message-attachments {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 6px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background: rgba(30, 64, 175, 0.08);
  border-radius: 8px;
}

.attachment-icon {
  font-size: 18px;
  margin-right: 6px;
}

.attachment-info {
  display: flex;
  flex-direction: column;
}

.attachment-name {
  font-size: 12px;
  color: $text-primary;
  font-weight: 500;
}

.attachment-size {
  font-size: 10px;
  color: $text-tertiary;
}

.message-bubble {
  position: relative;
  padding: 12px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  
  &.user {
    background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
    color: #FFFFFF;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 8px rgba(30, 64, 175, 0.2);
  }
  
  &.ai {
    background: rgba(255, 255, 255, 0.95);
    color: $text-primary;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
    border: 1px solid $border-light;
    overflow: hidden;
  }
}

.bubble-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
  border-radius: 18px;
  z-index: -1;
  opacity: 0;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.4; }
}

.message-text {
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.6;
}

.message-time {
  font-size: 11px;
  color: $text-tertiary;
  margin-top: 4px;
  padding: 0 4px;
}

/* ============ 欢迎界面 ============ */
.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-orb-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-orb-outer {
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(30, 64, 175, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: orb-breath 3s ease-in-out infinite;
}

.welcome-orb-middle {
  position: absolute;
  width: 90px;
  height: 90px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: orb-breath 3s ease-in-out infinite 0.3s;
}

.welcome-orb {
  position: relative;
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.4);
  animation: orb-float 4s ease-in-out infinite;
  z-index: 2;
}

.welcome-orb-icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

@keyframes orb-breath {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

@keyframes orb-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.welcome-ring {
  position: absolute;
  border: 1.5px solid rgba(30, 64, 175, 0.3);
  border-radius: 50%;
  border-top-color: $primary;
  animation: ring-rotate 4s linear infinite;
}

.welcome-ring-1 {
  width: 100px;
  height: 100px;
}

.welcome-ring-2 {
  width: 110px;
  height: 110px;
  animation-duration: 6s;
  animation-direction: reverse;
  border-top-color: #8B5CF6;
}

.welcome-ring-3 {
  width: 130px;
  height: 130px;
  animation-duration: 8s;
  border-top-color: #10B981;
}

@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.welcome-title {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
  margin-bottom: 8px;
  letter-spacing: 1px;
  animation: text-glow 3s ease-in-out infinite;
}

@keyframes text-glow {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(30, 64, 175, 0.2)); }
  50% { filter: drop-shadow(0 0 8px rgba(30, 64, 175, 0.4)); }
}

.welcome-subtitle {
  font-size: 13px;
  color: $text-tertiary;
  display: block;
  margin-bottom: 4px;
}

.welcome-tip {
  font-size: 12px;
  color: $primary;
  display: block;
  font-weight: 500;
}

/* ============ 打字动画 ============ */
.typing-indicator {
  display: flex;
  align-items: flex-start;
  margin-top: 16px;
  animation: message-in 0.3s ease;
}

.typing-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.typing-bubble {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid $border-light;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  align-self: flex-start;
}

.typing-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, $primary, transparent);
  animation: wave 1.5s ease-in-out infinite;
}

@keyframes wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 7px;
  height: 7px;
  background: $primary;
  border-radius: 50%;
  animation: dot-bounce 1.4s ease-in-out infinite;
}

.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: 0.2s; }
.dot-3 { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-8px); opacity: 1; }
}

.typing-text {
  font-size: 12px;
  color: $text-tertiary;
  padding: 0 4px;
}

/* ============ 输入区域 ============ */
.input-section {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid $border-light;
  position: relative;
}

.input-section::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, $primary, transparent);
  opacity: 0.5;
}

.attached-files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.attached-file {
  display: flex;
  align-items: center;
  padding: 4px 8px 4px 4px;
  background: $bg-tertiary;
  border-radius: 8px;
  gap: 6px;
}

.file-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  background: $primary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-thumbnail {
  width: 100%;
  height: 100%;
}

.file-icon {
  font-size: 14px;
  color: #FFFFFF;
}

.file-name {
  font-size: 12px;
  color: $text-primary;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-remove {
  font-size: 16px;
  color: $text-tertiary;
  font-weight: 700;
  padding: 0 4px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: $bg-tertiary;
  border-radius: 16px;
  padding: 6px 6px 6px 6px;
  border: 1.5px solid transparent;
  transition: all $transition-normal;
  
  &:focus-within {
    background: $bg-primary;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
}

.tool-buttons {
  display: flex;
  gap: 2px;
  margin-right: 4px;
}

.input-wrapper .tool-btn {
  width: 30px;
  height: 30px;
  background: transparent;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all $transition-fast;
  border: none;
  
  &:active {
    background: $bg-hover;
    transform: scale(0.9);
  }
}

.input-field {
  flex: 1;
  height: 32px;
  font-size: 14px;
  color: $text-primary;
  padding: 0 6px;
}

.send-button {
  position: relative;
  width: 36px;
  height: 36px;
  background: $bg-hover;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-normal;
  
  &.active {
    background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.35);
    
    .send-arrow {
      color: #FFFFFF;
    }
  }
}

.send-pulse {
  position: absolute;
  inset: -2px;
  border: 1.5px solid $primary;
  border-radius: 50%;
  animation: send-pulse 1.5s ease-out infinite;
}

@keyframes send-pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.send-arrow {
  font-size: 18px;
  font-weight: 800;
  color: $text-tertiary;
  transition: all $transition-normal;
}

.hidden-file-input {
  display: none !important;
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>
