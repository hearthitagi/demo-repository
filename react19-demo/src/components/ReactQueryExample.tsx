import { useState } from 'react'
import {
  useUsers,
  useUser,
  usePosts,
  usePost,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  usePostComments,
  useInfinitePosts,
  useUserWithPosts,
} from '../api/hooks'
import { Button } from "@/components/ui/button"

export default function ReactQueryExample() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(1)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(1)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostBody, setNewPostBody] = useState('')

  // 1. 基础查询：获取用户列表
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers()

  // 2. 带参数的查询：获取单个用户
  const { data: user, isLoading: userLoading } = useUser(selectedUserId)

  // 3. 获取文章列表
  const { data: posts, isLoading: postsLoading } = usePosts()

  // 4. 获取单个文章
  const { data: post, isLoading: postLoading } = usePost(selectedPostId)

  // 5. 获取文章评论（依赖查询）
  const { data: comments, isLoading: commentsLoading } = usePostComments(selectedPostId)

  // 6. 创建文章 mutation
  const createPostMutation = useCreatePost()

  // 7. 更新文章 mutation
  const updatePostMutation = useUpdatePost()

  // 8. 删除文章 mutation
  const deletePostMutation = useDeletePost()

  // 9. 无限滚动
  const {
    data: infinitePostsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(5)

  // 10. 组合查询：用户及其文章
  const { user: userWithPosts, posts: userPosts, isLoading: userWithPostsLoading } =
    useUserWithPosts(selectedUserId)

  // 处理创建文章
  const handleCreatePost = () => {
    if (!newPostTitle || !newPostBody) {
      alert('请填写标题和内容')
      return
    }

    createPostMutation.mutate(
      {
        title: newPostTitle,
        body: newPostBody,
        userId: selectedUserId || 1,
      },
      {
        onSuccess: () => {
          alert('文章创建成功！')
          setNewPostTitle('')
          setNewPostBody('')
        },
        onError: (error) => {
          alert(`创建失败: ${error.message}`)
        },
      }
    )
  }

  // 处理更新文章
  const handleUpdatePost = (id: number) => {
    updatePostMutation.mutate(
      {
        id,
        data: {
          title: `更新后的标题 - ${new Date().toLocaleTimeString()}`,
        },
      },
      {
        onSuccess: () => {
          alert('文章更新成功！')
        },
      }
    )
  }

  // 处理删除文章
  const handleDeletePost = (id: number) => {
    if (confirm('确定要删除这篇文章吗？')) {
      deletePostMutation.mutate(id, {
        onSuccess: () => {
          alert('文章删除成功！')
          if (selectedPostId === id) {
            setSelectedPostId(null)
          }
        },
      })
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">React Query 使用示例</h1>

      {/* 1. 用户列表查询 */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">1. 基础查询 - 用户列表</h2>
        {usersLoading && <p>加载中...</p>}
        {usersError && <p className="text-red-500">错误: {usersError.message}</p>}
        {users && (
          <div className="space-y-2">
            {users.slice(0, 5).map((u) => (
              <div
                key={u.id}
                className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedUserId(u.id)}
              >
                {u.name} ({u.email})
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. 单个用户查询 */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">2. 带参数的查询 - 用户详情</h2>
        {userLoading && <p>加载中...</p>}
        {user && (
          <div className="p-4 bg-gray-50 rounded">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>姓名:</strong> {user.name}</p>
            <p><strong>用户名:</strong> {user.username}</p>
            <p><strong>邮箱:</strong> {user.email}</p>
          </div>
        )}
      </section>

      {/* 3. 文章列表 */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">3. 文章列表</h2>
        {postsLoading && <p>加载中...</p>}
        {posts && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {posts.slice(0, 10).map((p) => (
              <div
                key={p.id}
                className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedPostId(p.id)}
              >
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-600">{p.body.substring(0, 50)}...</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. 文章详情及评论（依赖查询） */}
      {selectedPostId && (
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">4. 文章详情及评论（依赖查询）</h2>
          {postLoading && <p>加载文章...</p>}
          {post && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="mt-2">{post.body}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => handleUpdatePost(post.id)}
                  disabled={updatePostMutation.isPending}
                  className="px-4 py-2 disabled:opacity-50"
                >
                  {updatePostMutation.isPending ? '更新中...' : '更新文章'}
                </Button>
                <Button
                  onClick={() => handleDeletePost(post.id)}
                  disabled={deletePostMutation.isPending}
                  className="px-4 py-2 disabled:opacity-50"
                >
                  {deletePostMutation.isPending ? '删除中...' : '删除文章'}
                </Button>
              </div>
            </div>
          )}

          {commentsLoading && <p>加载评论...</p>}
          {comments && comments.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">评论 ({comments.length})</h4>
              <div className="space-y-2">
                {comments.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-2 border rounded">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-sm text-gray-600">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. 创建文章（Mutation） */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">5. 创建文章（POST Mutation）</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="文章标题"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="文章内容"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
          <button
            onClick={handleCreatePost}
            disabled={createPostMutation.isPending}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {createPostMutation.isPending ? '创建中...' : '创建文章'}
          </button>
        </div>
      </section>

      {/* 6. 无限滚动 */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">6. 无限滚动/分页加载</h2>
        {infinitePostsData && (
          <div className="space-y-2">
            {infinitePostsData.pages.map((page, i) => (
              <div key={i}>
                {page.data.map((p) => (
                  <div key={p.id} className="p-2 border rounded mb-2">
                    <p className="font-semibold">{p.title}</p>
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {isFetchingNextPage
                ? '加载中...'
                : hasNextPage
                  ? '加载更多'
                  : '没有更多了'}
            </button>
          </div>
        )}
      </section>

      {/* 7. 组合查询 */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">7. 组合查询 - 用户及其文章</h2>
        {userWithPostsLoading && <p>加载中...</p>}
        {userWithPosts && (
          <div>
            <div className="p-4 bg-gray-50 rounded mb-4">
              <p className="font-semibold">{userWithPosts.name}</p>
              <p className="text-sm text-gray-600">{userWithPosts.email}</p>
            </div>
            {userPosts && userPosts.length > 0 && (
              <div>
                <p className="font-semibold mb-2">该用户的文章 ({userPosts.length})</p>
                <div className="space-y-2">
                  {userPosts.slice(0, 3).map((p) => (
                    <div key={p.id} className="p-2 border rounded">
                      <p className="font-semibold text-sm">{p.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

