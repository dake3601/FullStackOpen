import { connect } from 'react-redux'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const { message, succeed } = notification

  const style = {
    color: succeed ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return <div style={style}>{message}</div>
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    notification: state.notification
  }
}

const ConnectedNotifications = connect(mapStateToProps)(Notification)
export default ConnectedNotifications
