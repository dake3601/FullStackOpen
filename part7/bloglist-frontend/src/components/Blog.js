import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { Text, Stack, DefaultButton, IconButton, Link } from '@fluentui/react'

import Comments from './Comments'

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
    <Stack tokens={{ childrenGap: 's1' }}>
      <Text variant="xLarge">
        {blog.title} by {blog.author}
      </Text>
      <Stack tokens={{ childrenGap: 's1' }}>
        <Link href={blog.url}>{blog.url}</Link>
        <Text variant="medium">
          {blog.likes} likes{' '}
          <IconButton
            iconProps={{ iconName: 'Like' }}
            title="Like"
            onClick={handleLike}
          />
        </Text>
        <Text variant="medium">Added by: {blog.user.name}</Text>
        <Text variant="medium">
          {isAuthor && (
            <DefaultButton
              text="remove"
              onClick={handleRemove}
              styles={{ root: { height: '2.3em' } }}
            />
          )}
        </Text>
      </Stack>
      <Comments blog={blog} />
    </Stack>
  )
}

export default Blog
