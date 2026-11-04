import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

// ==================== 1. 基础计数器 Store ====================
interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  incrementByAmount: (amount: number) => void
}

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
      decrement: () => set((state) => ({ count: state.count - 1 }), false, 'decrement'),
      reset: () => set({ count: 0 }, false, 'reset'),
      incrementByAmount: (amount: number) =>
        set((state) => ({ count: state.count + amount }), false, 'incrementByAmount'),
    }),
    { name: 'CounterStore' }
  )
)

// ==================== 2. 复杂对象状态 Store（用户信息）====================
interface User {
  id: number
  name: string
  email: string
  age: number
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
  updateUser: (partialUser: Partial<User>) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }, false, 'setUser'),
      updateUser: (partialUser: Partial<User>) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, ...partialUser } : null,
          }),
          false,
          'updateUser'
        ),
      clearUser: () => set({ user: null }, false, 'clearUser'),
    }),
    { name: 'UserStore' }
  )
)

// ==================== 3. 异步操作 Store（待办事项）====================
interface Todo {
  id: number
  title: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
  fetchTodos: () => Promise<void>
  addTodo: (title: string) => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
  clearTodos: () => void
}

export const useTodoStore = create<TodoState>()(
  devtools(
    (set) => ({
      todos: [],
      loading: false,
      error: null,
      fetchTodos: async () => {
        set({ loading: true, error: null }, false, 'fetchTodos/start')
        try {
          // 模拟 API 调用
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const mockTodos: Todo[] = [
            { id: 1, title: '学习 Zustand', completed: false },
            { id: 2, title: '完成项目', completed: true },
            { id: 3, title: '写文档', completed: false },
          ]
          set({ todos: mockTodos, loading: false }, false, 'fetchTodos/success')
        } catch (error) {
          set(
            { error: error instanceof Error ? error.message : '获取待办事项失败', loading: false },
            false,
            'fetchTodos/error'
          )
        }
      },
      addTodo: (title: string) => {
        const newTodo: Todo = {
          id: Date.now(),
          title,
          completed: false,
        }
        set(
          (state) => ({ todos: [...state.todos, newTodo] }),
          false,
          'addTodo'
        )
      },
      toggleTodo: (id: number) => {
        set(
          (state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          }),
          false,
          'toggleTodo'
        )
      },
      deleteTodo: (id: number) => {
        set(
          (state) => ({ todos: state.todos.filter((todo) => todo.id !== id) }),
          false,
          'deleteTodo'
        )
      },
      clearTodos: () => set({ todos: [] }, false, 'clearTodos'),
    }),
    { name: 'TodoStore' }
  )
)

// ==================== 4. 持久化 Store（主题设置）====================
type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    devtools(
      (set) => ({
        theme: 'light',
        toggleTheme: () =>
          set(
            (state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }),
            false,
            'toggleTheme'
          ),
        setTheme: (theme: Theme) => set({ theme }, false, 'setTheme'),
      }),
      { name: 'ThemeStore' }
    ),
    {
      name: 'theme-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// ==================== 5. 选择器优化示例 Store（购物车）====================
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  // 计算属性：总数量
  totalQuantity: () => number
  // 计算属性：总价
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id)
        if (existingItem) {
          set(
            (state) => ({
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }),
            false,
            'addItem/increment'
          )
        } else {
          set(
            (state) => ({ items: [...state.items, { ...item, quantity: 1 }] }),
            false,
            'addItem/new'
          )
        }
      },
      removeItem: (id: number) => {
        set(
          (state) => ({ items: state.items.filter((item) => item.id !== id) }),
          false,
          'removeItem'
        )
      },
      updateQuantity: (id: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set(
          (state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          }),
          false,
          'updateQuantity'
        )
      },
      clearCart: () => set({ items: [] }, false, 'clearCart'),
      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
    }),
    { name: 'CartStore' }
  )
)

// ==================== 6. 组合 Store 示例（应用状态）====================
interface AppState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      sidebarOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),
    }),
    { name: 'AppStore' }
  )
)

