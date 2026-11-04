import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './App.css'

// 配置 QueryClient 的默认选项
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 失败后重试次数
      retry: 1,
      // 数据在缓存中保持新鲜的时间（毫秒）
      staleTime: 5 * 60 * 1000, // 5分钟
      // 数据在缓存中保留的时间（毫秒）
      gcTime: 10 * 60 * 1000, // 10分钟（原cacheTime）
      // 窗口重新聚焦时重新获取数据
      refetchOnWindowFocus: false,
    },
    mutations: {
      // mutation失败后重试次数
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
