import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LiquidButton } from './../ui'
import { useAuthStore } from './../../store'
import { setAuthToken } from './../../services/api'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const { isAuthenticated, user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navItems = [
    { path: '/', label: '首页', active: isHome },
    { path: '/questions', label: '题库', active: location.pathname.startsWith('/questions') || location.pathname.startsWith('/category') },
    { path: '/', label: '学习路径', active: false },
    { path: '/', label: '闪卡复习', active: false },
    { path: '/', label: '模拟面试', active: false },
  ]

  const handleLogout = () => {
    logout()
    setAuthToken(null)
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <motion.nav
      className="sticky top-0 z-50 backdrop-blur-2xl bg-white/20 border-b border-white/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30">
                C
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  码经
                </h1>
                <p className="text-xs text-gray-500">你的代码宝典</p>
              </div>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  transition-colors font-medium relative
                  ${item.active 
                    ? 'text-primary-600' 
                    : 'text-gray-600 hover:text-primary-600'
                  }
                `}
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {item.label}
                </motion.span>
                {item.active && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                    layoutId="activeNav"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {!isAuthenticated ? (
                <motion.div
                  key="guest"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link to="/login">
                      <LiquidButton variant="secondary" size="sm">
                        登录
                      </LiquidButton>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link to="/register">
                      <LiquidButton variant="primary" size="sm">
                        免费开始
                      </LiquidButton>
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="authenticated"
                  className="relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-all duration-300"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
                      {user?.nickname?.[0] || user?.username?.[0] || 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700">
                        {user?.nickname || user?.username}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-56"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl py-2 overflow-hidden">
                          <div className="px-4 py-3 border-b border-white/40">
                            <p className="text-sm font-medium text-gray-700">
                              {user?.nickname || user?.username}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          </div>

                          <button
                            className="w-full px-4 py-3 text-left text-sm text-gray-600 hover:bg-primary-50/50 flex items-center gap-3 transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            个人中心
                          </button>

                          <button
                            className="w-full px-4 py-3 text-left text-sm text-gray-600 hover:bg-primary-50/50 flex items-center gap-3 transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            我的收藏
                          </button>

                          <button
                            className="w-full px-4 py-3 text-left text-sm text-gray-600 hover:bg-primary-50/50 flex items-center gap-3 transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            设置
                          </button>

                          <div className="border-t border-white/40 my-1" />

                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50/50 flex items-center gap-3 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            退出登录
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
