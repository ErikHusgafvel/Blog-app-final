import { React } from 'react'
import { Link } from "react-router-dom"

import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from "@mui/material"

const Blogs = ({ blogs }) => {

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
          {[...blogs].sort(byLikes).map(blog =>
            <TableRow key={blog.id}>
              <TableCell>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
              <TableCell>
              {blog.author}
              </TableCell>
            </TableRow>
          )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Blogs