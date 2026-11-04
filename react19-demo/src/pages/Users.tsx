import { Link } from 'react-router-dom'
import { useUsers } from '../api/hooks'

export default function Users() {
  const { data: users, isLoading } = useUsers()
  console.log(users);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">用户列表</h1>
      
      {isLoading && <p>加载中...</p>}
      
      {users && (
        <div className="space-y-2">
          <p className="text-gray-600 mb-4">
            点击用户名查看详情（演示动态路由参数）
          </p>
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded hover:bg-gray-50"
            >
              <Link
                to={`/users/${user.id}`}
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                {user.name}
              </Link>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
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

