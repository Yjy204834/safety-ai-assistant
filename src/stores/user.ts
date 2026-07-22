import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  nickname: string
  avatar?: string
  role: 'admin' | 'employee'
  department?: string
  position?: string
  phone?: string
  email?: string
  joinDate?: string
}

interface LoginRecord {
  id: string
  userId: string
  loginTime: number
  ip?: string
  device?: string
}

const DEFAULT_USERS: Record<string, { password: string; user: User }> = {
  'admin': {
    password: 'admin123',
    user: {
      id: '1',
      nickname: '管理员',
      role: 'admin',
      department: '安全管理部',
      position: '系统管理员',
      phone: '138****0001',
      email: 'admin@safety-ai.com',
      joinDate: '2024-01-01'
    }
  },
  'user': {
    password: 'user123',
    user: {
      id: '2',
      nickname: '员工',
      role: 'employee',
      department: '生产部',
      position: '操作员',
      phone: '138****0002',
      email: 'user@safety-ai.com',
      joinDate: '2024-03-15'
    }
  },
  'test': {
    password: 'test123',
    user: {
      id: '3',
      nickname: '测试员',
      role: 'employee',
      department: '测试部',
      position: '测试工程师',
      phone: '138****0003',
      email: 'test@safety-ai.com',
      joinDate: '2024-06-01'
    }
  },
  'demo': {
    password: 'demo123',
    user: {
      id: '4',
      nickname: '演示账户',
      role: 'employee',
      department: '演示部门',
      position: '演示员',
      joinDate: '2024-09-01'
    }
  }
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loginRecords = ref<LoginRecord[]>([])
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() => user.value?.nickname || '未登录')
  const initials = computed(() => {
    if (!user.value?.nickname) return '?'
    return user.value.nickname.charAt(0)
  })

  const login = (userData: User): boolean => {
    user.value = userData
    recordLogin(userData.id)
    return true
  }

  const loginWithCredentials = (username: string, password: string): { success: boolean; message: string } => {
    const record = DEFAULT_USERS[username.toLowerCase()]
    if (!record) {
      return { success: false, message: '用户名不存在' }
    }
    if (record.password !== password) {
      return { success: false, message: '密码错误' }
    }
    login(record.user)
    return { success: true, message: '登录成功' }
  }

  const logout = () => {
    user.value = null
    uni.reLaunch({ url: '/pages/login/index' })
  }

  const updateProfile = (updates: Partial<User>): boolean => {
    if (!user.value) return false
    user.value = { ...user.value, ...updates }
    return true
  }

  const toggleRole = () => {
    if (user.value) {
      user.value.role = user.value.role === 'admin' ? 'employee' : 'admin'
    }
  }

  const recordLogin = (userId: string) => {
    const record: LoginRecord = {
      id: 'lr-' + Date.now(),
      userId,
      loginTime: Date.now(),
      device: uni.getSystemInfoSync ? uni.getSystemInfoSync().platform : 'unknown'
    }
    loginRecords.value.unshift(record)
    if (loginRecords.value.length > 50) {
      loginRecords.value = loginRecords.value.slice(0, 50)
    }
  }

  const getDefaultCredentials = () => {
    return Object.entries(DEFAULT_USERS).map(([username, data]) => ({
      username,
      password: data.password,
      role: data.user.role,
      nickname: data.user.nickname
    }))
  }

  return {
    user,
    loginRecords,
    isAdmin,
    isLoggedIn,
    displayName,
    initials,
    login,
    loginWithCredentials,
    logout,
    updateProfile,
    toggleRole,
    getDefaultCredentials
  }
}, {
  persist: {
    storage: {
      getItem: (key: string) => uni.getStorageSync(key),
      setItem: (key: string, value: any) => uni.setStorageSync(key, value)
    }
  }
})
