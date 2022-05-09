import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Stack, CommandBarButton } from '@fluentui/react'
import { logoutUser } from '../reducers/userReducer'

const Menu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.user)

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  const menuProps = {
    items: [
      {
        key: 'logout',
        text: 'Logout',
        onClick: handleLogout
      }
    ]
  }

  return (
    <Stack
      horizontal
      styles={{ root: { height: 44 } }}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <CommandBarButton text="Blogs" onClick={() => navigate('/')} />
      <CommandBarButton text="Users" onClick={() => navigate('/users')} />
      <CommandBarButton
        text={`${user.username} logged in`}
        menuProps={menuProps}
      />
    </Stack>
  )
}

export default Menu
