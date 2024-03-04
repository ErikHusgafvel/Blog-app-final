import React from "react"

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@mui/material"
import FolderIcon from "@mui/icons-material/Folder"

const User = ({ userWithBlogs }) => {
  if(!userWithBlogs) {
    return null
  }

  return (
    <div>
      <h2>{userWithBlogs.username}</h2>
      <h4>added blogs</h4>
      <List dense={true}>
          {userWithBlogs.blogs.map(blog =>
            <ListItem key={blog.id}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary={blog.title}
              />
            </ListItem>)}
      </List>
    </div>
  )
}

export default User