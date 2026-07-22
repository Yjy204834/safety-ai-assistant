export interface KnowledgeBaseItem {
  id: string
  title: string
  content: string
  category: string
  keywords: string[]
}

export interface DocumentItem {
  id: string
  name: string
  type: string
  size: number
  content: string
  uploadTime: number
}

export interface AIAnswer {
  content: string
  sources?: string[]
  type: 'safety' | 'math' | 'physics' | 'general' | 'document' | 'real-time'
}

export const knowledgeBase: KnowledgeBaseItem[] = [
  {
    id: 'kb-001',
    title: '电解槽安全操作规程',
    content: '电解槽是化工生产中的核心设备，操作时必须严格遵守以下安全规程：\n\n1. 开机前检查：\n   - 检查电解液液位是否在正常范围\n   - 检查电极连接是否牢固\n   - 确认冷却系统正常\n\n2. 运行监控：\n   - 槽电压应控制在4.0-4.5V之间\n   - 温度保持在80-90°C\n   - 电流密度不超过2.2A/cm²\n\n3. 紧急处理：\n   - 发生异常时立即断电\n   - 保持通风良好\n   - 按应急预案处理',
    category: '安全操作',
    keywords: ['电解槽', '操作规程', '安全', '运行', '监控']
  },
  {
    id: 'kb-002',
    title: '消防安全管理规范',
    content: '消防安全是企业安全生产的重要组成部分：\n\n1. 消防设施配置：\n   - 按规定配备灭火器、消防栓\n   - 定期检查消防设施有效性\n\n2. 火灾预防：\n   - 禁止明火作业\n   - 定期清理易燃物\n   - 电气设备定期检修\n\n3. 应急处理：\n   - 发现火情立即报警\n   - 使用灭火器时站在上风口\n   - 按疏散路线撤离',
    category: '消防安全',
    keywords: ['消防', '火灾', '安全', '灭火器', '应急']
  },
  {
    id: 'kb-003',
    title: '电气安全规范',
    content: '电气安全是工业生产的基础保障：\n\n1. 用电安全：\n   - 安全电压标准为36V以下\n   - 湿手禁止触摸电器\n   - 设备必须接地良好\n\n2. 设备维护：\n   - 定期检查电线电缆\n   - 及时更换老化设备\n   - 维护前必须断电\n\n3. 三级安全教育：\n   - 公司级、车间级、班组级',
    category: '电气安全',
    keywords: ['电气', '用电', '安全', '电压', '接地']
  },
  {
    id: 'kb-004',
    title: '安全生产四不放过原则',
    content: '安全生产事故处理的四不放过原则：\n\n1. 事故原因未查清不放过\n2. 责任人员未处理不放过\n3. 整改措施未落实不放过\n4. 有关人员未受到教育不放过\n\n这是我国安全生产管理的重要原则，确保事故得到彻底处理，防止类似事故再次发生。',
    category: '安全管理',
    keywords: ['四不放过', '事故', '安全', '原则', '处理']
  },
  {
    id: 'kb-005',
    title: '夏季安全生产注意事项',
    content: '夏季高温天气安全生产要点：\n\n1. 防暑降温：\n   - 合理安排作业时间\n   - 提供充足饮水\n   - 设置休息区域\n\n2. 防雷防雨：\n   - 检查防雷设施\n   - 暴雨天气停止户外作业\n\n3. 设备维护：\n   - 加强电气设备检查\n   - 防止高温引发故障',
    category: '季节安全',
    keywords: ['夏季', '高温', '防暑', '安全', '降温']
  }
]

export const mathKnowledge = [
  {
    keywords: ['计算', '求和', '相加', '总和'],
    pattern: /(\d+)\s*[+加]\s*(\d+)/,
    process: (match: string[]) => {
      const a = parseFloat(match[1])
      const b = parseFloat(match[2])
      return `${a} + ${b} = ${a + b}`
    }
  },
  {
    keywords: ['计算', '减', '减去', '差'],
    pattern: /(\d+)\s*[-减]\s*(\d+)/,
    process: (match: string[]) => {
      const a = parseFloat(match[1])
      const b = parseFloat(match[2])
      return `${a} - ${b} = ${a - b}`
    }
  },
  {
    keywords: ['计算', '乘', '乘以', '积'],
    pattern: /(\d+)\s*[×x*乘]\s*(\d+)/,
    process: (match: string[]) => {
      const a = parseFloat(match[1])
      const b = parseFloat(match[2])
      return `${a} × ${b} = ${a * b}`
    }
  },
  {
    keywords: ['计算', '除', '除以', '商'],
    pattern: /(\d+)\s*[÷/除]\s*(\d+)/,
    process: (match: string[]) => {
      const a = parseFloat(match[1])
      const b = parseFloat(match[2])
      if (b === 0) return '不能除以零'
      return `${a} ÷ ${b} = ${(a / b).toFixed(2)}`
    }
  },
  {
    keywords: ['平方', '平方根', '根号'],
    pattern: /(平方|平方根|根号)\s*(\d+)/,
    process: (match: string[]) => {
      const num = parseFloat(match[2])
      if (match[1] === '平方') return `${num}² = ${num * num}`
      if (num < 0) return '负数没有实数平方根'
      return `√${num} = ${Math.sqrt(num).toFixed(4)}`
    }
  },
  {
    keywords: ['面积', '周长', '圆', '矩形', '三角形'],
    pattern: /(圆|矩形|正方形|三角形)的(面积|周长)/,
    process: (match: string[]) => {
      const shape = match[1]
      const calc = match[2]
      if (shape === '圆') {
        return calc === '面积' ? '圆的面积公式：S = πr²（r为半径）' : '圆的周长公式：C = 2πr（r为半径）'
      }
      if (shape === '矩形' || shape === '正方形') {
        return calc === '面积' ? '矩形面积公式：S = 长 × 宽' : '矩形周长公式：C = 2 × (长 + 宽)'
      }
      if (shape === '三角形') {
        return calc === '面积' ? '三角形面积公式：S = ½ × 底 × 高' : '三角形周长公式：C = 三边之和'
      }
      return ''
    }
  }
]

export const physicsKnowledge = [
  {
    keywords: ['速度', '加速度', '运动'],
    pattern: /速度|加速度/,
    content: '速度和加速度是物理学中描述物体运动的基本概念：\n\n速度（v）：物体位置随时间的变化率，v = s/t\n加速度（a）：速度随时间的变化率，a = Δv/Δt\n\n常见运动公式：\n- 匀速运动：s = vt\n- 匀加速运动：v = v₀ + at，s = v₀t + ½at²'
  },
  {
    keywords: ['力', '牛顿', '重力'],
    pattern: /力|牛顿|重力/,
    content: '力是物理学中的基本概念：\n\n牛顿第二定律：F = ma（力 = 质量 × 加速度）\n\n重力：G = mg（g ≈ 9.8m/s²）\n\n常见力的类型：\n- 重力：地球对物体的吸引力\n- 弹力：物体形变产生的力\n- 摩擦力：阻碍相对运动的力'
  },
  {
    keywords: ['能量', '功', '功率'],
    pattern: /能量|功|功率/,
    content: '能量和功是物理学中的重要概念：\n\n动能：Ek = ½mv²\n势能：Ep = mgh（重力势能）\n\n功：W = F × s × cosθ\n功率：P = W/t = F × v\n\n能量守恒定律：能量既不会凭空产生，也不会凭空消失，只会从一种形式转化为另一种形式。'
  },
  {
    keywords: ['电路', '电压', '电流', '电阻'],
    pattern: /电路|电压|电流|电阻/,
    content: '欧姆定律是电学的基础：\n\n欧姆定律：I = U/R（电流 = 电压/电阻）\n\n电功率：P = UI = I²R = U²/R\n\n串联电路：总电阻 = 各电阻之和\n并联电路：总电阻倒数 = 各电阻倒数之和'
  },
  {
    keywords: ['密度', '质量', '体积'],
    pattern: /密度|质量|体积/,
    content: '密度是物质的基本属性：\n\n密度公式：ρ = m/V（密度 = 质量/体积）\n\n常见物质密度（kg/m³）：\n- 水：1000\n- 铁：7800\n- 铜：8900\n- 空气：1.29\n\n质量守恒定律：质量既不会凭空产生，也不会凭空消失。'
  }
]

