const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string | null
  sortOrder: number
  _count?: {
    questions: number
  }
}

interface QuestionCategory {
  id: string
  name: string
  slug: string
  icon: string
}

interface Question {
  id: string
  categoryId: string
  title: string
  content: string | null
  answer: string
  difficulty: string
  frequency: number
  tags: string
  sortOrder: number
  category?: QuestionCategory
}

interface User {
  id: string
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  role: string
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

interface LoginData {
  user: User
  token: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
}

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }
  return headers
}

export const api = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${API_BASE_URL}/api/categories`)
    return response.json()
  },

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`)
    return response.json()
  },

  async getQuestions(params?: {
    categoryId?: string
    difficulty?: string
    page?: number
    pageSize?: number
  }): Promise<ApiResponse<PaginatedResponse<Question>>> {
    const searchParams = new URLSearchParams()
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId)
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    
    const queryString = searchParams.toString()
    const url = queryString 
      ? `${API_BASE_URL}/api/questions?${queryString}`
      : `${API_BASE_URL}/api/questions`
    
    const response = await fetch(url)
    return response.json()
  },

  async getQuestion(id: string): Promise<ApiResponse<Question>> {
    const response = await fetch(`${API_BASE_URL}/api/questions/${id}`)
    return response.json()
  },

  async getQuestionsByCategorySlug(
    slug: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<{
    category: Category
    items: Question[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    
    const queryString = searchParams.toString()
    const url = queryString 
      ? `${API_BASE_URL}/api/questions/category/${slug}?${queryString}`
      : `${API_BASE_URL}/api/questions/category/${slug}`
    
    const response = await fetch(url)
    return response.json()
  },

  async register(data: {
    username: string
    email: string
    password: string
    nickname?: string
  }): Promise<ApiResponse<LoginData>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  async login(data: {
    username: string
    password: string
  }): Promise<ApiResponse<LoginData>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  async updateProfile(data: {
    nickname?: string
    avatar?: string
  }): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return response.json()
  },

  async changePassword(data: {
    oldPassword: string
    newPassword: string
  }): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

export type { Category, Question, User, LoginData, ApiResponse, PaginatedResponse }
