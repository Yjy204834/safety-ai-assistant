export interface KnowledgeBaseItem {
  id: string
  title: string
  content: string
  category: string
  keywords: string[]
  source: string
}

export interface DocumentItem {
  id: string
  name: string
  type: string
  size: number
  content: string
  uploadTime: number
  chunks?: DocumentChunk[]
}

export interface DocumentChunk {
  id: string
  documentId: string
  content: string
  index: number
}

export interface SearchResult {
  source: 'knowledge-base' | 'document' | 'math' | 'physics' | 'real-time' | 'web'
  content: string
  score: number
  metadata: {
    title?: string
    category?: string
    source?: string
    url?: string
  }
}

export const knowledgeBase: KnowledgeBaseItem[] = [
  {
    id: 'kb-001',
    title: '电解槽安全操作规程',
    content: '电解槽是化工生产中的核心设备，操作时必须严格遵守以下安全规程：开机前检查电解液液位、电极连接、冷却系统；运行监控槽电压应控制在4.0-4.5V之间，温度保持在80-90°C，电流密度不超过2.2A/cm²；紧急处理时发生异常应立即断电，保持通风良好，按应急预案处理。',
    category: '安全操作',
    keywords: ['电解槽', '操作规程', '安全', '运行', '监控', '电压', '温度'],
    source: '安全知识库'
  },
  {
    id: 'kb-002',
    title: '消防安全管理规范',
    content: '消防安全是企业安全生产的重要组成部分：消防设施应按规定配备灭火器、消防栓并定期检查；火灾预防需禁止明火作业、定期清理易燃物、定期检修电气设备；应急处理时发现火情应立即报警，使用灭火器时站在上风口，按疏散路线撤离。灭火器使用步骤：拔（拔掉保险销）、握（握住喷管）、压（压下手柄）、扫（左右扫射）。',
    category: '消防安全',
    keywords: ['消防', '火灾', '安全', '灭火器', '应急', '疏散', '消防栓'],
    source: '安全知识库'
  },
  {
    id: 'kb-003',
    title: '电气安全规范',
    content: '电气安全是工业生产的基础保障：安全电压标准为36V以下，湿手禁止触摸电器，设备必须接地良好；定期检查电线电缆，及时更换老化设备，维护前必须断电；三级安全教育指公司级、车间级、班组级。',
    category: '电气安全',
    keywords: ['电气', '用电', '安全', '电压', '接地', '电缆', '三级教育'],
    source: '安全知识库'
  },
  {
    id: 'kb-004',
    title: '安全生产四不放过原则',
    content: '安全生产事故处理的四不放过原则：1.事故原因未查清不放过；2.责任人员未处理不放过；3.整改措施未落实不放过；4.有关人员未受到教育不放过。这是我国安全生产管理的重要原则，确保事故得到彻底处理，防止类似事故再次发生。',
    category: '安全管理',
    keywords: ['四不放过', '事故', '安全', '原则', '处理', '整改'],
    source: '安全知识库'
  },
  {
    id: 'kb-005',
    title: '夏季安全生产注意事项',
    content: '夏季高温天气安全生产要点：防暑降温需合理安排作业时间，提供充足饮水，设置休息区域；防雷防雨应检查防雷设施，暴雨天气停止户外作业；设备维护需加强电气设备检查，防止高温引发故障。',
    category: '季节安全',
    keywords: ['夏季', '高温', '防暑', '安全', '降温', '雷电', '暴雨'],
    source: '安全知识库'
  },
  {
    id: 'kb-006',
    title: '化学危险品安全',
    content: '化学危险品安全管理：危险化学品分为爆炸品、压缩气体、易燃液体、易燃固体、氧化剂、毒害品、放射性物品、腐蚀品等；储存应分类存放、远离火源、保持通风；使用应穿戴防护用品、遵守操作规程、配备应急器材；泄漏处理应立即疏散人员、设置警戒、报告专业人员处理。',
    category: '危险化学品',
    keywords: ['化学品', '危险', '安全', '储存', '腐蚀', '爆炸', '毒害'],
    source: '安全知识库'
  },
  {
    id: 'kb-007',
    title: '高空作业安全规范',
    content: '高空作业安全规范：作业前需办理高空作业许可证，进行安全技术交底；人员须经体检合格、持证上岗；作业时必须佩戴安全带、安全帽、防滑鞋等防护用品；2米以上作业必须设置防护栏、安全网；遇6级以上大风、暴雨雷电等恶劣天气停止作业。',
    category: '作业安全',
    keywords: ['高空作业', '安全', '防护', '安全带', '许可证', '恶劣天气'],
    source: '安全知识库'
  },
  {
    id: 'kb-008',
    title: '机械伤害防护',
    content: '机械伤害防护要点：设备应有防护罩、防护栏等安全装置；传动部分应设置防护；操作前检查设备状况、确认安全装置有效；运转中禁止检修、调整、清理；操作人员应穿戴工作服、束紧袖口、禁止戴手套操作旋转设备；发生伤害立即停机、抢救伤员、报告上级。',
    category: '作业安全',
    keywords: ['机械', '伤害', '防护', '防护罩', '操作', '安全装置'],
    source: '安全知识库'
  }
]
