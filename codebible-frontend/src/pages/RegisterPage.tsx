import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LiquidCard, LiquidButton } from './../components/ui'
import { api, setAuthToken } from './../services/api'
import { useAuthStore } from './../store'

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

interface PasswordStrength {
  level: number
  label: string
  color: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [socialLoginMessage, setSocialLoginMessage] = useState<string | null>(null)

  const { login } = useAuthStore()

  const getPasswordStrength = useCallback((): PasswordStrength => {
    const password = formData.password
    let level = 0
    
    if (password.length >= 6) level++
    if (password.length >= 10) level++
    if (/[A-Z]/.test(password)) level++
    if (/[0-9]/.test(password)) level++
    if (/[^a-zA-Z0-9]/.test(password)) level++

    if (level <= 2) return { level: 1, label: '弱', color: 'bg-red-400' }
    if (level <= 3) return { level: 2, label: '中', color: 'bg-yellow-400' }
    return { level: 3, label: '强', color: 'bg-green-400' }
  }, [formData.password])

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空'
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名长度至少为 3 个字符'
    } else if (formData.username.length > 20) {
      newErrors.username = '用户名长度不能超过 20 个字符'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线'
    }

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '请输入有效的邮箱地址'
      }
    }

    if (!formData.password) {
      newErrors.password = '密码不能为空'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少为 6 个字符'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await api.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nickname: formData.username
      })

      if (response.success) {
        setAuthToken(response.data.token)
        login(response.data.user, response.data.token)
        navigate('/', { replace: true })
      } else {
        setApiError(response.message || '注册失败')
      }
    } catch (error) {
      setApiError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
    if (apiError) {
      setApiError(null)
    }
  }

  const handleSocialLogin = (provider: string) => {
    setSocialLoginMessage(`${provider} 注册功能开发中，敬请期待！`)
    setTimeout(() => {
      setSocialLoginMessage(null)
    }, 3000)
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <LiquidCard hoverable={false} className="p-8">
          <div className="text-center mb-8">
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/30">
                C
              </div>
            </motion.div>
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              创建账户
            </motion.h1>
            <motion.p
              className="text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              加入码经，开启你的学习之旅
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {apiError && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-red-50/80 backdrop-blur border border-red-200/50"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {apiError}
                </p>
              </motion.div>
            )}
            {socialLoginMessage && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-blue-50/80 backdrop-blur border border-blue-200/50"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-blue-600 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {socialLoginMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  placeholder="3-20 个字符，字母、数字、下划线"
                  className={`
                    w-full pl-12 pr-4 py-4 rounded-xl
                    bg-white/30 backdrop-blur
                    border-2
                    placeholder:text-gray-400
                    focus:outline-none
                    ${errors.username
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-white/40 focus:border-primary-400'
                    }
                  `}
                />
              </div>
              {errors.username && (
                <motion.p
                  className="mt-2 text-sm text-red-500 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.username}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="请输入邮箱地址"
                  className={`
                    w-full pl-12 pr-4 py-4 rounded-xl
                    bg-white/30 backdrop-blur
                    border-2
                    placeholder:text-gray-400
                    focus:outline-none
                    ${errors.email
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-white/40 focus:border-primary-400'
                    }
                  `}
                />
              </div>
              {errors.email && (
                <motion.p
                  className="mt-2 text-sm text-red-500 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="至少 6 个字符"
                  className={`
                    w-full pl-12 pr-12 py-4 rounded-xl
                    bg-white/30 backdrop-blur
                    border-2
                    placeholder:text-gray-400
                    focus:outline-none
                    ${errors.password
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-white/40 focus:border-primary-400'
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.password && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                            passwordStrength.level >= level
                              ? passwordStrength.color
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ${
                      passwordStrength.level === 1 ? 'text-red-500' :
                      passwordStrength.level === 2 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      密码强度：{passwordStrength.label}
                    </span>
                  </div>
                </motion.div>
              )}
              {errors.password && (
                <motion.p
                  className="mt-2 text-sm text-red-500 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  placeholder="请再次输入密码"
                  className={`
                    w-full pl-12 pr-12 py-4 rounded-xl
                    bg-white/30 backdrop-blur
                    border-2
                    placeholder:text-gray-400
                    focus:outline-none
                    ${errors.confirmPassword
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-white/40 focus:border-primary-400'
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formData.confirmPassword === formData.password ? (
                    <p className="text-sm text-green-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      两次输入的密码一致
                    </p>
                  ) : (
                    <p className="text-sm text-orange-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      两次输入的密码不一致
                    </p>
                  )}
                </motion.div>
              )}
              {errors.confirmPassword && (
                <motion.p
                  className="mt-2 text-sm text-red-500 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <LiquidButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    注册中...
                  </span>
                ) : (
                  '创建账户'
                )}
              </LiquidButton>
            </motion.div>
          </form>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            <p className="text-gray-500">
              已有账户？{' '}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                立即登录
              </Link>
            </p>
          </motion.div>

          <motion.div
            className="mt-6 pt-6 border-t border-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">或者使用以下方式注册</p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur border border-white/50 flex items-center justify-center hover:bg-white/60 hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur border border-white/50 flex items-center justify-center hover:bg-white/60 hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('微信')}
                  className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur border border-white/50 flex items-center justify-center hover:bg-white/60 hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.008-.27-.022-.406-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </LiquidCard>

        <motion.p
          className="text-center text-sm text-gray-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          注册即表示你同意我们的
          <button className="text-primary-500 hover:text-primary-600 mx-1">服务条款</button>
          和
          <button className="text-primary-500 hover:text-primary-600 ml-1">隐私政策</button>
        </motion.p>
      </motion.div>
    </div>
  )
}
