import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { createBlog, removeBlog } from '../reducers/blogReducer'

const BlogList = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog))
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
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
            isAuthor={user && blog.user.username === user.username}
            deleteBlog={deleteBlog}
          />
        ))}
      </div>
    </div>
  )
}

export default BlogList
