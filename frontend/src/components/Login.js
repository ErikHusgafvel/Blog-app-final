import { React, useState } from "react"
import {
  TextField,
  Button
} from "@mui/material"

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login(username, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TextField
          required
          id="username"
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          required
          id="password"
          type="password"
          label="password"
          autoComplete="current-password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button id="login-button" variant="contained" /* color="primary" */ type="submit">
        login
      </Button>
    </form>
  )
}

export default LoginForm
