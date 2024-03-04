import blogReducer from './blogReducer'
import deepFreeze from 'deep-freeze'

describe('blogReducer', () => {

  const initialState = [{name: "blog1"}, {name: "blog2"}]

  test('returns new state with action blogs/setBlogs', () => {
    const state = []
    const action = {
      type: 'blogs/setBlogs',
      payload: initialState
    }

    deepFreeze(state)
    const newState = blogReducer(state, action)

    expect(newState).toEqual([...action.payload])
  })

  test('adds new blog to state with blogs/appendBlogs', () => {
    const state = initialState
    const action = {
      type: 'blogs/appendBlogs',
      payload: {
        name: "a new blog object"
      }
    }

    deepFreeze(state)
    const newState = blogReducer(state, action)
    expect(newState).toHaveLength(3)
    expect(newState).toContain(action.payload)
  })
})
