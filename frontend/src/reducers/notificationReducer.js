import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [null, null, null],
  reducers: {
    invokeNotification(state, action) {
      const { message, type, timeoutID } = action.payload
      clearTimeout(state[2])
      return [message, type, timeoutID]
    },
    deprecateNotification(state, action) { // eslint-disable-line no-unused-vars
      return [null, null, state[2]]
    }
  }
})

export const { invokeNotification, deprecateNotification } = notificationSlice.actions

export const setNotification = (message, type='info', seconds) => {
  return dispatch => {
    const timeoutID = setTimeout(() => {
      dispatch(deprecateNotification())
    }, seconds * 1000)
    dispatch(invokeNotification({ message, type, timeoutID }))
  }
}

export default notificationSlice.reducer