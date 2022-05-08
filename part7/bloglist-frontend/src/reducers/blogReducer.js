import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

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
    dispatch(appendBlog(newBlog))
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
    await blogService.remove(id)
    dispatch(deleteBlog(id))
  }
}

export const { updateBlog, appendBlog, setBlogs, deleteBlog } =
  blogSlice.actions
export default blogSlice.reducer
