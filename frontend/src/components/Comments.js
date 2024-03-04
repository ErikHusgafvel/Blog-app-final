import React from "react"
import CommentForm from "./NewComment"

import {
  List,
  ListItem,
  ListItemText
} from "@mui/material"

const Comments = ({ comments, createComment, id }) => (
      <div>
        <h3>comments</h3>
        <CommentForm id={id} createComment={createComment}/>
          <List dense={true} sx={{ listStyleType: 'disc', pl: 2 }}>
              {comments.map(comment =>
              <ListItem key={comment.id} sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={comment.comment} />
              </ListItem>
              )}
          </List>
      </div>
    )

export default Comments