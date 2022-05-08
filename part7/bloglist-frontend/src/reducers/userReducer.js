import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const initializeUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  return async (dispatch) => {
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }
}

export const loginUser = ({ username, password }) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch(setUser(user))
      blogService.setToken(user.token)
      dispatch(setNotification('Login Successful', 5, true))
    } catch (e) {
      dispatch(setNotification('wrong username or password', 5, false))
    }
  }
}

export const logoutUser = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  return async (dispatch) => {
    dispatch(setUser(null))
    blogService.setToken(null)
  }
}

export const { setUser } = userSlice.actions
export default userSlice.reducer
