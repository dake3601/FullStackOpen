import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import UsersPage from './components/UsersPage'
import User from './components/User'
import LoginForm from './components/LoginForm'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { logoutUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

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
      <div>
        <h1>Blog App</h1>
        <h2>Log in to application</h2>
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <h1>Blog App</h1>
      <Notification />
      <div>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      {/* <Menu /> */}
      <Routes>
        <Route path="/blogs/:id" element={<Blog blog={selectedBlog} />} />
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UsersPage users={users} />} />
        <Route path="/users/:id" element={<User user={selectedUser} />} />
      </Routes>
    </div>
  )
}

export default App
