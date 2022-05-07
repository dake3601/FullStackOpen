import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const blogFormRef = useRef()

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setMessage({
        info: 'Login Successful',
        succeed: true
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({
        info: 'wrong username or password',
        succeed: false
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      setMessage({
        info: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        succeed: true
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const likeBlog = (id, blogObject) => {
    const likedBlog = blogs.map((blog) => ({
      ...blog,
      likes: blog.likes + (blog.id === id)
    }))
    blogService.update(id, blogObject).then(() => {
      setBlogs(likedBlog)
    })
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      const removedBlog = blogs.filter((b) => b.id !== blog.id)
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(removedBlog)
        })
        .catch(() => {
          setMessage({
            info: `Information of ${blog.title} has already been removed from server`,
            succeed: false
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setBlogs(removedBlog)
        })
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username:
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password:
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br />
      <div id="blogs">
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={likeBlog}
            remove={blog.user && blog.user.username === user.username}
            deleteBlog={removeBlog}
          />
        ))}
      </div>
    </div>
  )
}

export default App
