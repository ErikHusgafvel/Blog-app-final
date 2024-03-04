import { React, useState } from "react"

import { TextField, Button } from "@mui/material"

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    await createBlog({ title, author, url })
  }

  return (
    <div>
      <h3>Create a new blog</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="title"
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            id="author"
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            id="url"
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button variant="outlined" type="submit">create</Button>
      </form>
    </div>
  )
}

export default BlogForm
