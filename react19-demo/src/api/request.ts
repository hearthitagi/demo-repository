import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// 响应数据接口
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 扩展AxiosRequestConfig，添加自定义配置
export interface CustomRequestConfig extends AxiosRequestConfig {
  // 是否显示loading
  showLoading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否重试
  retry?: boolean
  // 重试次数
  retryCount?: number
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const customConfig = config as CustomRequestConfig
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token && customConfig.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 可以在这里添加loading逻辑
    if (customConfig.showLoading !== false) {
      // 显示loading
      console.log('Loading...')
    }

    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse | unknown>) => {
    const { data } = response

    // 如果后端返回的数据格式是 { code, message, data }
    if (typeof data === 'object' && data !== null && 'code' in data) {
      const apiResponse = data as ApiResponse
      // 根据业务状态码处理
      if (apiResponse.code === 200 || apiResponse.code === 0) {
        // 修改response.data为实际数据
        response.data = apiResponse.data as unknown
        return response
      } else {
        // 业务错误
        const error = new Error(apiResponse.message || '请求失败')
        return Promise.reject(error)
      }
    }

    // 如果后端直接返回数据（如jsonplaceholder这种API）
    return response
  },
  (error: AxiosError) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 未授权，清除token并跳转登录
          localStorage.removeItem('token')
          // window.location.href = '/login'
          console.error('未授权，请重新登录')
          break
        case 403:
          console.error('没有权限访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(`请求失败: ${status}`)
      }

      // 显示错误提示
      if (error.config && (error.config as CustomRequestConfig).showError !== false) {
        const errorData = data as { message?: string } | undefined
        const message = errorData?.message || `请求失败: ${status}`
        console.error(message)
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message)
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  async get<T = unknown>(url: string, params?: unknown, config?: CustomRequestConfig): Promise<T> {
    const res = await instance.get(url, { params, ...config });
    return res?.data as T;
  },

  async post<T = unknown>(url: string, data?: unknown, config?: CustomRequestConfig): Promise<T> {
    const res = await instance.post(url, data, config);
    return res?.data as T;
  },

  async put<T = unknown>(url: string, data?: unknown, config?: CustomRequestConfig): Promise<T> {
    const res = await instance.put(url, data, config);
    return res?.data as T;
  },

  async patch<T = unknown>(url: string, data?: unknown, config?: CustomRequestConfig): Promise<T> {
    const res = await instance.patch(url, data, config);
    return res?.data as T;
  },

  async delete<T = unknown>(url: string, config?: CustomRequestConfig): Promise<T> {
    const res = await instance.delete(url, config);
    return res?.data as T;
  },
}

export default instance

