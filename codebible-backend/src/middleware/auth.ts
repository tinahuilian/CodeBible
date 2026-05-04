import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'codebible-secret-key-2026'

export interface AuthRequest extends Request {
  user?: {
    id: string
    username: string
    email: string
    role: string
  }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未登录或登录已过期'
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      username: string
      email: string
      role: string
    }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '登录已过期，请重新登录'
    })
  }
}

export const generateToken = (user: {
  id: string
  username: string
  email: string
  role: string
}) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export { JWT_SECRET }
