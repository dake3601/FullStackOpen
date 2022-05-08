import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog } from '../reducers/blogReducer'

const Blog = ({ blog, remove, deleteBlog }) => {
  const dispatch = useDispatch()
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

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const removeBlog = () => {
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible} className="blogHide">
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="blogShow">
        {blog.title} <button onClick={toggleVisibility}>hide</button> {'\n'}
        {blog.url} {'\n'}
        likes {blog.likes} <button onClick={handleLike}>like</button> {'\n'}
        {blog.author}
        {remove && <button onClick={removeBlog}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
