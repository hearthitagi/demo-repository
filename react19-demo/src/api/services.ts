import { request } from './request'
import type { User, Post, Comment, CreatePostParams, UpdatePostParams } from './types'

// 用户相关API
export const userApi = {
  // 获取用户列表
  getUsers: () => request.get<User[]>('/users'),

  // 获取单个用户详情
  getUserById: (id: number) => request.get<User>(`/users/${id}`),
}

// 文章相关API
export const postApi = {
  // 获取文章列表
  getPosts: () => request.get<Post[]>('/posts'),

  // 获取单个文章详情
  getPostById: (id: number) => request.get<Post>(`/posts/${id}`),

  // 获取用户的文章列表
  getPostsByUserId: (userId: number) => request.get<Post[]>(`/posts?userId=${userId}`),

  // 创建文章
  createPost: (data: CreatePostParams) => request.post<Post>('/posts', data),

  // 更新文章
  updatePost: (id: number, data: UpdatePostParams) => request.put<Post>(`/posts/${id}`, data),

  // 部分更新文章
  patchPost: (id: number, data: UpdatePostParams) => request.patch<Post>(`/posts/${id}`, data),

  // 删除文章
  deletePost: (id: number) => request.delete<void>(`/posts/${id}`),
}

// 评论相关API
export const commentApi = {
  // 获取文章评论
  getCommentsByPostId: (postId: number) => request.get<Comment[]>(`/posts/${postId}/comments`),
}

