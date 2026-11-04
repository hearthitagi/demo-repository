# Zustand 状态管理使用说明

本项目使用 Zustand 作为全局状态管理库，所有 store 定义在 `src/stores/index.ts` 文件中。

## 什么是 Zustand？

Zustand 是一个轻量级、简单易用的状态管理库，具有以下特点：
- ✅ API 简洁，无需 Provider 包裹
- ✅ TypeScript 支持完善
- ✅ 体积小（< 1KB）
- ✅ 支持中间件（DevTools、持久化等）
- ✅ 性能优秀，支持选择器优化

## Store 列表

### 1. CounterStore - 基础计数器

**功能：** 演示基础的数值状态管理

**API：**
- `count: number` - 计数器值
- `increment()` - 增加 1
- `decrement()` - 减少 1
- `reset()` - 重置为 0
- `incrementByAmount(amount: number)` - 增加指定数量

**使用示例：**
```tsx
const count = useCounterStore((state) => state.count)
const increment = useCounterStore((state) => state.increment)

<button onClick={increment}>+1</button>
<span>{count}</span>
```

### 2. UserStore - 用户信息管理

**功能：** 演示复杂对象状态管理

**API：**
- `user: User | null` - 用户信息
- `setUser(user: User)` - 设置用户
- `updateUser(partialUser: Partial<User>)` - 部分更新用户信息
- `clearUser()` - 清除用户

**使用示例：**
```tsx
const user = useUserStore((state) => state.user)
const setUser = useUserStore((state) => state.setUser)

setUser({ id: 1, name: '张三', email: 'zhangsan@example.com', age: 28 })
```

### 3. TodoStore - 待办事项（异步操作）

**功能：** 演示异步操作和加载状态管理

**API：**
- `todos: Todo[]` - 待办事项列表
- `loading: boolean` - 加载状态
- `error: string | null` - 错误信息
- `fetchTodos()` - 异步获取待办事项
- `addTodo(title: string)` - 添加待办
- `toggleTodo(id: number)` - 切换完成状态
- `deleteTodo(id: number)` - 删除待办
- `clearTodos()` - 清空所有待办

**使用示例：**
```tsx
const { todos, loading, fetchTodos } = useTodoStore()

useEffect(() => {
  fetchTodos()
}, [])

if (loading) return <div>加载中...</div>
```

### 4. ThemeStore - 主题设置（持久化）

**功能：** 演示状态持久化到 localStorage

**API：**
- `theme: 'light' | 'dark'` - 当前主题
- `toggleTheme()` - 切换主题
- `setTheme(theme: Theme)` - 设置主题

**特性：**
- 使用 `persist` 中间件，自动保存到 localStorage
- 刷新页面后主题设置仍然保留

**使用示例：**
```tsx
const theme = useThemeStore((state) => state.theme)
const toggleTheme = useThemeStore((state) => state.toggleTheme)

<button onClick={toggleTheme}>切换主题</button>
```

### 5. CartStore - 购物车（选择器优化）

**功能：** 演示选择器优化，避免不必要的重渲染

**API：**
- `items: CartItem[]` - 购物车商品列表
- `addItem(item)` - 添加商品
- `removeItem(id)` - 移除商品
- `updateQuantity(id, quantity)` - 更新数量
- `clearCart()` - 清空购物车
- `totalQuantity()` - 计算总数量
- `totalPrice()` - 计算总价

**选择器优化：**
```tsx
// ❌ 不好的做法：订阅整个 store，任何状态变化都会重渲染
const store = useCartStore()

// ✅ 好的做法：只订阅需要的状态
const items = useCartStore((state) => state.items)
const totalPrice = useCartStore((state) => state.totalPrice())
```

### 6. AppStore - 应用状态

**功能：** 演示应用级别的全局状态（如侧边栏开关）

**API：**
- `sidebarOpen: boolean` - 侧边栏开关状态
- `toggleSidebar()` - 切换侧边栏
- `setSidebarOpen(open: boolean)` - 设置侧边栏状态

## 基础用法

### 创建 Store

```tsx
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

### 使用 Store

```tsx
import { useCounterStore } from './stores'

function MyComponent() {
  // 只订阅需要的状态（推荐）
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+1</button>
    </div>
  )
}
```

### 在组件外使用 Store

```tsx
// 无需 React 组件即可访问 store
const count = useCounterStore.getState().count
useCounterStore.getState().increment()
```

## 中间件

### DevTools 中间件

用于调试，在浏览器 DevTools 中可以查看状态变化：

```tsx
import { devtools } from 'zustand/middleware'

export const useStore = create(
  devtools(
    (set) => ({ ... }),
    { name: 'StoreName' }
  )
)
```

### 持久化中间件

将状态保存到 localStorage：

```tsx
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({ ... }),
    {
      name: 'storage-key',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

## 最佳实践

### 1. 使用选择器避免不必要的重渲染

```tsx
// ❌ 不推荐
const store = useCounterStore()

// ✅ 推荐：只订阅需要的状态
const count = useCounterStore((state) => state.count)
```

### 2. 拆分 Store

不要把所有状态都放在一个 store 中，按功能拆分：

```tsx
// ✅ 推荐：按功能拆分
useCounterStore()
useUserStore()
useCartStore()
```

### 3. 使用 TypeScript

为每个 store 定义清晰的类型：

```tsx
interface MyState {
  value: number
  setValue: (value: number) => void
}

export const useMyStore = create<MyState>((set) => ({
  value: 0,
  setValue: (value) => set({ value }),
}))
```

### 4. 使用中间件

- 开发环境使用 `devtools` 调试
- 需要持久化的状态使用 `persist`

### 5. 异步操作

在异步操作中正确设置 loading 和 error 状态：

```tsx
fetchData: async () => {
  set({ loading: true, error: null })
  try {
    const data = await api.getData()
    set({ data, loading: false })
  } catch (error) {
    set({ error: error.message, loading: false })
  }
}
```

## 与 Redux 的对比

| 特性 | Zustand | Redux |
|------|---------|-------|
| 代码量 | 少 | 多 |
| 学习曲线 | 平缓 | 陡峭 |
| Bundle 大小 | < 1KB | ~10KB |
| 需要 Provider | ❌ | ✅ |
| DevTools | ✅ | ✅ |
| 中间件 | ✅ | ✅ |
| TypeScript | ✅ | ✅ |

## 更多资源

- [Zustand 官方文档](https://docs.pmnd.rs/zustand)
- [GitHub 仓库](https://github.com/pmndrs/zustand)

