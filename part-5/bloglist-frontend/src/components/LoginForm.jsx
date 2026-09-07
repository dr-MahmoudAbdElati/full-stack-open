import Notification from './Notification'

const LoginForm = ({
  handleLogin,
  notification,
  setNotification,
  username,
  setUsername,
  password,
  setPassword,
}) => {

  return (
    <>
      <h2>log in to application</h2>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <form onSubmit={handleLogin}>
        <div>
          <label>
          username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
          password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm