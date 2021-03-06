import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useMatch } from 'react-router-dom'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import UsersPage from './components/UsersPage'
import User from './components/User'
import LoginForm from './components/LoginForm'
import Menu from './components/Menu'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Stack, Text } from '@fluentui/react'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const matchUser = useMatch('/users/:id')
  const selectedUser = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const selectedBlog = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null

  if (user === null) {
    return (
      <Stack
        styles={{ root: { margin: '2em' } }}
        tokens={{ childrenGap: 's1' }}
      >
        <Text variant="xxLarge">Blog App</Text>
        <Text variant="xLarge">Log in to application</Text>
        <Notification />
        <LoginForm />
      </Stack>
    )
  }

  return (
    <Stack styles={{ root: { margin: '2em' } }} tokens={{ childrenGap: 's1' }}>
      <Text variant="xxLarge">Blog App</Text>
      <Menu />
      <Notification />
      <Routes>
        <Route path="/blogs/:id" element={<Blog blog={selectedBlog} />} />
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UsersPage users={users} />} />
        <Route path="/users/:id" element={<User user={selectedUser} />} />
      </Routes>
    </Stack>
  )
}

export default App
