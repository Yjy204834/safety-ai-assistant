# 安全AI助手 - 企业安全生产管理平台

基于 uni-app 框架开发的跨平台企业安全生产管理应用，支持 H5、微信小程序、App 等多端运行。

## 项目特性

- 🎯 **跨平台支持**：一套代码，多端运行
- 🎨 **精美UI**：现代化的设计风格
- 🔒 **安全可靠**：企业级安全标准
- 🤖 **AI助手**：智能问答功能
- 📊 **安全监测**：实时监测设备状态
- 📚 **培训系统**：安全培训与考试

## 技术栈

- **框架**：uni-app (Vue 3)
- **语言**：TypeScript
- **状态管理**：Pinia
- **样式**：SCSS
- **构建工具**：Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

#### H5 开发

```bash
npm run dev
```

#### 微信小程序开发

```bash
npm run dev:mp-weixin
```

然后在微信开发者工具中打开 `dist/dev/mp-weixin` 目录。

### 构建

#### H5 构建

```bash
npm run build
```

#### 微信小程序构建

```bash
npm run build:mp-weixin
```

## 项目结构

```
.
├── src/
│   ├── components/       # 公共组件
│   │   ├── AppLayout.vue
│   │   ├── CustomNavbar.vue
│   │   └── CustomTabBar.vue
│   ├── pages/            # 页面
│   │   ├── ai-qa/        # AI问答
│   │   ├── monitor/      # 安全监测
│   │   ├── training/     # 安全培训
│   │   ├── news/         # 集团动态
│   │   ├── profile/      # 个人中心
│   │   ├── login/        # 登录
│   │   └── register/     # 注册
│   ├── stores/           # Pinia 状态管理
│   ├── utils/            # 工具函数
│   ├── styles/           # 样式文件
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json     # uni-app 配置
│   └── pages.json        # 页面路由配置
├── android/              # Android 原生代码
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 主要功能

### 1. AI智能助手
- 智能问答
- 图片识别
- 文档分析
- 历史记录

### 2. 安全监测
- 设备状态监控
- 告警信息
- 电解槽参数
- 采购统计

### 3. 安全培训
- 理论学习
- 视频课程
- 心理测试
- 安全考试

### 4. 个人中心
- 通知中心
- 学习记录
- 薪资查询
- 设置

## 小程序配置

### 微信小程序

1. 在 `manifest.json` 中配置你的 AppID
2. 构建小程序版本 `npm run build:mp-weixin`
3. 在微信开发者工具中导入项目
4. 配置服务器域名（如需要）

### 配置 AppID

编辑 `src/manifest.json`：

```json
{
  "mp-weixin": {
    "appid": "你的微信小程序AppID"
  }
}
```

## 开发指南

### 组件转换说明

从 Web 项目转换为小程序时的主要改动：

1. **HTML标签** → **uni-app 组件**
   - `<div>` → `<view>`
   - `<span>` → `<text>`
   - `<img>` → `<image>`
   - `<input>` 保持不变

2. **路由跳转**
   - `useRouter()` → `uni.navigateTo()`
   - `router.push()` → `uni.navigateTo()`
   - `router.back()` → `uni.navigateBack()`

3. **API 调用**
   - `localStorage` → `uni.getStorageSync()` / `uni.setStorageSync()`
   - `fetch/axios` → `uni.request()`

4. **样式**
   - `px` → `rpx`（推荐使用）
   - 移除部分不兼容的 CSS 属性

### 新增页面

1. 在 `src/pages/` 下创建页面目录和文件
2. 在 `src/pages.json` 中注册页面路由

## 部署

### 微信小程序

1. 完成开发和测试
2. 执行 `npm run build:mp-weixin`
3. 在微信开发者工具中预览和上传代码
4. 提交审核和发布

### H5

1. 执行 `npm run build`
2. 将 `dist/build/h5` 目录部署到 Web 服务器

## 常见问题

### Q: 如何切换管理员/员工角色？
A: 在个人中心页面，可以通过切换角色功能来切换不同的权限视图。

### Q: 小程序支持哪些功能？
A: 目前支持除文件上传外的所有核心功能，文件上传在小程序版本中会做适配。

### Q: 数据如何存储？
A: 使用 Pinia + pinia-plugin-persistedstate，数据会自动持久化到本地存储。

## 更新日志

### v2.0.0
- ✨ 适配 uni-app 框架
- ✨ 支持微信小程序
- ✨ 优化 UI/UX 设计
- 🎨 统一视觉风格

## License

MIT
