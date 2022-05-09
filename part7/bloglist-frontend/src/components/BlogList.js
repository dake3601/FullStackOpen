import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { createBlog } from '../reducers/blogReducer'
import { Stack, List, getTheme, mergeStyleSets, Link } from '@fluentui/react'

const theme = getTheme()
const { semanticColors, fonts } = theme

const classNames = mergeStyleSets({
  itemCell: {
    minHeight: 30,
    padding: 10,
    boxSizing: 'border-box',
    border: `1px solid ${semanticColors.bodyDivider}`,
    display: 'flex',
    overflow: 'hidden',
    flexGrow: 1,
    marginBottom: 5,
    whiteSpace: 'pre-wrap'
  },
  itemName: [
    fonts.medium,
    {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  ]
})

const BlogList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const blogs = useSelector((state) => state.blogs)

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const onRenderCell = (item) => {
    return (
      <div className={classNames.itemCell}>
        <Link
          className={classNames.itemName}
          onClick={() => navigate(`/blogs/${item.id}`)}
        >
          {item.title}
        </Link>
      </div>
    )
  }

  return (
    <Stack tokens={{ childrenGap: 'm' }}>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <List items={sortedBlogs} onRenderCell={onRenderCell} />
    </Stack>
  )
}

export default BlogList
