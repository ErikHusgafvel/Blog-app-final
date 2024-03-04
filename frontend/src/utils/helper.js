const lodash = require('lodash')

const orderBlogs = (blogs) => {
  return blogs.length === 0 ? [] :
    lodash(blogs)
      .groupBy('user.id')
      .map((blogs, id) => {
        return {
          id: id,
          username: blogs[0].user.username,
          blogs: blogs.reduce((sum) => (sum + 1), 0)
        }
      })
      .value()
      .sort((a,b) => b.blogs - a.blogs)
}

const userWithBlogs = (blogs, id) => {

  if(blogs.length === 0) return { username: null, blogs: []}

  const username = blogs.find((blog) => blog.user.id === id).user.username
  const array =
    lodash(blogs)
      .filter((blog) => blog.user.id === id)
      .map((blog) => {
        const result = {}
        result.title = blog.title
        result.id = blog.id

        return result })
      .value()

  const result = {}
  result.username = username
  result.blogs = array
  return result
}


module.exports = {
  orderBlogs,
  userWithBlogs
}