import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-gray-600 hover:text-blue-600'
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              React Router Demo
            </Link>
            <div className="flex space-x-6">
              <Link to="/" className={isActive('/')}>
                首页
              </Link>
              <Link to="/about" className={isActive('/about')}>
                关于
              </Link>
              <Link to="/users" className={isActive('/users')}>
                用户
              </Link>
              <Link to="/react-query" className={isActive('/react-query')}>
                React Query
              </Link>
              <Link to="/zustand" className={isActive('/zustand')}>
                Zustand
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <main className="container mx-auto py-8">
        <Outlet />
      </main>
    </div>
  )
}

