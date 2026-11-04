import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { userApi, postApi, commentApi } from './services'
import type { Post, CreatePostParams, UpdatePostParams } from './types'

// ==================== 用户相关 Hooks ====================

/**
 * 获取用户列表
 * 经典场景：基础查询，自动缓存和重新验证
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
    staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟后清理缓存（原cacheTime）
  })
}

/**
 * 获取单个用户详情
 * 经典场景：带参数的查询，启用/禁用查询
 */
export const useUser = (id: number | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id!),
    enabled: enabled && id !== null, // 只有当id存在时才执行查询
  })
}

// ==================== 文章相关 Hooks ====================

/**
 * 获取文章列表
 * 经典场景：基础列表查询
 */
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postApi.getPosts(),
  })
}

/**
 * 获取单个文章详情
 * 经典场景：详情查询
 */
export const usePost = (id: number | null) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getPostById(id!),
    enabled: id !== null,
  })
}

/**
 * 获取用户的文章列表
 * 经典场景：依赖查询，根据用户ID获取相关数据
 */
export const useUserPosts = (userId: number | null) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => postApi.getPostsByUserId(userId!),
    enabled: userId !== null,
  })
}

/**
 * 创建文章
 * 经典场景：POST请求，乐观更新，成功后刷新列表
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostParams) => postApi.createPost(data),
    onSuccess: () => {
      // 使文章列表缓存失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * 更新文章
 * 经典场景：PUT请求，乐观更新
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostParams }) =>
      postApi.updatePost(id, data),
    onMutate: async ({ id, data }) => {
      // 取消正在进行的查询，避免覆盖乐观更新
      await queryClient.cancelQueries({ queryKey: ['post', id] })

      // 保存之前的值，用于回滚
      const previousPost = queryClient.getQueryData<Post>(['post', id])

      // 乐观更新
      if (previousPost) {
        queryClient.setQueryData<Post>(['post', id], {
          ...previousPost,
          ...data,
        })
      }

      return { previousPost }
    },
    onError: (_err, variables, context) => {
      // 发生错误时回滚
      if (context?.previousPost) {
        queryClient.setQueryData(['post', variables.id], context.previousPost)
      }
    },
    onSettled: (_data, _error, variables) => {
      // 无论成功或失败，都重新获取数据
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * 部分更新文章
 * 经典场景：PATCH请求
 */
export const usePatchPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostParams }) =>
      postApi.patchPost(id, data),
    onSuccess: (data, variables) => {
      // 更新缓存
      queryClient.setQueryData(['post', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * 删除文章
 * 经典场景：DELETE请求，成功后从缓存中移除
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: (_, id) => {
      // 从缓存中移除
      queryClient.removeQueries({ queryKey: ['post', id] })
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// ==================== 评论相关 Hooks ====================

/**
 * 获取文章评论
 * 经典场景：依赖查询，根据文章ID获取评论
 */
export const usePostComments = (postId: number | null) => {
  return useQuery({
    queryKey: ['comments', 'post', postId],
    queryFn: () => commentApi.getCommentsByPostId(postId!),
    enabled: postId !== null,
  })
}

// ==================== 高级场景：无限滚动/分页 ====================

/**
 * 无限滚动获取文章列表
 * 经典场景：分页加载，无限滚动
 */
export const useInfinitePosts = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => {
      // 模拟分页API调用
      return postApi.getPosts().then((posts) => {
        const start = (pageParam - 1) * pageSize
        const end = start + pageSize
        return {
          data: posts.slice(start, end),
          nextPage: end < posts.length ? pageParam + 1 : undefined,
        }
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}

// ==================== 组合查询示例 ====================

/**
 * 获取用户及其文章
 * 经典场景：并行查询，同时获取多个数据
 */
export const useUserWithPosts = (userId: number | null) => {
  const userQuery = useUser(userId)
  const postsQuery = useUserPosts(userId)

  return {
    user: userQuery.data,
    posts: postsQuery.data,
    isLoading: userQuery.isLoading || postsQuery.isLoading,
    isError: userQuery.isError || postsQuery.isError,
    error: userQuery.error || postsQuery.error,
    refetch: () => {
      userQuery.refetch()
      postsQuery.refetch()
    },
  }
}

