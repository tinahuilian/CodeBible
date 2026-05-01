import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { LiquidButton } from './../ui'

export function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const navItems = [
    { path: '/', label: '首页', active: isHome },
    { path: '/questions', label: '题库', active: location.pathname.startsWith('/questions') || location.pathname.startsWith('/category') },
    { path: '/', label: '学习路径', active: false },
    { path: '/', label: '闪卡复习', active: false },
    { path: '/', label: '模拟面试', active: false },
  ]

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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <LiquidButton variant="secondary" size="sm">
                登录
              </LiquidButton>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <LiquidButton variant="primary" size="sm">
                免费开始
              </LiquidButton>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
