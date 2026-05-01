<div align="center">
  <h1>📖 码经 CodeBible</h1>
  <p><strong>你的代码宝典，让面试不再是「背经」</strong></p>
  <p>
    <a href="#-项目简介">项目简介</a> •
    <a href="#-技术栈">技术栈</a> •
    <a href="#-快速开始">快速开始</a> •
    <a href="#-项目结构">项目结构</a> •
    <a href="#-api-文档">API 文档</a> •
    <a href="#-贡献指南">贡献指南</a>
  </p>
</div>

---

## 📋 项目简介

**码经 CodeBible** 是一个创新的前端高频面试题详解平台，采用通透毛玻璃（Glassmorphism）UI 设计风格，帮助开发者系统性地学习和记忆前端面试知识点。

### ✨ 核心特性

- 🎨 **通透毛玻璃 UI**：现代化的视觉设计，带来沉浸式学习体验
- 📝 **详细文字讲解**：每道题目都有高质量的 Markdown 格式答案
- 🎯 **分类学习**：JavaScript 核心、Vue 框架、高频面试题三大分类
- 🔍 **智能筛选**：支持按难度、分类筛选题目
- 📱 **响应式设计**：适配各种屏幕尺寸
- 🔄 **流畅动画**：使用 Framer Motion 实现丝滑的页面过渡

---

## 🛠 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^18.3.1 | 前端框架 |
| TypeScript | ~5.6.2 | 类型安全 |
| Vite | ^6.0.1 | 构建工具 |
| Tailwind CSS | ^3.4.0 | CSS 框架 |
| React Router | ^6.20.0 | 路由管理 |
| Framer Motion | ^11.0.0 | 动画库 |
| React Markdown | ^10.1.0 | Markdown 渲染 |
| Zustand | ^4.4.0 | 状态管理 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Express.js | ^5.2.1 | Web 框架 |
| TypeScript | ^6.0.3 | 类型安全 |
| Prisma | ^5.22.0 | ORM 框架 |
| SQLite | - | 数据库（文件型） |
| CORS | ^2.8.6 | 跨域支持 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. 克隆项目

```bash
git clone https://github.com/tinahuilian/CodeBible.git
cd CodeBible
```

### 2. 安装依赖

#### 后端依赖

```bash
cd codebible-backend
npm install
```

#### 前端依赖

```bash
cd ../codebible-frontend
npm install
```

### 3. 配置环境变量

在 `codebible-backend` 目录下创建 `.env` 文件：

```env
# 数据库连接（SQLite 文件路径）
DATABASE_URL="file:./dev.db"

# 服务端口（可选，默认 3001）
PORT=3001
```

### 4. 初始化数据库

```bash
cd codebible-backend

# 生成 Prisma Client
npm run prisma:generate

# 执行数据库迁移
npm run prisma:migrate

# 填充种子数据（包含 3 个分类，9 道题目）
npm run prisma:seed
```

### 5. 启动开发服务器

#### 启动后端服务

```bash
cd codebible-backend
npm run dev
```

后端服务将在 `http://localhost:3001` 启动

#### 启动前端服务（新终端）

```bash
cd codebible-frontend
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

### 6. 访问应用

打开浏览器访问：`http://localhost:5173`

---

## 📁 项目结构

```
CodeBible/
├── codebible-backend/           # 后端项目
│   ├── prisma/
│   │   ├── migrations/          # 数据库迁移文件
│   │   ├── schema.prisma        # 数据模型定义
│   │   └── seed.ts              # 种子数据
│   ├── src/
│   │   ├── routes/
│   │   │   ├── categories.ts    # 分类路由
│   │   │   └── questions.ts     # 题目路由
│   │   ├── prisma.ts            # Prisma 客户端
│   │   └── server.ts            # 服务器入口
│   ├── .env                     # 环境变量
│   ├── package.json
│   └── tsconfig.json
│
├── codebible-frontend/          # 前端项目
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # 布局组件
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── index.ts
│   │   │   └── ui/              # UI 组件
│   │   │       ├── LiquidButton.tsx
│   │   │       ├── LiquidCard.tsx
│   │   │       └── index.ts
│   │   ├── pages/               # 页面组件
│   │   │   ├── HomePage.tsx
│   │   │   ├── QuestionsPage.tsx
│   │   │   ├── QuestionDetailPage.tsx
│   │   │   └── index.ts
│   │   ├── services/            # API 服务
│   │   │   └── api.ts
│   │   ├── App.tsx              # 应用入口
│   │   ├── main.tsx             # 主入口
│   │   └── index.css            # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

---

## 📊 数据模型

### Category（分类）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | UUID 主键 |
| name | String | 分类名称 |
| slug | String | 唯一标识（URL 友好） |
| icon | String | 图标（Emoji） |
| description | String? | 分类描述 |
| sortOrder | Int | 排序序号 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Question（题目）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | UUID 主键 |
| categoryId | String | 外键，关联分类 |
| title | String | 题目标题 |
| content | String? | 题目描述 |
| answer | String | 答案（Markdown 格式） |
| difficulty | String | 难度：easy/medium/hard |
| frequency | Int | 出现频率（1-5） |
| tags | String | 标签（JSON 数组字符串） |
| sortOrder | Int | 排序序号 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

---

## 📚 API 文档

### 基础 URL

开发环境：`http://localhost:3001/api`

