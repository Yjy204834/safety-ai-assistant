import type { SearchResult } from './data-sources'

export interface LLMConfig {
  provider: 'local' | 'deepseek' | 'openai' | 'mock'
  apiKey?: string
  apiUrl?: string
  model?: string
}

let llmConfig: LLMConfig = {
  provider: 'mock',
  model: 'safety-ai-assistant'
}

export const setLLMConfig = (config: LLMConfig) => {
  llmConfig = config
}

export const getLLMConfig = (): LLMConfig => llmConfig

const callDeepSeekAPI = async (prompt: string, config: LLMConfig): Promise<string> => {
  const apiUrl = config.apiUrl || 'https://api.deepseek.com/v1/chat/completions'
  const apiKey = config.apiKey || ''
  const model = config.model || 'deepseek-chat'

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || '生成失败'
  } catch (error) {
    console.error('DeepSeek API调用失败:', error)
    throw error
  }
}

const generateLocalAnswer = (question: string, retrievedDocs: SearchResult[]): string => {
  if (retrievedDocs.length === 0) {
    return generateDefaultAnswer(question)
  }

  const topDoc = retrievedDocs[0]
  const sources = retrievedDocs.map(d => `- ${d.metadata.title || d.metadata.source || '参考资料'}`).join('\n')

  let answer = ''

  switch (topDoc.source) {
    case 'math':
      answer = topDoc.content
      break
    case 'real-time':
      answer = topDoc.content
      break
    case 'physics':
      answer = `${topDoc.content}\n\n💡 这是一个物理知识问题，${topDoc.metadata.title} 是物理学中的重要概念。`
      break
    case 'knowledge-base':
      answer = `${topDoc.content}\n\n📌 类别：${topDoc.metadata.category || '通用'}\n📚 来源：${topDoc.metadata.source || '安全知识库'}`
      break
    case 'document':
      answer = `根据您上传的文档「${topDoc.metadata.title}」，我找到了以下相关内容：\n\n${topDoc.content}\n\n💡 如需更详细的分析，请告诉我您想了解的具体方面。`
      break
    default:
      answer = generateDefaultAnswer(question)
  }

  if (retrievedDocs.length > 1) {
    answer += `\n\n📚 参考来源：\n${sources}`
  }

  return answer
}

const generateDefaultAnswer = (question: string): string => {
  const lowerQ = question.toLowerCase()
  
  if (lowerQ.includes('你好') || lowerQ.includes('hello') || lowerQ.includes('hi')) {
    return '您好！我是安全AI助手，可以帮您解答安全知识、数学计算、物理知识、实时信息等问题。请问有什么可以帮助您的？'
  }
  
  if (lowerQ.includes('帮助') || lowerQ.includes('能做什么') || lowerQ.includes('功能')) {
    return `我可以帮您：

1. 🛡️ **安全知识问答** - 安全生产、消防安全、电气安全等
2. 🧮 **数学计算** - 加减乘除、平方、平方根、面积周长
3. ⚛️ **物理知识** - 力学、电学、能量、密度等
4. 📅 **实时信息** - 当前日期时间、天气提示、汇率
5. 📄 **文档分析** - 上传文档后可以分析其内容

请告诉我您想了解什么？`
  }

  const responses = [
    `关于「${question}」，这是一个值得探讨的话题。\n\n让我从专业角度为您分析：这是一个综合性问题，涉及多个方面的知识。建议您可以提供更具体的问题描述，这样我能给出更精准的回答。\n\n💡 提示：您可以尝试问一些具体的问题，比如：\n- 电解槽的安全操作规程\n- 牛顿第二定律的内容\n- 计算 25 × 36\n- 今天的日期`,
    `感谢您的提问！\n\n关于「${question}」，这涉及到多个领域的知识。我可以帮您：\n- 提供安全相关的专业建议\n- 进行数学计算\n- 解释物理概念\n- 查询实时信息\n- 分析您上传的文档\n\n请告诉我您想了解的具体方面。`
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

export const generate = async (prompt: string, retrievedDocs: SearchResult[] = []): Promise<string> => {
  const question = prompt.split('## 用户问题：')[1]?.split('##')[0]?.trim() || prompt

  if (llmConfig.provider === 'deepseek' && llmConfig.apiKey) {
    try {
      return await callDeepSeekAPI(prompt, llmConfig)
    } catch (error) {
      console.warn('LLM API调用失败，使用本地生成:', error)
      return generateLocalAnswer(question, retrievedDocs)
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
  return generateLocalAnswer(question, retrievedDocs)
}
