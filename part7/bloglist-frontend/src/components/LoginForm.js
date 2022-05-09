import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import { PrimaryButton, TextField, Stack } from '@fluentui/react'

const LoginForm = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser({ username, password }))
  }

  const columnProps = {
    tokens: { childrenGap: 5 },
    styles: { root: { width: 300 } }
  }

  return (
    <form onSubmit={handleLogin}>
      <Stack {...columnProps}>
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          label="Password"
          type="password"
          canRevealPassword
          revealPasswordAriaLabel="Show password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <PrimaryButton text="Login" id="login-button" type="submit" />
      </Stack>
    </form>
  )
}

export default LoginForm
