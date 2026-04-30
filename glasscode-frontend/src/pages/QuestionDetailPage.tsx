import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { LiquidCard, LiquidButton } from '../components/ui'
import { api, Question } from '../services/api'

const difficultyLabels: Record<string, { label: string; class: string }> = {
  easy: { label: '简单', class: 'bg-green-100 text-green-700' },
  medium: { label: '中等', class: 'bg-amber-100 text-amber-700' },
  hard: { label: '困难', class: 'bg-red-100 text-red-700' },
}

const tabs = [
  { id: 'text', label: '📝 纯文字讲解', icon: '📝' },
  { id: 'video', label: '🎬 视频讲解', icon: '🎬' },
]

export function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'video'>('text')
  const [showAnswer, setShowAnswer] = useState(false)

  const isFetchingRef = useRef(false)
  const fetchedQuestionIdRef = useRef<string | null>(null)

  const fetchQuestion = useCallback(async () => {
    if (!id) return
    if (isFetchingRef.current) return
    if (fetchedQuestionIdRef.current === id) return

    isFetchingRef.current = true
    fetchedQuestionIdRef.current = id

    setLoading(true)
    setError(null)
    setShowAnswer(false)

    try {
      const response = await api.getQuestion(id)
      if (response.success) {
        setQuestion(response.data)
      } else {
        setError('题目不存在')
      }
    } catch (err) {
      setError('获取题目详情失败')
      console.error('获取题目失败:', err)
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [id])

  useEffect(() => {
    if (fetchedQuestionIdRef.current !== id) {
      fetchQuestion()
    }
  }, [id, fetchQuestion])

  const handleGoBack = () => {
    if (question?.category?.slug) {
      navigate(`/category/${question.category.slug}`, { state: { categoryId: question.category.id } })
    } else {
      navigate('/questions')
    }
  }

  const handleNextQuestion = () => {
    setShowAnswer(false)
  }

  const handlePrevQuestion = () => {
    setShowAnswer(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">加载题目中...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-600 text-lg mb-2">{error || '题目不存在'}</p>
          <p className="text-gray-500 text-sm mb-6">可能题目已被删除或链接错误</p>
          <LiquidButton onClick={handleGoBack}>
            返回题库
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </motion.div>

      <main className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
            <button 
              onClick={handleGoBack}
              className="hover:text-primary-600 transition-colors"
            >
              {question.category?.name || '题库'}
            </button>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">
              {question.title?.slice(0, 20)}...
            </span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <span className="text-lg">←</span>
              <span>返回列表</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <LiquidButton variant="secondary" size="sm" onClick={handlePrevQuestion}>
                上一题
              </LiquidButton>
              <LiquidButton variant="primary" size="sm" onClick={handleNextQuestion}>
                下一题
              </LiquidButton>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <LiquidCard hoverable={false}>
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {question.category && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 border border-primary-200">
                    <span>{question.category.icon}</span>
                    {question.category.name}
                  </span>
                )}
                
                <span className={`
                  text-sm font-medium px-3 py-1.5 rounded-full border
                  ${difficultyLabels[question.difficulty]?.class || 'bg-gray-100 text-gray-700'}
                `}>
                  {difficultyLabels[question.difficulty]?.label || question.difficulty}
                </span>

                {question.frequency >= 4 && (
                  <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                    🔴 高频考点
                  </span>
                )}

                <div className="flex items-center gap-1 text-sm text-gray-500 ml-auto">
                  <span>⭐</span>
                  <span className="font-medium">
                    出现频率: {'★'.repeat(question.frequency)}{'☆'.repeat(5 - question.frequency)}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-tight">
                {question.title}
              </h1>

              {question.content && (
                <div className="mb-8 p-6 rounded-xl bg-white/50 border border-white/60">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                    📋 题目内容
                  </h3>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {question.content}
                  </div>
                </div>
              )}

              {question.tags && question.tags !== '[]' && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-gray-500">相关标签：</span>
                  {JSON.parse(question.tags).map((tag: string, index: number) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              )}

              {!showAnswer ? (
                <motion.div
                  className="text-center py-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-5xl mb-4">💭</div>
                  <p className="text-gray-600 mb-6 text-lg">
                    先思考一下这道题的答案？
                  </p>
                  <LiquidButton 
                    size="lg"
                    onClick={() => setShowAnswer(true)}
                  >
                    <span>👀</span> 查看答案详解
                  </LiquidButton>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span>📖</span> 答案详解
                    </h3>
                    <div className="flex items-center gap-1 bg-white/50 rounded-xl p-1 backdrop-blur-xl border border-white/60">
                      {tabs.map((tab) => (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab(tab.id as 'text' | 'video')}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeTab === tab.id
                              ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/30'
                              : 'text-gray-600 hover:bg-white/60'
                            }
                          `}
                        >
                          {tab.icon} {tab.label.split(' ')[1]}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'text' ? (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <LiquidCard hoverable={false}>
                          <div className="p-8">
                            <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                              <span>✍️</span>
                              <span>纯文字详细解答</span>
                              <span className="mx-2">•</span>
                              <span>支持 Markdown 格式</span>
                            </div>

                            <div className="prose prose-lg max-w-none prose-primary">
                              <style>{`
                                .prose h1, .prose h2, .prose h3, .prose h4 {
                                  color: #1f2937;
                                  font-weight: 700;
                                  margin-top: 1.5em;
                                  margin-bottom: 0.75em;
                                }
                                .prose h2 {
                                  font-size: 1.4em;
                                  padding-bottom: 0.5em;
                                  border-bottom: 2px solid #e5e7eb;
                                }
                                .prose h3 {
                                  font-size: 1.2em;
                                }
                                .prose p {
                                  color: #374151;
                                  line-height: 1.8;
                                  margin-bottom: 1em;
                                }
                                .prose ul, .prose ol {
                                  padding-left: 1.5em;
                                  margin-bottom: 1em;
                                }
                                .prose li {
                                  color: #374151;
                                  margin-bottom: 0.5em;
                                  line-height: 1.7;
                                }
                                .prose code {
                                  background: rgba(59, 130, 246, 0.1);
                                  padding: 0.2em 0.4em;
                                  border-radius: 0.3em;
                                  font-size: 0.9em;
                                  color: #2563eb;
                                  font-weight: 500;
                                }
                                .prose pre {
                                  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                                  border-radius: 1rem;
                                  padding: 1.5rem;
                                  overflow-x: auto;
                                  margin-bottom: 1.5em;
                                  border: 1px solid rgba(255,255,255,0.1);
                                }
                                .prose pre code {
                                  background: transparent;
                                  color: #e2e8f0;
                                  padding: 0;
                                  font-size: 0.9em;
                                }
                                .prose blockquote {
                                  border-left: 4px solid #3b82f6;
                                  padding: 1em 1.5em;
                                  margin: 1.5em 0;
                                  background: linear-gradient(90deg, rgba(59,130,246,0.05) 0%, transparent 100%);
                                  border-radius: 0 0.75em 0.75em 0;
                                }
                                .prose blockquote p {
                                  color: #3b82f6;
                                  margin: 0;
                                  font-weight: 500;
                                }
                                .prose strong {
                                  color: #1f2937;
                                  font-weight: 600;
                                }
                                .prose hr {
                                  border: none;
                                  height: 1px;
                                  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
                                  margin: 2em 0;
                                }
                                .prose table {
                                  width: 100%;
                                  border-collapse: collapse;
                                  margin-bottom: 1.5em;
                                }
                                .prose th, .prose td {
                                  padding: 0.75em 1em;
                                  text-align: left;
                                  border: 1px solid #e5e7eb;
                                }
                                .prose th {
                                  background: #f9fafb;
                                  font-weight: 600;
                                  color: #1f2937;
                                }
                                .prose td {
                                  background: #ffffff;
                                  color: #4b5563;
                                }
                              `}</style>
                              <ReactMarkdown>
                                {question.answer}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </LiquidCard>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="video"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <LiquidCard hoverable={false}>
                          <div className="p-8 text-center">
                            <div className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 mb-6">
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.div
                                  className="text-8xl mb-4"
                                  animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.7, 1, 0.7]
                                  }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity 
                                  }}
                                >
                                  🎬
                                </motion.div>
                                <p className="text-gray-300 text-lg mb-2">视频讲解正在制作中...</p>
                                <p className="text-gray-500 text-sm">
                                  该功能即将上线，敬请期待！
                                </p>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/40 backdrop-blur-xl flex items-center px-4">
                                <div className="flex items-center gap-3 flex-1">
                                  <button className="text-white/80 hover:text-white transition-colors text-lg">
                                    ▶
                                  </button>
                                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500/50 rounded-full w-0" />
                                  </div>
                                  <span className="text-white/60 text-sm">00:00</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button className="text-white/80 hover:text-white transition-colors">
                                    🔊
                                  </button>
                                  <button className="text-white/80 hover:text-white transition-colors">
                                    ⛶
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-center gap-4">
                              <LiquidButton variant="secondary">
                                <span>🔔</span> 上线时通知我
                              </LiquidButton>
                              <LiquidButton variant="ghost">
                                <span>💬</span> 提交需求
                              </LiquidButton>
                            </div>
                          </div>
                        </LiquidCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {showAnswer && (
                <motion.div
                  className="mt-8 flex items-center justify-center gap-4 flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <LiquidButton variant="secondary" size="sm">
                    <span>📚</span> 添加到复习
                  </LiquidButton>
                  <LiquidButton variant="secondary" size="sm">
                    <span>📤</span> 分享题目
                  </LiquidButton>
                  <LiquidButton variant="ghost" size="sm">
                    <span>⚠️</span> 报错纠错
                  </LiquidButton>
                </motion.div>
              )}
            </div>
          </LiquidCard>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📚</span>
            同类题目推荐
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <LiquidCard hoverable className="cursor-pointer">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                        简单
                      </span>
                      <span className="text-xs text-gray-500">⭐⭐⭐⭐</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors">
                      JavaScript 中 `var` 和 `let`、`const` 的区别是什么？
                    </h4>
                  </div>
                  <span className="text-xl">➜</span>
                </div>
              </div>
            </LiquidCard>

            <LiquidCard hoverable className="cursor-pointer">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        中等
                      </span>
                      <span className="text-xs text-gray-500">⭐⭐⭐⭐⭐</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors">
                      什么是闭包？闭包有哪些应用场景？
                    </h4>
                  </div>
                  <span className="text-xl">➜</span>
                </div>
              </div>
            </LiquidCard>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
