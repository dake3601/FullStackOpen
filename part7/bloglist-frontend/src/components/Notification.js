import { connect } from 'react-redux'
import { MessageBar, MessageBarType } from '@fluentui/react'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const { message, succeed } = notification

  const messageBarType = succeed ? MessageBarType.success : MessageBarType.error

  return (
    <MessageBar messageBarType={messageBarType} isMultiline={false}>
      {message}
    </MessageBar>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotifications = connect(mapStateToProps)(Notification)
export default ConnectedNotifications
