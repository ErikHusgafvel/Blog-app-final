import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './notificationReducer';
import blogReducer from './blogReducer';
import userReducer from './userReducer';

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    blogs: blogReducer,
    users: userReducer,
  },
});

export default store;
