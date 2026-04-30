import { motion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { LiquidCard, LiquidButton } from '../components/ui'
import { api, Category, Question } from '../services/api'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

const difficultyLabels: Record<string, { label: string; class: string }> = {
  easy: { label: '简单', class: 'bg-green-100 text-green-700' },
  medium: { label: '中等', class: 'bg-amber-100 text-amber-700' },
  hard: { label: '困难', class: 'bg-red-100 text-red-700' },
}

const categoryColors: Record<string, string> = {
  javascript: 'from-yellow-400 to-amber-500',
  vue: 'from-green-400 to-emerald-500',
  hot: 'from-rose-400 to-red-500',
}

export function QuestionsPage() {
  const navigate = useNavigate()
  const params = useParams<{ slug?: string }>()
  const location = useLocation()
  
  const [categories, setCategories] = useState<Category[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null)

  const isInitialFetchRef = useRef(false)
  const isFetchingCategoriesRef = useRef(false)
  const isFetchingQuestionsRef = useRef(false)
  const fetchedCategoriesRef = useRef(false)

  useEffect(() => {
    if (isInitialFetchRef.current) {
      return
    }
    isInitialFetchRef.current = true

    const fetchInitialData = async () => {
      if (fetchedCategoriesRef.current || isFetchingCategoriesRef.current) {
        return
      }
      isFetchingCategoriesRef.current = true

      let currentSelectedCategoryId: string | null = null

      try {
        const response = await api.getCategories()
        if (response.success) {
          setCategories(response.data)
          fetchedCategoriesRef.current = true

          if (params.slug) {
            const matchedCategory = response.data.find(c => c.slug === params.slug)
            if (matchedCategory) {
              currentSelectedCategoryId = matchedCategory.id
              setSelectedCategoryId(matchedCategory.id)
            }
          } else if (location.state?.categoryId) {
            currentSelectedCategoryId = location.state.categoryId
            setSelectedCategoryId(location.state.categoryId)
          }
        }
      } catch (err) {
        console.error('获取分类失败:', err)
      } finally {
        isFetchingCategoriesRef.current = false
      }

      fetchQuestionsByParams(currentSelectedCategoryId, 1, null)
    }

    fetchInitialData()
  }, [params.slug, location.state])

  const fetchQuestionsByParams = useCallback(async (
    categoryId: string | null,
    currentPage: number,
    difficulty: string | null
  ) => {
    if (isFetchingQuestionsRef.current) {
      return
    }
    isFetchingQuestionsRef.current = true

    setLoading(true)
    setError(null)

    try {
      const params: { categoryId?: string; pageSize: number; page: number; difficulty?: string } = { 
        pageSize: 10, 
        page: currentPage
      }
      
      if (categoryId) {
        params.categoryId = categoryId
      }
      
      if (difficulty) {
        params.difficulty = difficulty
      }
      
      const response = await api.getQuestions(params)
      if (response.success) {
        setQuestions(response.data.items)
        setTotalPages(response.data.totalPages)
      }
    } catch (err) {
      setError('获取题目数据失败')
      console.error('获取题目失败:', err)
    } finally {
      setLoading(false)
      isFetchingQuestionsRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!isInitialFetchRef.current) {
      return
    }

    fetchQuestionsByParams(selectedCategoryId, page, difficultyFilter)
  }, [selectedCategoryId, page, difficultyFilter, fetchQuestionsByParams])

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`)
  }

  const handleCategoryClick = (category: Category) => {
    const newCategoryId = selectedCategoryId === category.id ? null : category.id
    setSelectedCategoryId(newCategoryId)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedCategory = categories.find(c => c.id === selectedCategoryId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </motion.div>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-primary-600 transition-colors"
            >
              首页
            </button>
            <span>/</span>
            <span className="text-gray-800 font-medium">
              {selectedCategory ? selectedCategory.name : '全部题库'}
            </span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedCategory ? (
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">{selectedCategory.icon}</span>
                    {selectedCategory.name}
                  </span>
                ) : (
                  <span>📚 全部题库</span>
                )}
              </h1>
              <p className="text-gray-600">
                {selectedCategory?.description || '浏览所有前端面试题，按分类筛选学习'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索题目..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2.5 pl-10 rounded-xl bg-white/40 backdrop-blur-xl border border-white/50 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-gray-700">分类筛选：</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick({ id: '', name: '全部', icon: '📋', slug: 'all', sortOrder: 0, description: null, _count: { questions: 0 } })}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all
                ${selectedCategoryId === null
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white/40 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-white/60'
                }
              `}
            >
              📋 全部
            </motion.button>

            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category)}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
                  ${selectedCategoryId === category.id
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white/40 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-white/60'
                  }
                `}
              >
                <span>{category.icon}</span>
                {category.name}
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${selectedCategoryId === category.id
                    ? 'bg-white/20'
                    : 'bg-white/50'
                  }
                `}>
                  {category._count?.questions || 0}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-700">难度：</span>
            {[
              { value: null, label: '全部' },
              { value: 'easy', label: '简单' },
              { value: 'medium', label: '中等' },
              { value: 'hard', label: '困难' },
            ].map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setDifficultyFilter(item.value); setPage(1) }}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${difficultyFilter === item.value
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-white/30 text-gray-600 hover:bg-white/50 border border-transparent'
                  }
                `}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">加载题目中...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-gray-600 text-lg mb-4">{error}</p>
            <LiquidButton onClick={() => fetchQuestionsByParams(selectedCategoryId, page, difficultyFilter)}>
              重新加载
            </LiquidButton>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg mb-2">暂无题目数据</p>
            <p className="text-gray-500 text-sm">尝试切换其他分类或难度</p>
          </div>
        ) : (
          <>
            <motion.div
              className="space-y-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
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
                            {question.category && (
                              <span 
                                className={`
                                  text-xs font-medium px-2 py-1 rounded-full
                                  bg-gradient-to-r ${categoryColors[question.category.slug] || 'from-gray-400 to-gray-500'} 
                                  text-white
                                `}
                              >
                                {question.category.icon} {question.category.name}
                              </span>
                            )}
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
                            <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                              <span>⭐</span>
                              <span>
                                {'★'.repeat(question.frequency)}
                                {'☆'.repeat(5 - question.frequency)}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary-600 cursor-pointer transition-colors group">
                            {question.title}
                            <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                          </h3>

                          {question.content && (
                            <p className="text-sm text-gray-500 mb-3">
                              {question.content.slice(0, 120)}...
                            </p>
                          )}

                          {question.tags && question.tags !== '[]' && (
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {JSON.parse(question.tags).map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-600 border border-primary-100"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
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
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <LiquidButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  上一页
                </LiquidButton>

                <div className="flex items-center gap-2 px-4">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1
                    if (totalPages > 5) {
                      if (page > 3) {
                        pageNum = page - 2 + i
                      }
                      if (page > totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      }
                    }
                    
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(pageNum)}
                        className={`
                          w-10 h-10 rounded-xl font-medium transition-all
                          ${page === pageNum
                            ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/30'
                            : 'bg-white/40 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-white/60'
                          }
                        `}
                      >
                        {pageNum}
                      </motion.button>
                    )
                  })}
                  
                  {totalPages > 5 && page < totalPages - 2 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10 rounded-xl font-medium bg-white/40 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-white/60 transition-all"
                      >
                        {totalPages}
                      </motion.button>
                    </>
                  )}
                </div>

                <LiquidButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  下一页
                </LiquidButton>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
