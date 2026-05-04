import express from 'express'
import cors from 'cors'
import categoriesRouter from './routes/categories'
import questionsRouter from './routes/questions'
import authRouter from './routes/auth'
import prisma from './prisma'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '码经 CodeBible API 服务运行正常',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/categories', categoriesRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/auth', authRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  })
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  })
})

async function startServer() {
  try {
    await prisma.$connect()
    console.log('📦 数据库连接成功')
    
    app.listen(PORT, () => {
      console.log(`🚀 码经 CodeBible API 服务已启动`)
      console.log(`📍 服务地址: http://localhost:${PORT}`)
      console.log(`📚 API 文档: http://localhost:${PORT}/api/health`)
      console.log('────────────────────────────────────────')
      console.log('可用接口:')
      console.log('  GET /api/health              - 健康检查')
      console.log('  GET /api/categories          - 获取分类列表')
      console.log('  GET /api/questions           - 获取题目列表')
      console.log('  GET /api/questions/:id       - 获取题目详情')
      console.log('  POST /api/auth/register      - 用户注册')
      console.log('  POST /api/auth/login         - 用户登录')
      console.log('  GET /api/auth/me             - 获取当前用户信息')
      console.log('  PUT /api/auth/profile        - 更新用户资料')
      console.log('  PUT /api/auth/password       - 修改密码')
      console.log('────────────────────────────────────────')
    })
  } catch (error) {
    console.error('启动服务器失败:', error)
    process.exit(1)
  }
}

startServer()

process.on('SIGTERM', async () => {
  console.log('关闭服务器...')
  await prisma.$disconnect()
  process.exit(0)
})
