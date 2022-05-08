import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    createNotification(_, action) {
      return action.payload
    },
    removeNotification() {
      return null
    }
  }
})

let timeoutID = null

export const setNotification = (message, time, succeed) => {
  return async (dispatch) => {
    const notification = {
      message,
      succeed
    }
    dispatch(createNotification(notification))
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      dispatch(removeNotification())
    }, time * 1000)
  }
}

export const { createNotification, removeNotification } =
  notificationSlice.actions
export default notificationSlice.reducer
