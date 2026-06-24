export interface QAMessage {
  id: number
  type: 'question' | 'answer'
  content: string
  time: string
}

export interface AttachmentFile {
  name: string
  type: string
  size: number
  preview?: string
  content?: string
}

export interface Message {
  id: number
  content: string
  isUser: boolean
  images?: string[]
  attachments?: AttachmentFile[]
}

export interface MockAnswer {
  type: 'general' | 'safety' | 'both'
  keywords?: string[]
  answer: string
}

export const mockAnswers: MockAnswer[] = [
  { type: 'general', answer: '您好！很高兴为您服务。请问有什么可以帮助您的吗？' },
  { type: 'general', keywords: ['工作原理', '原理'], answer: '电解槽是通过电解作用将电能转化为化学能的装置。其工作原理是：在电场作用下，电解液中的离子定向移动，在阳极发生氧化反应，在阴极发生还原反应。通过控制电流、电压和温度等参数，可以实现高效的电解过程。' },
  { type: 'general', keywords: ['效率', '提高效率'], answer: '提高生产效率可以从以下几个方面入手：1.优化工艺流程，减少不必要的环节；2.引入自动化和智能化设备；3.加强员工培训，提高操作技能；4.建立完善的质量管理体系；5.定期维护设备，保证设备正常运行。' },
  { type: 'general', keywords: ['设备维护', '维护'], answer: '设备维护的注意事项：1.制定定期维护计划；2.做好维护记录；3.使用原厂配件；4.维护人员需持证上岗；5.维护前确保设备断电；6.维护后进行试运行检查。' },
  { type: 'general', answer: '这是一个很好的问题！让我来为您解答。' },
  { type: 'general', answer: '根据您的问题，我认为最佳方案是进行全面的数据分析，然后制定针对性的解决方案。' },
  { type: 'general', answer: '感谢您的提问，我会尽力为您解答。如有其他问题，欢迎继续咨询。' },
  { type: 'safety', answer: '安全生产是企业发展的基石，请务必重视。安全第一，预防为主，综合治理是我们的基本方针。' },
  { type: 'safety', keywords: ['基本原则', '原则'], answer: '安全生产的基本原则包括：1.安全第一原则；2.预防为主原则；3.综合治理原则；4.管生产必须管安全原则；5.全员安全生产责任原则；6.三同时原则；7.四不放过原则。' },
  { type: 'safety', keywords: ['紧急情况', '应急'], answer: '遇到紧急情况时，请保持冷静，并遵循以下步骤：1.立即停止作业；2.评估现场风险；3.按照应急预案采取措施；4.及时向上级报告；5.组织人员疏散；6.配合救援工作。' },
  { type: 'safety', keywords: ['预防事故', '安全事故'], answer: '预防安全事故的措施包括：1.建立健全安全管理制度；2.加强安全教育培训；3.定期开展安全检查；4.及时整改安全隐患；5.配备必要的安全防护设备；6.制定并演练应急预案。' },
  { type: 'safety', keywords: ['安全用电', '用电'], answer: '安全用电需要注意：1.不要超负荷用电；2.定期检查电线电缆；3.设备接地要良好；4.湿手不要触摸电器；5.发现异常及时断电；6.遵守用电操作规程。' },
  { type: 'safety', keywords: ['灭火器', '消防'], answer: '灭火器的使用方法是：拔（拔掉保险销）、握（握住喷管）、压（压下手柄）、扫（左右扫射）。使用时要站在上风口，距离火源2-3米。' },
  { type: 'safety', answer: '请遵守安全操作规程，保障自身安全。进入作业现场请正确佩戴个人防护用品。' },
  { type: 'safety', answer: '发现安全隐患请及时上报，共同维护安全环境。安全是每个人的责任。' },
  { type: 'both', answer: '好的，我来为您提供相关信息。' },
  { type: 'both', answer: '感谢您的咨询，祝您工作顺利！如果还有其他问题，欢迎随时提问。' }
]

