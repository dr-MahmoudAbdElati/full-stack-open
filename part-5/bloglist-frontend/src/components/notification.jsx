import { Alert } from '@mui/material'

export default function Notification({ notification, setNotification }) {
  if (!notification) return null

  setTimeout(() => {
    setNotification(null)
  }, 4000)

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.type}
    >
      {notification.message}
    </Alert>
  )
}
