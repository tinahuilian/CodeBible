import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prisma'
import { authMiddleware, generateToken, AuthRequest } from '../middleware/auth'

const router = Router()
const SALT_ROUNDS = 10

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, nickname } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码不能为空'
      })
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: '用户名长度应在 3-20 个字符之间'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为 6 个字符'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          message: '用户名已被注册'
        })
      }
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: '邮箱已被注册'
        })
      }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        nickname: nickname || username
      }
    })

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })

    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })

    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    })
  }
})

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    })
  }
})

router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { nickname, avatar } = req.body
    const userId = req.user?.id

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nickname !== undefined && { nickname }),
        ...(avatar !== undefined && { avatar })
      }
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    res.json({
      success: true,
      message: '资料更新成功',
      data: userWithoutPassword
    })
  } catch (error) {
    console.error('更新用户资料失败:', error)
    res.status(500).json({
      success: false,
      message: '更新资料失败'
    })
  }
})

router.put('/password', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const userId = req.user?.id

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '旧密码和新密码不能为空'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码长度至少为 6 个字符'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password)

    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '旧密码错误'
      })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    })

    res.json({
      success: true,
      message: '密码修改成功'
    })
  } catch (error) {
    console.error('修改密码失败:', error)
    res.status(500).json({
      success: false,
      message: '修改密码失败'
    })
  }
})

export default router