export const aiQaHistory: QAMessage[] = [
  { id: 1, type: 'question', content: '什么是人工智能?', time: '10:30' },
  { id: 2, type: 'answer', content: '人工智能(AI)是计算机科学的一个分支,致力于研究、开发用于模拟、延伸和扩展人的智能的理论、方法、技术及应用系统。人工智能领域的研究包括机器人、语言识别、图像识别、自然语言处理和专家系统等。', time: '10:31' },
  { id: 3, type: 'question', content: 'AI可以应用在哪些领域?', time: '10:35' },
  { id: 4, type: 'answer', content: 'AI的应用领域非常广泛,包括:医疗健康、金融服务、智能制造、交通运输、教育、安防监控、智能家居、客户服务等。', time: '10:36' }
]

export const safetyQaHistory: QAMessage[] = [
  { id: 1, type: 'question', content: '什么是安全生产?', time: '09:15' },
  { id: 2, type: 'answer', content: '安全生产是指在生产经营活动中,为避免造成人员伤害和财产损失的事故而采取相应的事故预防和控制措施,以保证从业人员的人身安全,保证生产经营活动得以顺利进行的相关活动。', time: '09:16' },
  { id: 3, type: 'question', content: '安全用电需要注意什么?', time: '09:20' },
  { id: 4, type: 'answer', content: '1. 不要超负荷用电;2. 定期检查电线电缆;3. 设备接地要良好;4. 湿手不要触摸电器;5. 发现异常及时断电;6. 遵守用电操作规程。', time: '09:21' }
]

export interface NewsItem {
  id: number
  title: string
  summary: string
  content: string
  category: string
  time: string
  author: string
  image: string
}

export const newsCategories = ['全部', '公司动态', '行业资讯', '安全公告', '政策法规']

