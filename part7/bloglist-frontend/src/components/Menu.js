import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../reducers/userReducer'

const Menu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.user)

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  const padding = {
    paddingRight: 5,
    display: 'inline'
  }

  const menu = {
    backgroundColor: 'lightgray'
  }

  return (
    <div style={menu}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      <div style={padding}>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  )
}

export default Menu
