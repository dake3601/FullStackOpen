import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      return state.map((blog) =>
        blog.id !== action.payload.id ? blog : action.payload
      )
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    deleteBlog(state, action) {
      return state.filter((b) => b.id !== action.payload)
    }
  }
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const notes = await blogService.getAll()
    dispatch(setBlogs(notes))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    const blog = await blogService.getById(newBlog.id)
    dispatch(appendBlog(blog))
    dispatch(
      setNotification(
        `A new blog ${blog.title} by ${blog.author} added`,
        5,
        true
      )
    )
  }
}

export const likeBlog = (blog) => {
  const id = blog.id
  const updatedBlog = { ...blog, likes: blog.likes + 1 }
  return async (dispatch) => {
    const votedBlog = await blogService.update(id, updatedBlog)
    dispatch(updateBlog(votedBlog))
  }
}

export const removeBlog = (blog) => {
  const id = blog.id
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch(deleteBlog(id))
    } catch (e) {
      dispatch(
        setNotification(
          `Information of ${blog.title} has already been removed from server`,
          5,
          false
        )
      )
    }
  }
}

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    await blogService.comment(id, comment)
    const blog = await blogService.getById(id)
    dispatch(updateBlog(blog))
    dispatch(setNotification('New comment added', 3, true))
  }
}

export const { updateBlog, appendBlog, setBlogs, deleteBlog } =
  blogSlice.actions
export default blogSlice.reducer