export const newsList: NewsItem[] = [
  {
    id: 1,
    title: '集团开展2026年度安全生产大检查',
    summary: '为深入贯彻落实安全生产工作要求,集团于近日开展了年度安全生产大检查工作...',
    content: '为深入贯彻落实安全生产工作要求,集团于近日开展了2026年度安全生产大检查工作。检查组由集团安委会领导带队,对各下属单位进行了全面细致的安全隐患排查。\n\n检查内容包括:1. 安全管理制度落实情况;2. 设备设施运行状态;3. 安全防护措施到位情况;4. 应急预案制定与演练情况;5. 员工安全培训情况。\n\n通过检查,共发现安全隐患28处,已责令相关单位限期整改。集团要求各单位要高度重视安全生产工作,切实落实主体责任,确保生产运营安全稳定。',
    category: '公司动态',
    time: '2026-05-22',
    author: '安全管理部',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=industrial%20safety%20inspection%20team%20checking%20equipment%20in%20modern%20factory%2C%20professional%20workers%20with%20safety%20helmets&image_size=landscape_16_9'
  },
  {
    id: 2,
    title: '《安全生产法》2026年修订版解读发布',
    summary: '应急管理部发布《安全生产法》2026年修订版权威解读,对企业安全生产管理提出新要求...',
    content: '应急管理部近日发布《安全生产法》2026年修订版权威解读,对企业安全生产管理提出新的更高要求。此次修订重点强化了数字化安全管理、AI技术应用、碳安全等新领域的规范。\n\n主要修订内容包括:\n1. 强化数字化安全管理,要求企业建立安全生产数字档案;\n2. 明确AI技术在安全监测中的应用规范;\n3. 增加碳安全相关条款,推动绿色安全生产;\n4. 进一步完善安全生产责任保险制度;\n5. 优化应急救援体系建设。\n\n集团要求各单位组织员工认真学习新修订内容,确保各项规定落实到位。',
    category: '政策法规',
    time: '2026-05-20',
    author: '法务部',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=government%20document%20law%20book%20with%20digital%20interface%20showing%20safety%20regulations%2C%20professional%20legal%20concept&image_size=landscape_16_9'
  },
  {
    id: 3,
    title: '2026年行业安全技术峰会成功举办',
    summary: '由集团主办的2026年行业安全技术峰会于5月18日成功举办,聚焦AI+安全创新应用...',
    content: '由集团主办的2026年行业安全技术峰会于5月18日成功举办。来自行业内的专家学者、企业代表共300余人参加了此次峰会。\n\n峰会上,专家们就AI技术在安全生产监测预警、智能巡检、风险评估等领域的创新应用进行了深入探讨,分享了各自在数字化安全管理方面的经验和成果。\n\n通过此次峰会,进一步加强了行业间的交流与合作,为推动行业安全管理数字化转型奠定了良好基础。',
    category: '行业资讯',
    time: '2026-05-19',
    author: '技术研发部',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=technology%20conference%20event%20with%20professional%20speakers%20on%20stage%2C%20audience%20in%20modern%20conference%20hall&image_size=landscape_16_9'
  },
  {
    id: 4,
    title: '关于加强夏季安全生产的通知',
    summary: '针对夏季高温、雷电、暴雨等特点,集团下发通知要求各单位加强季节性安全生产管理...',
    content: '针对夏季高温、雷电、暴雨等季节性特点,集团下发通知要求各单位加强安全生产管理。\n\n通知要求:\n1. 加强防暑降温工作,合理安排作业时间;\n2. 做好防汛防涝准备,完善应急物资储备;\n3. 加强电气设备检查,防止因高温引发事故;\n4. 开展夏季安全生产隐患专项排查治理;\n5. 组织开展高温中暑、雷电灾害等应急演练。\n\n各单位要高度重视夏季安全生产工作,切实做好各项防范措施,确保安全生产形势稳定。',
    category: '安全公告',
    time: '2026-05-18',
    author: '安全管理部',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=summer%20safety%20warning%20with%20heat%20wave%20and%20thunderstorm%20icons%2C%20industrial%20safety%20concept&image_size=landscape_16_9'
  },
  {
    id: 5,
    title: '集团荣获2025年度"数字化安全标杆企业"称号',
    summary: '在近日召开的全国安全生产工作会议上,集团荣获"数字化安全标杆企业"称号...',
    content: '在近日召开的全国安全生产工作会议上,集团荣获2025年度"数字化安全标杆企业"称号。这是对集团在数字化安全管理方面创新实践的充分肯定。\n\n近年来,集团大力推进安全生产数字化转型,引入AI监测系统、智能巡检机器人、大数据风险预警平台等新技术,安全生产管理水平显著提升。\n\n集团表示将珍惜荣誉,再接再厉,继续深化数字化安全管理创新,为行业发展贡献更多经验。',
    category: '公司动态',
    time: '2026-05-15',
    author: '宣传部',
    image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=corporate%20award%20ceremony%20with%20trophy%20and%20digital%20transformation%20concept%2C%20modern%20business%20success&image_size=landscape_16_9'
  }
]

export interface PsychQuestion {
  id: number
  question: string
  options: string[]
  answer: number
}

export const psychTestQuestions: PsychQuestion[] = [
  {
    id: 1,
    question: '当工作压力很大时，你通常会怎么做？',
    options: ['选择逃避，不去面对', '寻求同事或朋友的帮助', '自己默默承受', '通过运动或娱乐缓解'],
    answer: 3
  },
  {
    id: 2,
    question: '你对自己目前的工作状态满意吗？',
    options: ['非常不满意', '不太满意', '一般', '比较满意', '非常满意'],
    answer: 3
  },
  {
    id: 3,
    question: '当你与同事发生意见分歧时，你会？',
    options: ['坚持自己的观点', '听取对方意见再决定', '寻求上级协调', '避免争论'],
    answer: 1
  },
  {
    id: 4,
    question: '你觉得自己的工作负荷如何？',
    options: ['轻松', '适中', '较重', '非常重'],
    answer: 1
  },
  {
    id: 5,
    question: '你多久进行一次体育锻炼？',
    options: ['几乎不锻炼', '每周1-2次', '每周3-4次', '每天都锻炼'],
    answer: 2
  }
]

