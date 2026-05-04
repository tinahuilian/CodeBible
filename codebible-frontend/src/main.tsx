import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout'
import { HomePage, QuestionsPage, QuestionDetailPage, LoginPage, RegisterPage } from './pages'
import { useAuthStore } from './store'
import { setAuthToken } from './services/api'
import './index.css'

function AuthInitializer() {
  const { token } = useAuthStore()
  
  useEffect(() => {
    if (token) {
      setAuthToken(token)
    }
  }, [token])
  
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthInitializer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/category/:slug" element={<QuestionsPage />} />
          <Route path="/question/:id" element={<QuestionDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
