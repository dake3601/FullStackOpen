import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import UsersPage from './components/UsersPage'
import LoginForm from './components/LoginForm'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { logoutUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

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
        <Route path="/users" element={<UsersPage />} />
        {/* <Route path="/users/:id" element={<User />} /> */}
      </Routes>
    </div>
  )
}

export default App