export interface TheoryLesson {
  id: number
  title: string
  category: string
  duration: string
  views: number
  content: string
}

export const theoryLessons: TheoryLesson[] = [
  {
    id: 1,
    title: '数字化安全生产管理',
    category: '创新课程',
    duration: '50分钟',
    views: 3256,
    content: '数字化安全生产管理是企业安全管理的重要发展方向。本章将介绍数字化安全管理的基本概念、技术应用、实施方法等内容。\n\n一、数字化安全管理概述\n利用大数据、AI、物联网等技术提升安全管理水平。\n\n二、核心技术应用\nAI监测预警、智能巡检、数字孪生、风险智能评估。\n\n三、实施步骤\n需求分析、系统选型、试点推广、持续优化。'
  },
  {
    id: 2,
    title: 'AI技术在安全生产中的应用',
    category: '创新课程',
    duration: '45分钟',
    views: 2890,
    content: 'AI技术正在深刻改变安全生产管理模式。本章将介绍AI在安全监测、风险预警、智能分析等方面的应用。\n\n一、AI安全监测\n计算机视觉识别不安全行为、智能分析监测数据。\n\n二、风险智能预警\n机器学习预测事故风险、实时异常检测。\n\n三、智能决策支持\n辅助安全管理决策、优化应急响应。'
  },
  {
    id: 3,
    title: '消防安全知识（2026版）',
    category: '专项课程',
    duration: '35分钟',
    views: 1986,
    content: '消防安全是安全生产的重要组成部分。本章将根据最新规范介绍火灾预防、消防器材使用、逃生技巧等内容。\n\n一、火灾防控新标准\n智能消防系统应用、初期火灾处置要点。\n\n二、消防器材使用\n智能灭火器、消防机器人、新型灭火剂。\n\n三、火灾逃生技巧\n保持冷静、低姿逃生、利用智能疏散系统。'
  },
  {
    id: 4,
    title: '碳安全与绿色生产',
    category: '专项课程',
    duration: '40分钟',
    views: 1654,
    content: '碳安全是新时代安全生产的重要内容。本章将介绍碳安全管理、绿色生产规范、节能减碳技术等。\n\n一、碳安全概述\n碳安全与安全生产的关系、碳风险识别。\n\n二、绿色生产规范\n清洁生产技术、节能降耗措施、环保设备运维。\n\n三、碳管理体系\n碳足迹追踪、碳排放监测、碳中和路径。'
  },
  {
    id: 5,
    title: '智能应急预案与演练',
    category: '综合课程',
    duration: '40分钟',
    views: 2106,
    content: '智能应急预案提升应急响应效率。本章将介绍智能预案系统、模拟演练平台、应急指挥调度等内容。\n\n一、智能预案系统\n预案数字化、动态更新、智能匹配。\n\n二、模拟演练平台\nVR/AR演练、桌面推演系统、演练评估。\n\n三、应急指挥调度\n智能调度系统、应急资源管理、协同作战平台。'
  }
]

export interface VideoLesson {
  id: number
  title: string
  category: string
  duration: string
  views: number
  cover: string
}

