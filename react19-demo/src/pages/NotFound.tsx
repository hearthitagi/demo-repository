import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
      <p className="text-gray-600 mb-6">
        抱歉，您访问的页面不存在
      </p>
      <div className="space-x-4">
        <Link
          to="/"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          返回首页
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          返回上一页
        </button>
      </div>
    </div>
  )
}

