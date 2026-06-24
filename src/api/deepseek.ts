const API_KEY = 'sk-b5ceede791d4429e92d7fd8eb46da2b4'
const BASE_URL = 'https://api.deepseek.com/v1/chat/completions'

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface DeepSeekResponse {
  choices: {
    message: {
      role: string
      content: string
    }
  }[]
}

export const deepseekApi = {
  async chat(messages: DeepSeekMessage[]): Promise<string> {
    const systemPrompt = `你是一个专业的安全生产AI助手，擅长回答以下类型的问题：
1. 安全知识问答
2. 安全生产规范和标准
3. 电解槽工艺相关技术问题
4. 安全事故预防和应急处理
5. 一般技术咨询

请用简洁、专业的语言回答问题，确保信息准确可靠。`

    const requestMessages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: requestMessages,
          temperature: 0.7,
          max_tokens: 2048
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'API请求失败')
      }

      const data: DeepSeekResponse = await response.json()
      return data.choices[0]?.message?.content || '抱歉，我无法回答这个问题。'
    } catch (error) {
      console.error('DeepSeek API error:', error)
      return '抱歉，当前服务暂时不可用，请稍后再试。'
    }
  }
}