export const videoLessons: VideoLesson[] = [
  {
    id: 1,
    title: 'AI智能安全监测系统演示',
    category: '创新应用',
    duration: '32:15',
    views: 5234,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20safety%20monitoring%20system%20demonstration%2C%20modern%20industrial%20design&image_size=landscape_16_9'
  },
  {
    id: 2,
    title: '智能巡检机器人操作指南',
    category: '操作培训',
    duration: '28:30',
    views: 4156,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Intelligent%20inspection%20robot%20operation%20guide&image_size=landscape_16_9'
  },
  {
    id: 3,
    title: '2026年度消防安全演练',
    category: '实战演练',
    duration: '25:00',
    views: 3543,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=2026%20fire%20safety%20drill%20with%20smart%20equipment&image_size=landscape_16_9'
  },
  {
    id: 4,
    title: '数字化安全管理平台介绍',
    category: '系统介绍',
    duration: '35:20',
    views: 2876,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Digital%20safety%20management%20platform%20introduction&image_size=landscape_16_9'
  },
  {
    id: 5,
    title: '碳安全与绿色生产实践',
    category: '专题讲座',
    duration: '48:00',
    views: 2345,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Carbon%20safety%20and%20green%20production%20practice&image_size=landscape_16_9'
  }
]

export interface SafetyQuestion {
  id: number
  question: string
  options: string[]
  correct: number
}

export const safetyTestQuestions: SafetyQuestion[] = [
  {
    id: 1,
    question: '我国的安全生产方针是什么？',
    options: ['安全第一、预防为主', '安全第一、预防为主、综合治理', '预防为主、综合治理', '安全第一、综合治理'],
    correct: 1
  },
  {
    id: 2,
    question: '从业人员发现直接危及人身安全的紧急情况时，有权（）。',
    options: ['停止作业', '停止作业或者在采取可能的应急措施后撤离作业场所', '撤离作业场所', '继续作业'],
    correct: 1
  },
  {
    id: 3,
    question: '灭火器的使用步骤是（）。',
    options: ['拔、握、压、扫', '握、拔、压、扫', '拔、握、扫、压', '握、压、拔、扫'],
    correct: 0
  },
  {
    id: 4,
    question: '以下哪种行为是不安全的？',
    options: ['正确佩戴安全帽', '酒后上岗', '按规程操作设备', '定期检查设备'],
    correct: 1
  },
  {
    id: 5,
    question: '发生火灾时，应该（）。',
    options: ['乘电梯逃生', '从楼梯逃生', '跳楼逃生', '原地等待救援'],
    correct: 1
  },
  {
    id: 6,
    question: '安全电压的标准是（）。',
    options: ['36V以下', '24V以下', '12V以下', '48V以下'],
    correct: 0
  },
  {
    id: 7,
    question: '三级安全教育是指（）。',
    options: ['公司级、车间级、班组级', '国家级、省级、市级', '初级、中级、高级', '入门级、进阶级、高级'],
    correct: 0
  },
  {
    id: 8,
    question: '使用灭火器灭火时，人应该站在（）。',
    options: ['上风口', '下风口', '侧风口', '任意位置'],
    correct: 0
  },
  {
    id: 9,
    question: '以下哪种物品不属于危险化学品？',
    options: ['汽油', '酒精', '食盐', '浓硫酸'],
    correct: 2
  },
  {
    id: 10,
    question: '安全标志分为（）四类。',
    options: ['禁止标志、警告标志、指令标志、提示标志', '红色标志、黄色标志、蓝色标志、绿色标志', '防火标志、防爆标志、防毒标志、防触电标志', '以上都不对'],
    correct: 0
  }
]

export interface EquipmentStatus {
  id: string
  name: string
  status: 'normal' | 'warning' | 'error'
  params: {
    name: string
    value: string
    unit: string
    range: string
    status: 'normal' | 'warning' | 'error'
  }[]
}

