import { useState, useImperativeHandle, forwardRef } from 'react'
import { DefaultButton, PrimaryButton } from '@fluentui/react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <PrimaryButton text={props.buttonLabel} onClick={toggleVisibility} />
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <DefaultButton
          style={{ marginTop: 5 }}
          text="cancel"
          onClick={toggleVisibility}
        />
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
