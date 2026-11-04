# React Router 路由配置说明

本项目使用 React Router v7 进行路由管理。

## 文件结构

```
src/
├── routes/
│   └── index.tsx          # 路由配置文件
├── pages/
│   ├── Home.tsx           # 首页
│   ├── About.tsx          # 关于页面
│   ├── Users.tsx          # 用户列表
│   ├── UserDetail.tsx     # 用户详情（动态路由）
│   └── NotFound.tsx       # 404 页面
└── components/
    └── Layout.tsx         # 布局组件（嵌套路由）
```

## 路由配置

路由配置统一在 `src/routes/index.tsx` 文件中管理。

### 路由列表

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | Home | 首页 |
| `/about` | About | 关于页面 |
| `/users` | Users | 用户列表 |
| `/users/:id` | UserDetail | 用户详情（动态路由参数） |
| `/react-query` | ReactQueryExample | React Query 示例 |
| `*` | NotFound | 404 页面（捕获所有未匹配的路由） |

## 基础功能演示

### 1. 路由导航 - Link 组件

```tsx
import { Link } from 'react-router-dom'

<Link to="/about">前往关于页面</Link>
```

### 2. 编程式导航 - useNavigate Hook

```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// 导航到指定路径
navigate('/about')

// 导航到带参数的路由
navigate('/users/1')

// 返回上一页
navigate(-1)

// 前进一页
navigate(1)
```

### 3. 获取路由参数 - useParams Hook

```tsx
import { useParams } from 'react-router-dom'

// 路由定义: /users/:id
const { id } = useParams<{ id: string }>()
```

### 4. 获取当前路由信息 - useLocation Hook

```tsx
import { useLocation } from 'react-router-dom'

const location = useLocation()
console.log(location.pathname) // 当前路径
console.log(location.search)   // 查询参数
```

### 5. 嵌套路由 - Outlet

使用 `Layout` 组件作为父路由，子路由通过 `<Outlet />` 渲染：

```tsx
// Layout.tsx
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav>导航栏</nav>
      <Outlet /> {/* 子路由在这里渲染 */}
    </div>
  )
}
```

## 使用示例

### 在组件中使用路由

```tsx
import { Link, useNavigate, useParams } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <Link to="/home">首页</Link>
      <button onClick={() => navigate('/about')}>
        关于
      </button>
      {id && <p>当前ID: {id}</p>}
    </div>
  )
}
```

### 添加新路由

在 `src/routes/index.tsx` 中添加：

```tsx
{
  path: 'new-page',
  element: <NewPage />,
}
```

## 注意事项

1. **路由参数类型**：使用 TypeScript 时，记得为 `useParams` 指定类型
2. **404 路由**：`path: '*'` 必须放在最后，用于捕获所有未匹配的路由
3. **嵌套路由**：使用 `children` 数组定义子路由，父组件需要使用 `<Outlet />` 渲染子路由
4. **index 路由**：使用 `index: true` 定义默认子路由

## 高级功能（可选扩展）

- 路由守卫（需要时可添加）
- 懒加载路由（使用 React.lazy）
- 路由数据加载（使用 loader）
- 路由错误边界（使用 errorElement）

