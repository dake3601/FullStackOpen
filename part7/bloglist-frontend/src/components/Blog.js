import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { likeBlog, removeBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  if (!user || !blog) {
    return null
  }

  const isAuthor = blog.user.username === user.username

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog))
      navigate('/')
    }
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href="blog.url">{blog.url}</a>
        <p>
          {blog.likes} likes <button onClick={handleLike}>like</button> {'\n'}
        </p>
        <p>Added by: {blog.user.name}</p>
        <p>{isAuthor && <button onClick={handleRemove}>remove</button>}</p>
      </div>
    </div>
  )
}

export default Blog