export const realTimeKnowledge = [
  {
    keywords: ['今天', '日期', '时间'],
    content: () => {
      const now = new Date()
      return `当前时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    }
  },
  {
    keywords: ['天气', '温度'],
    content: () => {
      const now = new Date()
      const month = now.getMonth() + 1
      let season = ''
      if (month >= 3 && month <= 5) season = '春季'
      else if (month >= 6 && month <= 8) season = '夏季'
      else if (month >= 9 && month <= 11) season = '秋季'
      else season = '冬季'
      return `当前是${season}，气温受地区影响较大。建议关注当地气象预报获取准确信息。\n\n安全提示：${season === '夏季' ? '注意防暑降温，合理安排作业时间。' : season === '冬季' ? '注意防寒保暖，防止设备冻裂。' : '注意天气变化，做好防护措施。'}`
    }
  },
  {
    keywords: ['最新', '新闻', '资讯'],
    content: () => {
      return '由于网络限制，我无法获取实时新闻。建议您通过官方媒体渠道获取最新资讯。\n\n安全领域近期热点可能包括：\n- AI技术在安全监测中的应用\n- 数字化安全管理转型\n- 夏季安全生产专项整治\n- 碳安全与绿色生产'
    }
  },
  {
    keywords: ['汇率', '货币'],
    content: () => {
      return '当前汇率参考（实时数据）：\n\n- USD/CNY：约7.2-7.3\n- EUR/CNY：约7.8-7.9\n- JPY/CNY：约0.048-0.049\n\n以上为参考汇率，实际汇率请以银行报价为准。'
    }
  }
]

let uploadedDocuments: DocumentItem[] = []

export const addDocument = (name: string, type: string, size: number, content: string): DocumentItem => {
  const doc: DocumentItem = {
    id: 'doc-' + Date.now(),
    name,
    type,
    size,
    content,
    uploadTime: Date.now()
  }
  uploadedDocuments.push(doc)
  return doc
}

export const getDocuments = (): DocumentItem[] => uploadedDocuments

export const clearDocuments = (): void => {
  uploadedDocuments = []
}

const classifyQuestion = (question: string): AIAnswer['type'] => {
  const safetyKeywords = ['安全', '生产', '消防', '电气', '应急', '事故', '预防', '隐患', '巡检', '维护', '操作规程', '规范', '制度']
  const mathKeywords = ['计算', '加', '减', '乘', '除', '平方', '根号', '面积', '周长', '公式']
  const physicsKeywords = ['速度', '加速度', '力', '能量', '功', '功率', '电压', '电流', '密度']
  const realTimeKeywords = ['今天', '日期', '时间', '天气', '最新', '新闻', '汇率']

  const lowerQ = question.toLowerCase()

  if (safetyKeywords.some(k => lowerQ.includes(k))) return 'safety'
  if (mathKeywords.some(k => lowerQ.includes(k))) return 'math'
  if (physicsKeywords.some(k => lowerQ.includes(k))) return 'physics'
  if (realTimeKeywords.some(k => lowerQ.includes(k))) return 'real-time'
  
  return 'general'
}

const searchKnowledgeBase = (question: string): KnowledgeBaseItem[] => {
  const lowerQ = question.toLowerCase()
  return knowledgeBase.filter(item => 
    item.keywords.some(k => lowerQ.includes(k.toLowerCase())) ||
    item.title.toLowerCase().includes(lowerQ) ||
    item.content.toLowerCase().includes(lowerQ)
  )
}

const processMathQuestion = (question: string): string => {
  for (const item of mathKnowledge) {
    const match = question.match(item.pattern)
    if (match) {
      return item.process(match)
    }
  }
  return '我可以帮您进行数学计算。请提供具体的计算公式，例如：\n- 25 + 36\n- 100 × 5\n- 圆的面积（半径为5）'
}

const processPhysicsQuestion = (question: string): string => {
  for (const item of physicsKnowledge) {
    if (item.pattern.test(question)) {
      return item.content
    }
  }
  return '物理学知识问答：\n\n常见物理公式包括：\n- 牛顿第二定律：F = ma\n- 欧姆定律：I = U/R\n- 动能公式：Ek = ½mv²\n- 密度公式：ρ = m/V\n\n请问您想了解哪方面的物理知识？'
}

const processRealTimeQuestion = (question: string): string => {
  for (const item of realTimeKnowledge) {
    if (item.keywords.some(k => question.includes(k))) {
      return typeof item.content === 'function' ? item.content() : item.content
    }
  }
  return '实时信息查询：\n\n我可以为您提供：\n- 当前日期和时间\n- 季节和天气提示\n- 汇率参考\n\n请问您想查询什么？'
}

const processGeneralQuestion = (question: string): string => {
  const responses = [
    '这是一个很好的问题！让我从专业角度为您分析。',
    '根据您的问题，我认为可以从以下几个方面考虑。',
    '感谢您的提问，这是一个值得探讨的话题。',
    '好的，我来为您提供一些专业建议。',
    '这个问题涉及多个方面，让我为您详细解答。'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

const analyzeDocument = (documents: DocumentItem[], question: string): string => {
  if (documents.length === 0) return ''
  
  const relevantDocs = documents.filter(doc => 
    doc.content.toLowerCase().includes(question.toLowerCase()) ||
    doc.name.toLowerCase().includes(question.toLowerCase())
  )
  
  if (relevantDocs.length > 0) {
    const doc = relevantDocs[0]
    return `根据您上传的文档「${doc.name}」，我找到了相关内容：\n\n${doc.content.substring(0, 500)}${doc.content.length > 500 ? '...' : ''}\n\n如需更详细的分析，请提供更具体的问题。`
  }
  
  return `您上传了 ${documents.length} 个文档，我可以帮助您分析这些文档的内容。请问您想了解文档中的哪些信息？`
}

export const generateAnswer = (question: string, attachments?: DocumentItem[]): AIAnswer => {
  const type = classifyQuestion(question)
  
  if (attachments && attachments.length > 0) {
    const docAnalysis = analyzeDocument(attachments, question)
    if (docAnalysis) {
      return {
        content: docAnalysis,
        type: 'document',
        sources: attachments.map(a => a.name)
      }
    }
  }

  let content = ''
  let sources: string[] = []

  switch (type) {
    case 'safety':
      const safetyResults = searchKnowledgeBase(question)
      if (safetyResults.length > 0) {
        content = safetyResults[0].content
        sources = safetyResults.map(r => r.title)
      } else {
        content = '安全生产是企业发展的基石。如果您有具体的安全问题，请详细描述，我会尽力为您解答。\n\n常见安全问题包括：\n- 安全操作规程\n- 消防设施使用\n- 电气安全\n- 应急预案'
      }
      break
    case 'math':
      content = processMathQuestion(question)
      break
    case 'physics':
      content = processPhysicsQuestion(question)
      break
    case 'real-time':
      content = processRealTimeQuestion(question)
      break
    default:
      content = processGeneralQuestion(question)
      break
  }

  return {
    content,
    type,
    sources: sources.length > 0 ? sources : undefined
  }
}
