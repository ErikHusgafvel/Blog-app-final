import React from "react"
import PropTypes from "prop-types"
import Comments from "./Comments"

import {
  Link, Button } from "@mui/material"

const Blog = ({ blog, like, canRemove, remove, createComment }) => {
  if (!blog) return null

  return (
    <div className="blog">
      <h2>{blog.title} {blog.author}</h2>
        <div>
          <div>
            <Link href={blog.url}> {blog.url}</Link>
          </div>
          <div>
            {blog.likes} likes <Button onClick={like} variant="outlined" size="small">like</Button>
          </div>
          <div> added by {blog.user.name ? blog.user.name : <em> unknown </em>} {canRemove && <Button onClick={remove} variant="outlined" size="small" >delete</Button>}</div>
        </div>
        <Comments comments={blog.comments} createComment={createComment} id={blog.id}/>
    </div>
  )
}

Blog.propTypes = {
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  canRemove: PropTypes.bool,
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
  }),
}

export default Blog
