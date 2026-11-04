import { Link, useParams, useNavigate } from 'react-router-dom'
import { useUser, useUserPosts } from '../api/hooks'

export default function UserDetail() {
  // 获取路由参数
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userId = id ? parseInt(id, 10) : null

  const { data: user, isLoading: userLoading } = useUser(userId)
  const { data: posts, isLoading: postsLoading } = useUserPosts(userId)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          ← 返回
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">用户详情</h1>
      <p className="text-gray-500 mb-4">路由参数: id = {id}</p>

      {userLoading && <p>加载用户信息...</p>}
      {user && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">用户名: {user.username}</p>
          <p className="text-gray-600">邮箱: {user.email}</p>
          <p className="text-gray-600">电话: {user.phone || 'N/A'}</p>
          <p className="text-gray-600">网站: {user.website || 'N/A'}</p>
        </div>
      )}

      {postsLoading && <p>加载文章...</p>}
      {posts && posts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">该用户的文章 ({posts.length})</h2>
          <div className="space-y-2">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="p-3 border rounded">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.body.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-x-4">
        <Link
          to="/users"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          返回用户列表
        </Link>
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}