export const equipmentList: EquipmentStatus[] = [
  {
    id: 'EL-001',
    name: '1号电解槽',
    status: 'normal',
    params: [
      { name: '槽电压', value: '4.2V', unit: 'V', range: '4.0-4.5V', status: 'normal' },
      { name: '电流密度', value: '2.0A/cm²', unit: 'A/cm²', range: '1.8-2.2A/cm²', status: 'normal' },
      { name: '温度', value: '85°C', unit: '°C', range: '80-90°C', status: 'normal' },
      { name: '液位', value: '1.2m', unit: 'm', range: '1.0-1.5m', status: 'normal' }
    ]
  },
  {
    id: 'EL-002',
    name: '2号电解槽',
    status: 'warning',
    params: [
      { name: '槽电压', value: '4.6V', unit: 'V', range: '4.0-4.5V', status: 'warning' },
      { name: '电流密度', value: '2.1A/cm²', unit: 'A/cm²', range: '1.8-2.2A/cm²', status: 'normal' },
      { name: '温度', value: '92°C', unit: '°C', range: '80-90°C', status: 'warning' },
      { name: '液位', value: '1.1m', unit: 'm', range: '1.0-1.5m', status: 'normal' }
    ]
  },
  {
    id: 'EL-003',
    name: '3号电解槽',
    status: 'normal',
    params: [
      { name: '槽电压', value: '4.3V', unit: 'V', range: '4.0-4.5V', status: 'normal' },
      { name: '电流密度', value: '1.9A/cm²', unit: 'A/cm²', range: '1.8-2.2A/cm²', status: 'normal' },
      { name: '温度', value: '88°C', unit: '°C', range: '80-90°C', status: 'normal' },
      { name: '液位', value: '1.3m', unit: 'm', range: '1.0-1.5m', status: 'normal' }
    ]
  },
  {
    id: 'EL-004',
    name: '4号电解槽',
    status: 'error',
    params: [
      { name: '槽电压', value: '5.1V', unit: 'V', range: '4.0-4.5V', status: 'error' },
      { name: '电流密度', value: '2.3A/cm²', unit: 'A/cm²', range: '1.8-2.2A/cm²', status: 'error' },
      { name: '温度', value: '98°C', unit: '°C', range: '80-90°C', status: 'error' },
      { name: '液位', value: '0.8m', unit: 'm', range: '1.0-1.5m', status: 'error' }
    ]
  }
]

export interface PurchaseItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  price: number
  supplier: string
  status: 'pending' | 'approved' | 'purchased' | 'received'
  date: string
}

export const purchaseList: PurchaseItem[] = [
  { id: 1, name: 'AI安全监测系统模块', category: '智能设备', quantity: 8, unit: '套', price: 35000, supplier: 'XX智能科技', status: 'approved', date: '2026-05-22' },
  { id: 2, name: '智能巡检机器人配件', category: '机器人配件', quantity: 20, unit: '套', price: 12000, supplier: 'XX机器人', status: 'purchased', date: '2026-05-21' },
  { id: 3, name: '环境监测传感器', category: '仪表设备', quantity: 30, unit: '个', price: 18500, supplier: 'XX仪器', status: 'pending', date: '2026-05-20' },
  { id: 4, name: '碳减排设备组件', category: '环保设备', quantity: 15, unit: '套', price: 25000, supplier: 'XX环保科技', status: 'received', date: '2026-05-19' },
  { id: 5, name: '智能消防系统升级包', category: '安全设备', quantity: 10, unit: '套', price: 28000, supplier: 'XX消防科技', status: 'approved', date: '2026-05-18' },
  { id: 6, name: '工业物联网网关', category: '网络设备', quantity: 12, unit: '台', price: 15000, supplier: 'XX通信', status: 'purchased', date: '2026-05-17' },
  { id: 7, name: '安全管理系统授权', category: '软件服务', quantity: 1, unit: '套', price: 85000, supplier: 'XX软件', status: 'received', date: '2026-05-16' },
  { id: 8, name: 'VR应急演练系统', category: '培训设备', quantity: 2, unit: '套', price: 45000, supplier: 'XX数字科技', status: 'pending', date: '2026-05-15' }
]

