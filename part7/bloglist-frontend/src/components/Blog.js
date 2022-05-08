import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { likeBlog, removeBlog } from '../reducers/blogReducer'

const Comments = ({ comments }) => {
  if (comments.length === 0) {
    return null
  }

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.comment}</li>
        ))}
      </ul>
    </div>
  )
}

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
      <Comments comments={blog.comments} />
    </div>
  )
}

export default Blog
