// 用户类型
export interface User {
  id: number
  name: string
  username: string
  email: string
  phone?: string
  website?: string
  address?: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
}

// 文章类型
export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// 评论类型
export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

// 创建文章请求参数
export interface CreatePostParams {
  title: string
  body: string
  userId: number
}

// 更新文章请求参数
export interface UpdatePostParams {
  title?: string
  body?: string
}

// 分页参数
export interface PaginationParams {
  page: number
  limit: number
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

