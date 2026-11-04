import { useEffect } from 'react'
import {
  useCounterStore,
  useUserStore,
  useTodoStore,
  useThemeStore,
  useCartStore,
  useAppStore,
} from '../stores'

export default function ZustandExample() {
  // 获取 store 状态和方法
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)
  const incrementByAmount = useCounterStore((state) => state.incrementByAmount)

  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const updateUser = useUserStore((state) => state.updateUser)
  const clearUser = useUserStore((state) => state.clearUser)

  const { todos, loading, error, fetchTodos, addTodo, toggleTodo, deleteTodo } = useTodoStore()
  const todoTitle = useTodoStore((state) => state.todos.map((t) => t.title).join(', '))

  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  // 使用选择器获取计算值（避免不必要的重渲染）
  const totalQuantity = useCartStore((state) => state.totalQuantity())
  const totalPrice = useCartStore((state) => state.totalPrice())

  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)

  // 组件挂载时获取待办事项
  useEffect(() => {
    if (todos.length === 0) {
      fetchTodos()
    }
  }, [])

  // 应用主题
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Zustand 状态管理示例</h1>

      {/* 1. 基础计数器 */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">1. 基础计数器</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -
          </button>
          <span className="text-2xl font-bold min-w-[60px] text-center">{count}</span>
          <button
            onClick={increment}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +
          </button>
          <button
            onClick={() => incrementByAmount(5)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +5
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            重置
          </button>
        </div>
      </section>

      {/* 2. 复杂对象状态（用户信息） */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">2. 用户信息管理</h2>
        {user ? (
          <div className="space-y-2">
            <div className="p-4 bg-gray-50 rounded">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>姓名:</strong> {user.name}</p>
              <p><strong>邮箱:</strong> {user.email}</p>
              <p><strong>年龄:</strong> {user.age}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateUser({ name: '新名字', age: 25 })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                更新用户信息
              </button>
              <button
                onClick={clearUser}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                清除用户
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() =>
              setUser({
                id: 1,
                name: '张三',
                email: 'zhangsan@example.com',
                age: 28,
              })
            }
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            设置用户
          </button>
        )}
      </section>

      {/* 3. 异步操作（待办事项） */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">3. 异步操作 - 待办事项</h2>
        {loading && <p>加载中...</p>}
        {error && <p className="text-red-500">错误: {error}</p>}
        <div className="space-y-2 mb-4">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4"
              />
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-auto px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTodos}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重新获取
          </button>
          <button
            onClick={() => addTodo(`新任务 ${Date.now()}`)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            添加待办
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          选择器优化：仅当标题变化时才重新渲染 - {todoTitle}
        </p>
      </section>

      {/* 4. 持久化存储（主题设置） */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">4. 持久化存储 - 主题切换</h2>
        <div className="flex items-center gap-4">
          <span>当前主题: {theme === 'light' ? '浅色' : '深色'}</span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            切换主题
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          主题设置已保存到 localStorage，刷新页面后仍然保留
        </p>
      </section>

      {/* 5. 购物车（选择器优化） */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">5. 购物车（选择器优化）</h2>
        <div className="space-y-2 mb-4">
          {items.length === 0 ? (
            <p className="text-gray-500">购物车为空</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-gray-600 ml-2">¥{item.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="min-w-[30px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold">总数量: {totalQuantity}</p>
            <p className="font-semibold">总价: ¥{totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addItem({ id: 1, name: '商品A', price: 99.99 })}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              添加商品A
            </button>
            <button
              onClick={() => addItem({ id: 2, name: '商品B', price: 199.99 })}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              添加商品B
            </button>
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              清空购物车
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          使用选择器获取计算值，避免不必要的重渲染
        </p>
      </section>

      {/* 6. 应用状态（侧边栏） */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">6. 应用状态 - 侧边栏控制</h2>
        <div className="flex items-center gap-4">
          <span>侧边栏状态: {sidebarOpen ? '打开' : '关闭'}</span>
          <button
            onClick={toggleSidebar}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            切换侧边栏
          </button>
        </div>
      </section>

      {/* 使用说明 */}
      <section className="border p-4 rounded-lg bg-blue-50">
        <h2 className="text-xl font-semibold mb-4">Zustand 特性说明</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>简单易用：</strong>API 简洁，无需 Provider 包裹</li>
          <li><strong>TypeScript 支持：</strong>完整的类型推断</li>
          <li><strong>选择器优化：</strong>只订阅需要的状态，避免不必要的重渲染</li>
          <li><strong>中间件支持：</strong>DevTools、持久化等</li>
          <li><strong>异步操作：</strong>支持异步 state 更新</li>
          <li><strong>组合使用：</strong>可以创建多个独立的 store</li>
        </ul>
      </section>
    </div>
  )
}

