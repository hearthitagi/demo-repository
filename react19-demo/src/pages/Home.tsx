import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">首页</h1>
      <p className="text-gray-600 mb-6">这是首页内容，展示了 React Router 的基础功能</p>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">React Router 功能演示</h2>
        <ul className="space-y-3">
          <li>
            <strong>1. 路由导航 (Link)：</strong>
            <div className="mt-2 space-x-4">
              <Link
                to="/about"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                关于页面
              </Link>
              <Link
                to="/users"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                用户列表
              </Link>
              <Link
                to="/react-query"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                React Query 示例
              </Link>
              <Link
                to="/zustand"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Zustand 示例
              </Link>
            </div>
          </li>
          <li>
            <strong>2. 动态路由：</strong>
            <span className="text-gray-600 ml-2">
              访问 /users/:id 查看用户详情（演示路由参数）
            </span>
          </li>
          <li>
            <strong>3. 编程式导航：</strong>
            <span className="text-gray-600 ml-2">
              在关于页面查看 useNavigate Hook 的使用
            </span>
          </li>
          <li>
            <strong>4. 404 页面：</strong>
            <Link
              to="/not-exist"
              className="text-blue-500 hover:text-blue-700 underline ml-2"
            >
              访问不存在的路由
            </Link>
          </li>
          <li>
            <strong>5. 嵌套路由：</strong>
            <span className="text-gray-600 ml-2">
              所有页面都使用 Layout 组件作为父路由（顶部导航栏）
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

