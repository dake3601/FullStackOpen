import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Initial Notification'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return null
    },
  },
})

export default notificationSlice.reducer
