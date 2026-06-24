import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  nickname: string
  avatar?: string
  role: 'admin' | 'employee'
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isLoggedIn = computed(() => !!user.value)

  const login = (userData: User) => {
    user.value = userData
  }

  const logout = () => {
    user.value = null
    uni.reLaunch({
      url: '/pages/login/index'
    })
  }

  const toggleRole = () => {
    if (user.value) {
      user.value.role = user.value.role === 'admin' ? 'employee' : 'admin'
    }
  }

  return {
    user,
    isAdmin,
    isLoggedIn,
    login,
    logout,
    toggleRole
  }
}, {
  persist: {
    storage: {
      getItem: (key: string) => {
        return uni.getStorageSync(key)
      },
      setItem: (key: string, value: any) => {
        uni.setStorageSync(key, value)
      }
    }
  }
})
