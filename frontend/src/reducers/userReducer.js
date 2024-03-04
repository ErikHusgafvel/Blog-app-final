import { createSlice } from '@reduxjs/toolkit'
import storageService from '../services/storage'

const userSlice = createSlice({
  name: 'users',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUserState() {
      return null
    }
  }
})

export const { setUser, clearUserState } = userSlice.actions

export const initializeUser = () => {
  return dispatch => {
    const user = storageService.loadUser()
    dispatch(setUser(user))
  }
}

export const saveUser = (user) => {
  return dispatch => {
    storageService.saveUser(user)
    dispatch(setUser(user))
  }
}

export const removeUser = () => {
  return dispatch => {
    storageService.removeUser()
    dispatch(clearUserState())
  }
}

export default userSlice.reducer