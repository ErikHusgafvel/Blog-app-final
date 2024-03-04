import React from "react"
import Togglable from "./Togglable"
import NewBlog from "./NewBlog"
import Blogs from "./Blogs"

const Home = ({ blogFormRef, createBlog, blogs }) => {
  return (
  <div>
    <h2>Blogs</h2>
    <Togglable buttonLabel="create new" ref={blogFormRef}>
      <NewBlog createBlog={createBlog} />
    </Togglable>
    <Blogs blogs={blogs} />
  </div>
  )
}

export default Home