### 接口列表

#### 1. 健康检查

```
GET /health
```

**响应示例：**

```json
{
  "success": true,
  "message": "码经 CodeBible API 服务运行正常",
  "timestamp": "2026-04-30T12:00:00.000Z"
}
```

#### 2. 获取分类列表

```
GET /categories
```

**响应示例：**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-xxx",
      "name": "JavaScript核心",
      "slug": "javascript",
      "icon": "📜",
      "description": "JavaScript 核心知识点...",
      "sortOrder": 1,
      "_count": {
        "questions": 3
      }
    }
  ]
}
```

#### 3. 获取题目列表（分页）

```
GET /questions?page=1&pageSize=10&categoryId=xxx&difficulty=medium
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Number | 否 | 页码，默认 1 |
| pageSize | Number | 否 | 每页数量，默认 10 |
| categoryId | String | 否 | 分类 ID 筛选 |
| difficulty | String | 否 | 难度筛选：easy/medium/hard |

**响应示例：**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid-xxx",
        "title": "var、let、const 的核心区别是什么？",
        "difficulty": "easy",
        "frequency": 5,
        "category": {
          "id": "uuid-xxx",
          "name": "JavaScript核心",
          "icon": "📜"
        }
      }
    ],
    "total": 9,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

#### 4. 获取题目详情

```
GET /questions/:id
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "id": "uuid-xxx",
    "title": "var、let、const 的核心区别是什么？",
    "content": "这是一道非常基础但又非常重要的 JS 面试题...",
    "answer": "## var、let、const 的核心区别\n\n### 1. 作用域不同...",
    "difficulty": "easy",
    "frequency": 5,
    "tags": "[\"变量声明\",\"ES6\",\"作用域\"]",
    "category": {
      "id": "uuid-xxx",
      "name": "JavaScript核心",
      "icon": "📜"
    }
  }
}
```

#### 5. 按分类获取题目

```
GET /questions/category/:categorySlug?page=1&pageSize=10
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| categorySlug | String | 分类标识（如：javascript、vue、hot） |

---

## 🔧 常用命令

### 后端命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run prisma:generate` | 生成 Prisma Client |
| `npm run prisma:migrate` | 执行数据库迁移 |
| `npm run prisma:seed` | 填充种子数据 |
| `npm run prisma:studio` | 打开 Prisma Studio（数据库可视化） |

### 前端命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 代码检查 |

---

## 🤝 贡献指南

### 提交代码

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 提交规范

- `feat`：新功能
- `fix`：修复 bug
- `docs`：文档更新
- `style`：代码格式（不影响功能）
- `refactor`：重构
- `perf`：性能优化
- `test`：测试相关
- `chore`：构建/工具相关

### 添加新题目

1. 在 `codebible-backend/prisma/seed.ts` 中添加题目数据
2. 确保 `answer` 字段使用 Markdown 格式
3. 重新执行种子数据：`npm run prisma:seed`

---

## 📝 开发注意事项

### 关于重复请求

React StrictMode 开发环境下组件会挂载两次，导致 API 请求重复发送。项目中使用 `useRef` 机制来防止重复请求：

```typescript
const isFetchingRef = useRef(false)
const fetchedQuestionIdRef = useRef<string | null>(null)

const fetchQuestion = useCallback(async () => {
  if (isFetchingRef.current) return
  if (fetchedQuestionIdRef.current === id) return
  
  isFetchingRef.current = true
  fetchedQuestionIdRef.current = id
  
  // ... 请求逻辑
}, [id])
```

### 环境变量

- 后端 `.env` 文件不会被提交到 Git（已在 `.gitignore` 中）
- 数据库文件 `dev.db` 也不会被提交
- 新成员需要自行创建 `.env` 文件和初始化数据库

---

## 📄 许可证

本项目使用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

<div align="center">
  <p>Made with ❤️ by CodeBible Team</p>
  <p>
    <a href="https://github.com/tinahuilian/CodeBible">GitHub</a> •
    <a href="https://github.com/tinahuilian/CodeBible/issues">Issues</a>
  </p>
</div>
