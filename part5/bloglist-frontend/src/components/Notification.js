const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const { info, succeed } = message

  const style = {
    color: succeed ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {info}
    </div>
  )
}

export default Notification
