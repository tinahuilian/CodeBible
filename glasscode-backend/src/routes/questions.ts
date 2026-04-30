import { Router } from 'express'
import prisma from '../prisma'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { categoryId, difficulty, page = '1', pageSize = '10' } = req.query
    
    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum
    
    const where: any = {}
    
    if (categoryId) {
      where.categoryId = categoryId as string
    }
    
    if (difficulty) {
      where.difficulty = difficulty as string
    }
    
    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip,
        take: pageSizeNum,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true
            }
          }
        }
      })
    ])
    
    res.json({
      success: true,
      data: {
        items: questions,
        total,
        page: pageNum,
        pageSize: pageSizeNum,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    })
  } catch (error) {
    console.error('获取题目列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取题目列表失败'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    })
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: '题目不存在'
      })
    }
    
    res.json({
      success: true,
      data: question
    })
  } catch (error) {
    console.error('获取题目详情失败:', error)
    res.status(500).json({
      success: false,
      message: '获取题目详情失败'
    })
  }
})

router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params
    const { page = '1', pageSize = '10' } = req.query
    
    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum
    
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      })
    }
    
    const [total, questions] = await Promise.all([
      prisma.question.count({
        where: { categoryId: category.id }
      }),
      prisma.question.findMany({
        where: { categoryId: category.id },
        orderBy: { sortOrder: 'asc' },
        skip,
        take: pageSizeNum,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true
            }
          }
        }
      })
    ])
    
    res.json({
      success: true,
      data: {
        category,
        items: questions,
        total,
        page: pageNum,
        pageSize: pageSizeNum,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    })
  } catch (error) {
    console.error('获取分类题目失败:', error)
    res.status(500).json({
      success: false,
      message: '获取分类题目失败'
    })
  }
})

export default router
