import React from "react"
import { Link } from "react-router-dom"

import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from "@mui/material"
import AdbIcon from "@mui/icons-material/Adb"

const NavigationBar = ({ logout, user }) => (
  <div id="navigation-bar">
    <AppBar position="static">
      <Toolbar>
        <AdbIcon
            fontSize="small"
            sx={{ mr: 1 }}
          />
        <Typography component="div" sx={{ mr: 1 }}>
          BLOG APP
          </Typography>
        <Button color="inherit" component={Link} to="/">
          home
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Typography component="div" sx={{ flexGrow: 1 }}/>
        <Typography component="em">
          {user.name} logged in
          </Typography>
        <Button color="inherit" onClick={logout}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
  </div>
)

export default NavigationBar