import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { createBlog } from '../reducers/blogReducer'

const BlogList = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog({ blogObject, user }))
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    whiteSpace: 'pre-wrap'
  }

  return (
    <div>
      <br />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br />
      <div id="blogs">
        {sortedBlogs.map((blog) => (
          <div key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogList
