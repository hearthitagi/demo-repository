import { Link, useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">关于页面</h1>
      <p className="text-gray-600 mb-4">这是关于页面的内容</p>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">路由导航方式：</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Link 组件：</strong>
              <Link
                to="/"
                className="text-blue-500 hover:text-blue-700 underline ml-2"
              >
                返回首页
              </Link>
            </li>
            <li>
              <strong>useNavigate Hook：</strong>
              <button
                onClick={() => navigate('/')}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                返回首页（编程式导航）
              </button>
            </li>
            <li>
              <strong>带参数导航：</strong>
              <button
                onClick={() => navigate('/users/1')}
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                查看用户ID为1的详情
              </button>
            </li>
            <li>
              <strong>回退导航：</strong>
              <button
                onClick={() => navigate(-1)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                返回上一页
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

