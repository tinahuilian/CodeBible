import { Router } from 'express'
import prisma from '../prisma'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })
    
    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('获取分类失败:', error)
    res.status(500).json({
      success: false,
      message: '获取分类失败'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const category = await prisma.category.findUnique({
      where: { id }
    })
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      })
    }
    
    res.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('获取分类详情失败:', error)
    res.status(500).json({
      success: false,
      message: '获取分类详情失败'
    })
  }
})

export default router
