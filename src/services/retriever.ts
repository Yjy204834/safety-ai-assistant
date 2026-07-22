import { knowledgeBase, type SearchResult, type DocumentItem, type KnowledgeBaseItem } from './data-sources'

const CHUNK_SIZE = 200
const TOP_K = 3

let uploadedDocuments: DocumentItem[] = []

export const addDocument = (name: string, type: string, size: number, content: string): DocumentItem => {
  const doc: DocumentItem = {
    id: 'doc-' + Date.now(),
    name,
    type,
    size,
    content,
    uploadTime: Date.now(),
    chunks: splitIntoChunks(content)
  }
  uploadedDocuments.push(doc)
  return doc
}

export const getDocuments = (): DocumentItem[] => uploadedDocuments

export const clearDocuments = (): void => {
  uploadedDocuments = []
}

const splitIntoChunks = (content: string) => {
  const chunks: { id: string; documentId: string; content: string; index: number }[] = []
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim().length > 0)
  let currentChunk = ''
  let index = 0

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push({
        id: `chunk-${Date.now()}-${index}`,
        documentId: '',
        content: currentChunk.trim(),
        index: index++
      })
      currentChunk = sentence
    } else {
      currentChunk += sentence + '。'
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `chunk-${Date.now()}-${index}`,
      documentId: '',
      content: currentChunk.trim(),
      index
    })
  }

  return chunks
}

