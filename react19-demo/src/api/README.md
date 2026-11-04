# API 封装说明

本项目包含了一个完整的 axios 封装和 React Query 使用示例。

## 文件结构

```
src/api/
├── request.ts      # axios 封装（请求/响应拦截器、错误处理）
├── types.ts        # TypeScript 类型定义
├── services.ts     # API 服务函数
└── hooks.ts        # React Query Hooks
```

## 1. Axios 封装 (`request.ts`)

### 特性

- ✅ 请求拦截器：自动添加 token、loading 控制
- ✅ 响应拦截器：统一处理响应数据格式、错误处理
- ✅ 错误处理：HTTP 状态码错误、网络错误、业务错误
- ✅ TypeScript 类型支持
- ✅ 自定义配置：`showLoading`、`showError`、`retry` 等

### 使用示例

```typescript
import { request } from './api/request'

// GET 请求
const users = await request.get<User[]>('/users')

// POST 请求
const newPost = await request.post<Post>('/posts', {
  title: '标题',
  body: '内容',
  userId: 1
})

// 带自定义配置
const data = await request.get('/data', {
  showLoading: false,  // 不显示 loading
  showError: false,    // 不显示错误提示
})
```

## 2. React Query Hooks (`hooks.ts`)

### 包含的经典使用场景

#### 1. 基础查询 (useQuery)
- `useUsers()` - 获取用户列表
- `useUser(id)` - 获取单个用户详情
- `usePosts()` - 获取文章列表
- `usePost(id)` - 获取单个文章详情

#### 2. 依赖查询
- `useUserPosts(userId)` - 根据用户ID获取文章列表
- `usePostComments(postId)` - 根据文章ID获取评论

#### 3. Mutation（数据变更）
- `useCreatePost()` - 创建文章（POST）
- `useUpdatePost()` - 更新文章（PUT，包含乐观更新）
- `usePatchPost()` - 部分更新文章（PATCH）
- `useDeletePost()` - 删除文章（DELETE）

#### 4. 高级场景
- `useInfinitePosts()` - 无限滚动/分页加载
- `useUserWithPosts()` - 组合查询（并行查询）

### 使用示例

```typescript
import { useUsers, useCreatePost, useUpdatePost } from './api/hooks'

function MyComponent() {
  // 基础查询
  const { data: users, isLoading, error } = useUsers()

  // Mutation
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()

  const handleCreate = () => {
    createPost.mutate(
      { title: '标题', body: '内容', userId: 1 },
      {
        onSuccess: () => {
          console.log('创建成功')
        },
        onError: (error) => {
          console.error('创建失败', error)
        }
      }
    )
  }

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

## 3. 配置说明

### QueryClient 配置 (`App.tsx`)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // 失败后重试1次
      staleTime: 5 * 60 * 1000,   // 5分钟内数据被认为是新鲜的
      gcTime: 10 * 60 * 1000,     // 10分钟后清理缓存
      refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
    },
  },
})
```

## 4. 环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=https://api.example.com
```

如果不设置，默认使用 `https://jsonplaceholder.typicode.com`（用于演示）

## 5. 特性说明

### 乐观更新 (Optimistic Updates)

`useUpdatePost` hook 实现了乐观更新：
- 在请求发送前立即更新 UI
- 如果请求失败，自动回滚到之前的状态
- 请求成功后，重新获取最新数据

### 缓存管理

- 自动缓存查询结果
- 使用 `queryClient.invalidateQueries()` 使缓存失效
- 使用 `queryClient.setQueryData()` 手动更新缓存
- 使用 `queryClient.removeQueries()` 移除缓存

### 错误处理

- HTTP 错误（401, 403, 404, 500 等）自动处理
- 业务错误（后端返回的错误码）统一处理
- 网络错误提示
- 可在请求配置中控制是否显示错误提示

## 6. 最佳实践

1. **使用 TypeScript 类型**：所有 API 都有完整的类型定义
2. **合理使用缓存**：根据数据更新频率设置 `staleTime`
3. **错误处理**：在组件中处理错误状态
4. **Loading 状态**：使用 `isLoading` 或 `isFetching` 显示加载状态
5. **Mutation 回调**：使用 `onSuccess` 和 `onError` 处理成功和失败情况

