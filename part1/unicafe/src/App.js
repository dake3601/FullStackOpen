import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={'good'} onClick={() => setGood(good + 1)}/>
      <Button text={'neutral'} onClick={() => setNeutral(neutral + 1)}/>
      <Button text={'bad'} onClick={() => setBad(bad + 1)}/>
      <h1>statistics</h1>
      <p>good {good} </p>
      <p>neutral {neutral} </p>
      <p>bad {bad} </p>
      <p>all {good-bad} </p>
      <p>average {(good-bad)/total || 0} </p>
      <p>positive {100 * good/total || 0} % </p>
    </div>
  )
}

export default App