export const purchaseStatistics = {
  totalAmount: 58500,
  pendingAmount: 23000,
  approvedAmount: 17500,
  purchasedAmount: 13000,
  receivedAmount: 5000,
  categoryStats: [
    { name: '核心部件', amount: 2500, count: 1 },
    { name: '化工原料', amount: 8500, count: 1 },
    { name: '电气设备', amount: 15000, count: 1 },
    { name: '通用配件', amount: 5000, count: 2 },
    { name: '仪表设备', amount: 12500, count: 1 },
    { name: '电气材料', amount: 4500, count: 1 },
    { name: '机械设备', amount: 8000, count: 1 }
  ]
}

export interface ElectrolyzerData {
  id: number
  status: 'normal' | 'warning' | 'error'
  current: number
  voltage: number
  temperature: number
  pressure: number
  updateTime: string
}

export const electrolyzerData: ElectrolyzerData[] = [
  { id: 1, status: 'normal', current: 2500, voltage: 4.2, temperature: 85, pressure: 0.12, updateTime: '2026-05-22 14:30:00' },
  { id: 2, status: 'warning', current: 2550, voltage: 4.5, temperature: 92, pressure: 0.15, updateTime: '2026-05-22 14:29:30' },
  { id: 3, status: 'normal', current: 2480, voltage: 4.1, temperature: 83, pressure: 0.11, updateTime: '2026-05-22 14:30:15' },
  { id: 4, status: 'error', current: 2680, voltage: 5.2, temperature: 98, pressure: 0.18, updateTime: '2026-05-22 14:28:00' },
  { id: 5, status: 'normal', current: 2490, voltage: 4.3, temperature: 86, pressure: 0.13, updateTime: '2026-05-22 14:30:05' },
  { id: 6, status: 'normal', current: 2510, voltage: 4.2, temperature: 84, pressure: 0.12, updateTime: '2026-05-22 14:30:20' }
]

export interface AlertItem {
  id: number
  title: string
  level: 'warning' | 'error'
  time: string
}

export const recentAlerts: AlertItem[] = [
  { id: 1, title: '4号电解槽温度异常', level: 'error', time: '14:28:00' },
  { id: 2, title: '2号电解槽电压偏高', level: 'warning', time: '14:25:00' },
  { id: 3, title: 'AI系统安全监测预警', level: 'warning', time: '14:15:00' },
  { id: 4, title: '夏季安全巡检提醒', level: 'warning', time: '10:00:00' }
]

export interface PurchaseDetail {
  id: number
  name: string
  spec: string
  amount: number
  count: number
  icon: string
}

export const purchaseData: PurchaseDetail[] = [
  { id: 1, name: '电解槽阳极板', spec: '型号EL-200', amount: 2500, count: 50, icon: '🔧' },
  { id: 2, name: '电解液', spec: '工业级', amount: 8500, count: 1000, icon: '🧪' },
  { id: 3, name: '控制柜', spec: 'PLC-3000', amount: 15000, count: 10, icon: '🖥️' },
  { id: 4, name: '阀门', spec: 'DN50', amount: 3000, count: 200, icon: '🔐' },
  { id: 5, name: '传感器', spec: '温度/压力', amount: 12500, count: 50, icon: '📡' },
  { id: 6, name: '电缆', spec: 'YJV-3*16', amount: 4500, count: 500, icon: '🔌' },
  { id: 7, name: '密封件', spec: '氟橡胶', amount: 2000, count: 500, icon: '🧱' },
  { id: 8, name: '水泵', spec: '不锈钢', amount: 8000, count: 5, icon: '💧' }
]

export interface MonthlyPurchase {
  month: string
  amount: number
}

export const monthlyPurchaseData: MonthlyPurchase[] = [
  { month: '7月', amount: 45000 },
  { month: '8月', amount: 52000 },
  { month: '9月', amount: 38000 },
  { month: '10月', amount: 68000 },
  { month: '11月', amount: 55000 },
  { month: '12月', amount: 58500 }
]

