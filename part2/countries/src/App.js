import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange}) => (
  <form>
    <div>
      find countries: <input 
              value={filter}
              onChange={handleFilterChange}
            />
    </div>
  </form>
)

const Country = ({ country }) => {
  const languages = Object.values(country.languages)
  const src = country.flags.png
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {languages.map(lang => 
          <li key={lang}>{lang}</li>)}
      </ul>
      <img src={src} alt={`Flag of ${country.name.common}`}/>
    </div>
  )
}

const Countries = ({ countriesToShow, setNewFilter }) => {
  if (countriesToShow.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countriesToShow.length === 1) {
    const country = countriesToShow[0]
    return (
      <Country country={country}/>
    )
  } else {
    return (
      <ul>
        {countriesToShow.map(({ name }) =>
          <li key={name.common}>
            {name.common}
            <button onClick={() => setNewFilter(name.common)}>
              show
            </button>
          </li>
          )
        }
      </ul>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const countriesToShow = filter === '' 
                        ? countries 
                        : countries.filter(({ name }) => 
                            name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Countries</h1>
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange}

      />
      { filter !== '' &&
        <Countries 
          countriesToShow={countriesToShow} 
          setNewFilter={setNewFilter}
        />
      }
    </div>
  )
}

export default App
