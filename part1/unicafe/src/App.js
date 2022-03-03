import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = ({text, value}) => {
  const sign = text === 'positive' ? '%' : ''
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {sign}</td>
    </tr>
  )
}

// a proper place to define a component
const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  if (total === 0) 
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  else 
    return (
      <div> 
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticLine text="good" value ={good} />
            <StatisticLine text="neutral" value ={neutral} />
            <StatisticLine text="bad" value ={bad} />
            <StatisticLine text="all" value ={good-bad} />
            <StatisticLine text="average" value ={(good-bad)/total} />
            <StatisticLine text="positive" value ={100 * good/total} />
          </tbody>
        </table>
      </div>
    )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={'good'} onClick={() => setGood(good + 1)}/>
      <Button text={'neutral'} onClick={() => setNeutral(neutral + 1)}/>
      <Button text={'bad'} onClick={() => setBad(bad + 1)}/>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
