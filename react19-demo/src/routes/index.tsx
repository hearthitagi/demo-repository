import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import About from '../pages/About'
import Users from '../pages/Users'
import UserDetail from '../pages/UserDetail'
import NotFound from '../pages/NotFound'
import ReactQueryExample from '../components/ReactQueryExample'
import ZustandExample from '../components/ZustandExample'

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'users/:id',
        element: <UserDetail />,
      },
      {
        path: 'react-query',
        element: <ReactQueryExample />,
      },
      {
        path: 'zustand',
        element: <ZustandExample />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

