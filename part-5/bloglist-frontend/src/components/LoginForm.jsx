import { Button, TextField } from '@mui/material'

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <>
      <h2>Log in to application</h2>

      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            variant="standard"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          LOGIN
        </Button>
      </form>
    </>
  )
}

export default LoginForm
