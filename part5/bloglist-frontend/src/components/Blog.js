import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
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
      likes: blog.likes + 1,
    })
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} by {blog.author} 
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} <button onClick={toggleVisibility}>hide</button> {'\n'}
        {blog.url} {'\n'}
        likes {blog.likes} <button onClick={likeBlog}>like</button> {'\n'}
        {blog.author}
      </div>
    </div>
)}

export default Blog