export interface LearningRecord {
  id: number
  title: string
  type: 'video' | 'theory' | 'test'
  progress: number
  duration: string
  completedAt?: string
  score?: number
  status: 'completed' | 'in-progress' | 'not-started'
}

export const learningRecords: LearningRecord[] = [
  { id: 1, title: '数字化安全生产管理', type: 'theory', progress: 100, duration: '50分钟', completedAt: '2026-05-20', status: 'completed' },
  { id: 2, title: 'AI技术在安全生产中的应用', type: 'theory', progress: 85, duration: '45分钟', completedAt: '2026-05-19', status: 'in-progress' },
  { id: 3, title: '消防安全知识（2026版）', type: 'theory', progress: 0, duration: '35分钟', status: 'not-started' },
  { id: 4, title: '碳安全与绿色生产', type: 'theory', progress: 45, duration: '40分钟', completedAt: '2026-05-15', status: 'in-progress' },
  { id: 5, title: '智能应急预案与演练', type: 'theory', progress: 0, duration: '40分钟', status: 'not-started' }
]

export interface Notification {
  id: number
  title: string
  content: string
  type: 'system' | 'training' | 'security' | 'salary'
  isRead: boolean
  time: string
}

export const notifications: Notification[] = [
  { id: 1, title: '培训课程更新', content: '2026年度新课程已上线，请及时学习。', type: 'training', isRead: false, time: '2026-05-22 09:00' },
  { id: 2, title: 'AI安全监测系统升级', content: '系统将于本周日凌晨进行AI功能升级。', type: 'system', isRead: false, time: '2026-05-21 16:45' },
  { id: 3, title: '工资条已生成', content: '2026年5月工资条已生成，请注意查收。', type: 'salary', isRead: true, time: '2026-05-20 09:00' },
  { id: 4, title: '安全知识考核提醒', content: '您的数字化安全知识考核即将到期，请尽快完成。', type: 'training', isRead: true, time: '2026-05-18 11:20' },
  { id: 5, title: '夏季安全生产检查', content: '2026年度夏季安全生产大检查已开始，请配合完成。', type: 'security', isRead: true, time: '2026-05-16 08:30' },
  { id: 6, title: '智能巡检任务分配', content: '您有新的智能巡检任务已分配，请及时处理。', type: 'security', isRead: true, time: '2026-05-15 14:00' }
]

export interface SalaryRecord {
  id: number
  year: number
  month: number
  baseSalary: number
  performanceBonus: number
  overtimePay: number
  allowance: number
  deductions: number
  totalSalary: number
  actualSalary: number
  paymentDate: string
  isPaid: boolean
}

export const salaryRecords: SalaryRecord[] = [
  { id: 1, year: 2026, month: 5, baseSalary: 8500, performanceBonus: 2500, overtimePay: 600, allowance: 1000, deductions: 1800, totalSalary: 12600, actualSalary: 10800, paymentDate: '2026-05-15', isPaid: true },
  { id: 2, year: 2026, month: 4, baseSalary: 8500, performanceBonus: 2200, overtimePay: 400, allowance: 1000, deductions: 1750, totalSalary: 12100, actualSalary: 10350, paymentDate: '2026-04-15', isPaid: true },
  { id: 3, year: 2026, month: 3, baseSalary: 8500, performanceBonus: 2000, overtimePay: 500, allowance: 1000, deductions: 1700, totalSalary: 12000, actualSalary: 10300, paymentDate: '2026-03-15', isPaid: true },
  { id: 4, year: 2026, month: 2, baseSalary: 8000, performanceBonus: 1800, overtimePay: 300, allowance: 1000, deductions: 1600, totalSalary: 11100, actualSalary: 9500, paymentDate: '2026-02-15', isPaid: true }
]

export interface UserSettings {
  notificationEnabled: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  darkMode: boolean
  language: 'zh-CN' | 'en'
}

export const userSettings: UserSettings = {
  notificationEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: false,
  language: 'zh-CN'
}
