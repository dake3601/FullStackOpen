import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
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

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  const match = useMatch('/users/:id')
  const selectedUser = match
    ? users.find((user) => user.id === match.params.id)
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
        {/* <Route path="/blog/:id" element={<BlogPage blog={blog} />} /> */}
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UsersPage users={users} />} />
        <Route path="/users/:id" element={<User user={selectedUser} />} />
      </Routes>
    </div>
  )
}

export default App
