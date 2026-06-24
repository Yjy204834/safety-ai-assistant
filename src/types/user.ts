export type UserRole = 'employee' | 'admin'

export interface User {
  id: string
  username: string
  nickname: string
  role: UserRole
  department: string
  avatar?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  nickname: string
  department: string
  password: string
  role: UserRole
}

export interface Permission {
  aiQa: {
    general: boolean
    safety: boolean
  }
  news: {
    view: boolean
    publish: boolean
  }
  training: {
    psychTest: boolean
    theory: boolean
    video: boolean
    safetyTest: boolean
    statistics: boolean
  }
  monitor: {
    view: boolean
    electrolyzer: boolean
    purchase: boolean
    alert: boolean
    settings: boolean
    dataAnalysis: boolean
  }
}

export const rolePermissions: Record<UserRole, Permission> = {
  employee: {
    aiQa: {
      general: true,
      safety: false
    },
    news: {
      view: true,
      publish: false
    },
    training: {
      psychTest: true,
      theory: true,
      video: true,
      safetyTest: true,
      statistics: false
    },
    monitor: {
      view: false,
      electrolyzer: false,
      purchase: false,
      alert: true,
      settings: false,
      dataAnalysis: false
    }
  },
  admin: {
    aiQa: {
      general: true,
      safety: true
    },
    news: {
      view: true,
      publish: true
    },
    training: {
      psychTest: true,
      theory: true,
      video: true,
      safetyTest: true,
      statistics: true
    },
    monitor: {
      view: true,
      electrolyzer: true,
      purchase: true,
      alert: true,
      settings: true,
      dataAnalysis: true
    }
  }
}
