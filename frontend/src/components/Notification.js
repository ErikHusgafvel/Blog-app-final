import { useSelector } from "react-redux"
import React from "react"
import { Alert } from "@mui/material"

const Notification = () => {
  const notification = useSelector(state => state.notifications) //[message, type, timeoutID]

  return (
    <div>
      {notification[0] &&
      <Alert severity={notification[1] === "error" ? "error" : "success"}>
        {notification[0]}
      </Alert>}
    </div>
  )
}

export default Notification