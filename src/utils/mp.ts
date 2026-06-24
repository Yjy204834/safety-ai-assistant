/**
 * 小程序工具函数
 */

/**
 * 显示加载提示
 */
export const showLoading = (title: string = '加载中...') => {
  uni.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
export const hideLoading = () => {
  uni.hideLoading()
}

/**
 * 显示消息提示
 */
export const showToast = (
  title: string, 
  icon: 'success' | 'error' | 'loading' | 'none' = 'none',
  duration: number = 2000
) => {
  uni.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示确认对话框
 */
export const showModal = (options: {
  title: string
  content: string
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
}): Promise<boolean> => {
  return new Promise((resolve) => {
    uni.showModal({
      ...options,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 跳转页面
 */
export const navigateTo = (url: string) => {
  uni.navigateTo({ url })
}

/**
 * 重定向页面
 */
export const redirectTo = (url: string) => {
  uni.redirectTo({ url })
}

/**
 * 切换Tab页（使用自定义TabBar）
 */
export const switchTab = (url: string) => {
  uni.redirectTo({ url })
}

/**
 * 返回上一页
 */
export const navigateBack = (delta: number = 1) => {
  uni.navigateBack({ delta })
}

/**
 * 存储数据
 */
export const setStorage = (key: string, data: any) => {
  try {
    uni.setStorageSync(key, data)
  } catch (e) {
    console.error('存储数据失败', e)
  }
}

/**
 * 获取数据
 */
export const getStorage = <T>(key: string): T | null => {
  try {
    return uni.getStorageSync(key) || null
  } catch (e) {
    console.error('获取数据失败', e)
    return null
  }
}

/**
 * 删除数据
 */
export const removeStorage = (key: string) => {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('删除数据失败', e)
  }
}

/**
 * 网络请求封装
 */
export const request = (options: UniApp.RequestOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 上传文件
 */
export const uploadFile = (options: UniApp.UploadFileOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.data))
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 选择图片
 */
export const chooseImage = (options?: Partial<UniApp.ChooseImageOptions>) => {
  return new Promise<UniApp.ChooseImageSuccessCallbackResult>((resolve, reject) => {
    uni.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      ...options,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 预览图片
 */
export const previewImage = (urls: string[], current?: string) => {
  uni.previewImage({
    urls,
    current: current || urls[0]
  })
}
