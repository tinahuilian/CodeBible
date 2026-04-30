import { motion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LiquidCard, LiquidButton } from '../components/ui'
import { api, Category, Question } from '../services/api'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

const categoryColors: Record<string, string> = {
  javascript: 'from-yellow-400 to-amber-500',
  vue: 'from-green-400 to-emerald-500',
  hot: 'from-rose-400 to-red-500',
  css: 'from-blue-400 to-cyan-500',
  react: 'from-cyan-400 to-blue-500',
  network: 'from-purple-400 to-pink-500',
  performance: 'from-amber-400 to-orange-500',
  engineering: 'from-indigo-400 to-purple-500',
}

const difficultyLabels: Record<string, { label: string; class: string }> = {
  easy: { label: '简单', class: 'bg-green-100 text-green-700' },
  medium: { label: '中等', class: 'bg-amber-100 text-amber-700' },
  hard: { label: '困难', class: 'bg-red-100 text-red-700' },
}

export function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isInitialFetchRef = useRef(false)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    if (isInitialFetchRef.current) {
      return
    }
    isInitialFetchRef.current = true

    const fetchInitialData = async () => {
      if (isFetchingRef.current) {
        return
      }
      isFetchingRef.current = true

      setLoading(true)
      setError(null)

      try {
        const [categoriesResponse, questionsResponse] = await Promise.all([
          api.getCategories(),
          api.getQuestions({ pageSize: 10 })
        ])

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data)
        }

        if (questionsResponse.success) {
          setQuestions(questionsResponse.data.items)
        }
      } catch (err) {
        setError('获取数据失败')
        console.error('获取数据失败:', err)
      } finally {
        setLoading(false)
        isFetchingRef.current = false
      }
    }

    fetchInitialData()
  }, [])

  const fetchQuestions = useCallback(async (categoryId?: string) => {
    if (isFetchingRef.current) {
      return
    }
    isFetchingRef.current = true

    try {
      const params: { categoryId?: string; pageSize: number } = { pageSize: 10 }
      if (categoryId) {
        params.categoryId = categoryId
      }

      const response = await api.getQuestions(params)
      if (response.success) {
        setQuestions(response.data.items)
      }
    } catch (err) {
      setError('获取题目数据失败')
      console.error('获取题目失败:', err)
    } finally {
      isFetchingRef.current = false
    }
  }, [])

  const handleCategoryClick = async (category: Category) => {
    const newCategoryId = selectedCategory === category.id ? null : category.id
    setSelectedCategory(newCategoryId)
    await fetchQuestions(newCategoryId || undefined)
  }

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`)
  }

  const handleGoToCategory = (categoryId: string, categorySlug: string) => {
    navigate(`/category/${categorySlug}`, { state: { categoryId } })
  }

  const features = [
    {
      icon: '💎',
      title: '沉浸式毛玻璃UI',
      description: '通透的毛玻璃效果，柔和的光影层次，优雅的视觉体验',
    },
    {
      icon: '🧠',
      title: '认知科学记忆系统',
      description: '基于SM-2间隔重复算法，让知识真正进入长期记忆',
    },
    {
      icon: '🎬',
      title: '多模态学习矩阵',
      description: '文字详解 + 音视频讲解 + 代码演示 + 知识图谱',
    },
    {
      icon: '🎯',
      title: '个性化学习路径',
      description: '智能分析薄弱环节，提供定制化学习计划',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">加载中...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-600 text-lg mb-4">{error}</p>
          <LiquidButton onClick={() => window.location.reload()}>
            重新加载
          </LiquidButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </motion.div>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg">✨</span>
            <span className="text-sm font-medium text-primary-600">2026年前端面试最新题库</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-800 via-primary-600 to-purple-600 bg-clip-text text-transparent">
              从"背八股"到"通原理"
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            你的代码宝典，让面试不再是「背经」。
            <br className="hidden md:block" />
            基于认知科学的记忆系统，让知识真正进入长期记忆。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <LiquidButton size="lg">
              <span>🎯</span> 开始学习
            </LiquidButton>
            <LiquidButton variant="secondary" size="lg" onClick={() => navigate('/questions')}>
              <span>📺</span> 浏览题库
            </LiquidButton>
          </div>

          <motion.div
            className="flex items-center justify-center gap-8 mt-10 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span>{questions.length}+ 高频面试题</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📂</span>
              <span>{categories.length} 大分类</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <span>智能记忆系统</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="mr-2">📂</span>
              题库分类
            </h2>
            <button 
              onClick={() => navigate('/questions')}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              查看全部
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoToCategory(category.id, category.slug)}
                className={`
                  relative overflow-hidden rounded-2xl cursor-pointer
                  backdrop-blur-xl border transition-all duration-300
                  ${selectedCategory === category.id
                    ? 'bg-white/60 border-primary-300 shadow-lg shadow-primary-500/20'
                    : 'bg-white/30 border-white/50 hover:bg-white/50 hover:shadow-lg'
                  }
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category.slug] || 'from-gray-400 to-gray-500'} opacity-10`} />
                
                <div className="relative p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    <span className={`
                      text-xs font-medium px-2 py-1 rounded-full
                      ${selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-white/50 text-gray-600'
                      }
                    `}>
                      {category._count?.questions || 0} 题
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.description?.slice(0, 20)}...
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="mr-2">🔥</span>
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name || '高频面试题'
                : '高频面试题'
              }
            </h2>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="搜索面试题..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white/40 backdrop-blur-xl border border-white/50 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>

              <LiquidButton variant="secondary" size="sm">
                筛选
              </LiquidButton>
            </div>
          </div>

          {questions.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">暂无题目数据</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <motion.div
                  key={question.id}
                  variants={itemVariants}
                  onClick={() => handleQuestionClick(question.id)}
                >
                  <LiquidCard hoverable>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                              {question.category?.name || '其他'}
                            </span>
                            <span className={`
                              text-xs font-medium px-2 py-1 rounded-full
                              ${difficultyLabels[question.difficulty]?.class || 'bg-gray-100 text-gray-700'}
                            `}>
                              {difficultyLabels[question.difficulty]?.label || question.difficulty}
                            </span>
                            {question.frequency >= 4 && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-100 text-rose-700">
                                🔴 高频考点
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary-600 cursor-pointer transition-colors">
                            {question.title}
                          </h3>

                          {question.content && (
                            <p className="text-sm text-gray-500 mb-3">
                              {question.content.slice(0, 100)}...
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <span>⭐</span>
                              <span>出现频率: {'★'.repeat(question.frequency)}{'☆'.repeat(5 - question.frequency)}</span>
                            </div>
                            {question.tags && question.tags !== '[]' && (
                              <div className="flex items-center gap-1">
                                <span>🏷️</span>
                                <span>
                                  {JSON.parse(question.tags).slice(0, 2).join('、')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <LiquidButton variant="primary" size="sm">
                            开始学习
                          </LiquidButton>
                          <LiquidButton variant="ghost" size="sm">
                            添加复习
                          </LiquidButton>
                        </div>
                      </div>
                    </div>
                  </LiquidCard>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <LiquidButton variant="secondary" onClick={() => navigate('/questions')}>
              加载更多题目
              <span className="ml-2">↓</span>
            </LiquidButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              <span className="mr-2">✨</span>
              为什么选择 码经？
            </h2>
            <p className="text-gray-600">重新定义前端面试学习体验</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <LiquidCard>
                  <div className="p-6 text-center">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </LiquidCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <LiquidCard hoverable={false}>
            <div className="p-10 text-center">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                准备好开始你的前端面试之旅了吗？
              </h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                加入数万位开发者，用科学的方法掌握前端面试知识点，
                从"背八股"到真正理解原理。
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <LiquidButton size="lg">
                  <span>🎉</span> 免费开始学习
                </LiquidButton>
                <LiquidButton variant="secondary" size="lg">
                  <span>📊</span> 了解更多
                </LiquidButton>
              </div>
            </div>
          </LiquidCard>
        </motion.div>
      </main>
    </div>
  )
}