const tokenize = (text: string): string[] => {
  return text.toLowerCase().replace(/[^\w\s\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(t => t.length > 0)
}

const calculateSimilarity = (query: string, document: string): number => {
  const queryTokens = tokenize(query)
  const docTokens = tokenize(document)

  if (queryTokens.length === 0 || docTokens.length === 0) return 0

  const querySet = new Set(queryTokens)
  const docSet = new Set(docTokens)

  const queryChars = new Set<string>()
  for (const token of queryTokens) {
    for (const char of token) {
      queryChars.add(char)
    }
  }

  const docChars = new Set<string>()
  for (const token of docTokens) {
    for (const char of token) {
      docChars.add(char)
    }
  }

  let charOverlap = 0
  for (const char of queryChars) {
    if (docChars.has(char)) charOverlap++
  }
  const charScore = charOverlap / (queryChars.size + 1)

  let tokenOverlap = 0
  for (const token of querySet) {
    if (docSet.has(token)) tokenOverlap++
  }
  const tokenScore = tokenOverlap / (queryTokens.length + 1)

  let substringScore = 0
  const lowerDoc = document.toLowerCase()
  for (const token of queryTokens) {
    if (token.length >= 2 && lowerDoc.includes(token)) {
      substringScore += 1
    }
  }
  const substringScoreNorm = substringScore / (queryTokens.length + 1)

  return tokenScore * 0.4 + charScore * 0.2 + substringScoreNorm * 0.4
}

const searchKnowledgeBaseItems = (question: string, topK: number = TOP_K): SearchResult[] => {
  const results: SearchResult[] = []

  for (const item of knowledgeBase) {
    const titleScore = calculateSimilarity(question, item.title)
    const contentScore = calculateSimilarity(question, item.content)
    const keywordScore = item.keywords.reduce((acc, kw) => {
      return acc + (question.toLowerCase().includes(kw.toLowerCase()) ? 0.3 : 0)
    }, 0)
    const totalScore = Math.max(titleScore, contentScore) + keywordScore

    if (totalScore > 0) {
      results.push({
        source: 'knowledge-base',
        content: item.content,
        score: totalScore,
        metadata: {
          title: item.title,
          category: item.category,
          source: item.source
        }
      })
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, topK)
}

const searchDocuments = (question: string, topK: number = TOP_K): SearchResult[] => {
  const results: SearchResult[] = []

  for (const doc of uploadedDocuments) {
    const nameScore = calculateSimilarity(question, doc.name)
    const contentScore = calculateSimilarity(question, doc.content)
    const totalScore = Math.max(nameScore, contentScore)

    if (totalScore > 0) {
      results.push({
        source: 'document',
        content: doc.content.substring(0, 500) + (doc.content.length > 500 ? '...' : ''),
        score: totalScore,
        metadata: {
          title: doc.name,
          source: '用户上传文档'
        }
      })
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, topK)
}

const calculateExpression = (question: string): SearchResult | null => {
  const mathPattern = /(\d+(?:\.\d+)?)\s*([+\-×÷*/x乘加减除])\s*(\d+(?:\.\d+)?)/
  const match = question.match(mathPattern)

  if (match) {
    const a = parseFloat(match[1])
    const op = match[2]
    const b = parseFloat(match[3])
    let result: number | string
    let expression = `${a} ${op} ${b}`

    switch (op) {
      case '+':
      case '加':
        result = a + b
        expression = `${a} + ${b}`
        break
      case '-':
      case '减':
        result = a - b
        expression = `${a} - ${b}`
        break
      case '×':
      case '*':
      case 'x':
      case '乘':
        result = a * b
        expression = `${a} × ${b}`
        break
      case '÷':
      case '/':
      case '除':
        if (b === 0) {
          result = '无穷大（除数不能为零）'
        } else {
          result = a / b
        }
        expression = `${a} ÷ ${b}`
        break
      default:
        return null
    }

    const resultStr = typeof result === 'number' ? result.toString() : result

    return {
      source: 'math',
      content: `计算结果：${expression} = ${resultStr}`,
      score: 1.0,
      metadata: {
        title: '数学计算',
        source: '本地计算引擎'
      }
    }
  }

  const squarePattern = /(\d+)\s*的\s*(平方|立方)/
  const squareMatch = question.match(squarePattern)
  if (squareMatch) {
    const num = parseFloat(squareMatch[1])
    const type = squareMatch[2]
    const result = type === '平方' ? num * num : num * num * num
    return {
      source: 'math',
      content: `计算结果：${num} 的${type} = ${result}`,
      score: 1.0,
      metadata: { title: '数学计算', source: '本地计算引擎' }
    }
  }

  const sqrtPattern = /(\d+)\s*的\s*平方根|根号\s*(\d+)|√\s*(\d+)/
  const sqrtMatch = question.match(sqrtPattern)
  if (sqrtMatch) {
    const num = parseFloat(sqrtMatch[1] || sqrtMatch[2] || sqrtMatch[3])
    if (num < 0) {
      return {
        source: 'math',
        content: `${num} 没有实数平方根`,
        score: 1.0,
        metadata: { title: '数学计算', source: '本地计算引擎' }
      }
    }
    return {
      source: 'math',
      content: `计算结果：√${num} = ${Math.sqrt(num).toFixed(4)}`,
      score: 1.0,
      metadata: { title: '数学计算', source: '本地计算引擎' }
    }
  }

  return null
}

const searchPhysicsKnowledge = (question: string): SearchResult | null => {
  const physicsKB: { [key: string]: string } = {
    '牛顿第二定律': '牛顿第二定律：F = ma（力 = 质量 × 加加速度）。这是经典力学的基本定律，描述了力、质量和加速度之间的关系。',
    '欧姆定律': '欧姆定律：I = U/R（电流 = 电压 / 电阻）。电功率：P = UI = I²R = U²/R。',
    '速度': '速度公式：v = s/t（速度 = 路程 / 时间）。加速度：a = Δv/Δt。',
    '加速度': '加速度是速度的变化率：a = Δv/Δt。匀加速运动：v = v₀ + at，s = v₀t + ½at²。',
    '重力': '重力公式：G = mg（g ≈ 9.8m/s²）。物体由于地球吸引而受到的力。',
    '密度': '密度公式：ρ = m/V（密度 = 质量 / 体积）。常见物质密度：水 1000 kg/m³，铁 7800 kg/m³。',
    '动能': '动能公式：Ek = ½mv²。物体由于运动而具有的能量。',
    '势能': '重力势能：Ep = mgh。物体由于位置而具有的能量。',
    '功率': '功率公式：P = W/t = Fv。单位时间内做的功。',
    '动量': '动量公式：p = mv。动量守恒定律：系统总动量保持不变。',
    '万有引力': '万有引力定律：F = G(m₁m₂)/r²。G 为引力常量。'
  }

  for (const [key, content] of Object.entries(physicsKB)) {
    if (question.includes(key)) {
      return {
        source: 'physics',
        content: content,
        score: 0.9,
        metadata: {
          title: key,
          source: '物理知识库'
        }
      }
    }
  }

  return null
}

const searchRealTimeInfo = (question: string): SearchResult | null => {
  if (question.includes('今天') || question.includes('日期') || question.includes('几号')) {
    const now = new Date()
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    return {
      source: 'real-time',
      content: `当前时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      score: 1.0,
      metadata: { title: '当前时间', source: '本地实时数据' }
    }
  }

  if (question.includes('时间') && !question.includes('日期')) {
    const now = new Date()
    return {
      source: 'real-time',
      content: `当前时间：${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
      score: 1.0,
      metadata: { title: '当前时间', source: '本地实时数据' }
    }
  }

  if (question.includes('天气') || question.includes('气温')) {
    const now = new Date()
    const month = now.getMonth() + 1
    let season = ''
    if (month >= 3 && month <= 5) season = '春季'
    else if (month >= 6 && month <= 8) season = '夏季'
    else if (month >= 9 && month <= 11) season = '秋季'
    else season = '冬季'

    const safetyTip = season === '夏季' ? '注意防暑降温，合理安排作业时间。' :
                      season === '冬季' ? '注意防寒保暖，防止设备冻裂。' :
                      '注意天气变化，做好防护措施。'

    return {
      source: 'real-time',
      content: `当前是${season}，气温受地区影响较大。建议关注当地气象预报获取准确信息。\n\n安全提示：${safetyTip}`,
      score: 0.9,
      metadata: { title: '天气信息', source: '本地实时数据' }
    }
  }

  if (question.includes('汇率')) {
    return {
      source: 'real-time',
      content: '当前汇率参考（请以银行实际报价为准）：\n- USD/CNY：约 7.2-7.3\n- EUR/CNY：约 7.8-7.9\n- JPY/CNY：约 0.048-0.049\n\n注：实际汇率请以银行报价为准。',
      score: 0.8,
      metadata: { title: '汇率参考', source: '参考数据' }
    }
  }

  return null
}

export const retrieve = (question: string, options?: { topK?: number; sources?: string[] }): SearchResult[] => {
  const topK = options?.topK || TOP_K
  const results: SearchResult[] = []

  const mathResult = calculateExpression(question)
  if (mathResult) {
    results.push(mathResult)
  }

  const realTimeResult = searchRealTimeInfo(question)
  if (realTimeResult) {
    results.push(realTimeResult)
  }

  const physicsResult = searchPhysicsKnowledge(question)
  if (physicsResult) {
    results.push(physicsResult)
  }

  const kbResults = searchKnowledgeBaseItems(question, topK)
  results.push(...kbResults)

  if (uploadedDocuments.length > 0) {
    const docResults = searchDocuments(question, topK)
    results.push(...docResults)
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK + 2)
}
