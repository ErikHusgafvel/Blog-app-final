import { React, useState} from "react"

import {
  TextField,
  Button
} from "@mui/material"

const CommentForm = ({ id, createComment }) => {
  const [comment, setComment] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    await createComment(id, comment)
    setComment("")
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div display="container">
          <TextField
            size="small"
            id="comment"
            label="add a new comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button type="submit">add comment</Button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm