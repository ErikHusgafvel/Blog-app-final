import React from "react"
import { Link } from "react-router-dom"

import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from "@mui/material"

const helper = require("../utils/helper")

const Users = ({ blogs }) => {
  const userList = helper.orderBlogs(blogs)
  const maxNameWidth = Math.max(...userList.map(user => user.username.length))
  const BlogsWidth = Math.max(...userList.map(user => user.blogs.length))
  const maxBlogsWidth = BlogsWidth > "blogs created".length ? BlogsWidth : "blogs created".length

  return (
  <div>
    <h2>Users</h2>
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableBody>
          <TableRow className="users-header-row">
            <TableCell style={{width:`${maxNameWidth}ch`}}></TableCell>
            <TableCell style={{width:`${maxBlogsWidth}ch`}}>blogs created</TableCell>
          </TableRow>
          {userList.map(user =>
          <TableRow className="users" key={user.id}>
            <TableCell style={{width:`${maxNameWidth}ch`}}><Link to={`/users/${user.id}`}>{user.username}</Link></TableCell>
            <TableCell style={{width:`${maxBlogsWidth}ch`}}>{user.blogs}</TableCell>
          </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  )
}

export default Users