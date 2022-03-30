import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, remove, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    whiteSpace: 'pre-wrap'
  }

  const likeBlog = () => {
    updateBlog(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    })
  }

  const removeBlog = () => {
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='blogHide'>
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='blogShow'>
        {blog.title} <button onClick={toggleVisibility}>hide</button> {'\n'}
        {blog.url} {'\n'}
        likes {blog.likes} <button onClick={likeBlog}>like</button> {'\n'}
        {blog.author}
        {remove && <button onClick={removeBlog}>remove</button>}
      </div>
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func,
  remove: PropTypes.bool,
  deleteBlog: PropTypes.func
}

export default Blog
