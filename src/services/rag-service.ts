import { retrieve, addDocument as addDocToStore, getDocuments, clearDocuments } from './retriever'
import { buildRAGPrompt } from './prompt-builder'
import { generate } from './generator'
import type { SearchResult, DocumentItem, AIAnswer } from './data-sources'

export type { DocumentItem, SearchResult, AIAnswer }

export const addDocument = addDocToStore
export const getAllDocuments = getDocuments
export const clearAllDocuments = clearDocuments

export interface RAGResponse {
  answer: string
  retrievedDocs: SearchResult[]
  type: AIAnswer['type']
  sources: string[]
}

const classifyQuestionType = (question: string, retrievedDocs: SearchResult[]): AIAnswer['type'] => {
  if (retrievedDocs.length > 0) {
    const primarySource = retrievedDocs[0].source
    if (primarySource === 'math') return 'math'
    if (primarySource === 'physics') return 'physics'
    if (primarySource === 'real-time') return 'real-time'
    if (primarySource === 'document') return 'document'
  }

  const safetyKeywords = ['安全', '生产', '消防', '电气', '应急', '事故', '预防', '隐患', '巡检', '维护', '操作规程', '规范', '制度', '防护', '作业']
  if (safetyKeywords.some(k => question.includes(k))) return 'safety'
  
  return 'general'
}

export const ask = async (question: string, options?: { topK?: number }): Promise<RAGResponse> => {
  console.log('🚀 [RAG] 开始处理问题:', question)
  
  // ========== 步骤 1: 检索 ==========
  console.log('🔍 [RAG] 步骤1: 检索相关资料...')
  const retrievedDocs = retrieve(question, { topK: options?.topK || 3 })
  console.log(`📚 [RAG] 检索到 ${retrievedDocs.length} 条相关资料`)
  retrievedDocs.forEach((doc, idx) => {
    console.log(`  [${idx + 1}] ${doc.metadata.title || '参考资料'} (score: ${doc.score.toFixed(2)}, source: ${doc.source})`)
  })

  // ========== 步骤 2: 构建 Prompt ==========
  console.log('📝 [RAG] 步骤2: 构建 Prompt...')
  const prompt = buildRAGPrompt(question, retrievedDocs)
  console.log(`📄 [RAG] Prompt 长度: ${prompt.length} 字符`)

  // ========== 步骤 3: 调用 LLM 生成回答 ==========
  console.log('🤖 [RAG] 步骤3: 调用大语言模型生成回答...')
  const answer = await generate(prompt, retrievedDocs)
  console.log('✅ [RAG] 回答生成完成')

  // ========== 整理返回结果 ==========
  const type = classifyQuestionType(question, retrievedDocs)
  const sources = retrievedDocs
    .filter(d => d.score > 0.1)
    .map(d => d.metadata.title || d.metadata.source || '参考资料')

  return {
    answer,
    retrievedDocs,
    type,
    sources: Array.from(new Set(sources))
  }
}

export const ragStream = async (
  question: string,
  onChunk: (chunk: string) => void,
  options?: { topK?: number }
): Promise<RAGResponse> => {
  const response = await ask(question, options)
  
  const chunkSize = 10
  for (let i = 0; i < response.answer.length; i += chunkSize) {
    onChunk(response.answer.substring(i, i + chunkSize))
    await new Promise(resolve => setTimeout(resolve, 30))
  }
  
  return response
}
