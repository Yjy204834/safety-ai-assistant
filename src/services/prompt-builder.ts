import type { SearchResult } from './data-sources'

export const buildRAGPrompt = (question: string, retrievedDocs: SearchResult[]): string => {
  let context = ''
  if (retrievedDocs.length > 0) {
    context = '\n\n## 参考资料\n'
    retrievedDocs.forEach((doc, idx) => {
      const title = doc.metadata.title || `参考资料${idx + 1}`
      const source = doc.metadata.source || '未知来源'
      context += `\n### [${idx + 1}] ${title}（来源：${source}）\n${doc.content}\n`
    })
  }

  const systemPrompt = `你是安全AI助手，是企业安全生产管理领域的专业AI。请基于参考资料和你的知识，简洁、专业地回答用户问题。

## 回答要求：
1. 优先使用参考资料中的信息
2. 数学计算问题直接给出计算过程和结果
3. 物理问题给出公式和解释
4. 实时信息问题直接提供数据
5. 安全相关问题要专业、准确、有条理
6. 如参考资料不足，可结合通用知识回答
7. 回答末尾列出引用的参考来源${context}

## 用户问题：
${question}

## 请提供专业回答：`

  return systemPrompt
}

export const buildSimplePrompt = (question: string): string => {
  return `你是安全AI助手，请简洁专业地回答：${question}`
}
