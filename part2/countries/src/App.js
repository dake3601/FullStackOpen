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

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState([])
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [api_key, capital])

  return (
    <div>
      <h3>Weather in {capital}</h3>
      {weather?.main?.temp && <p>temperature {weather.main.temp} Celsius</p>}
      {weather?.weather && <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>}
      {weather?.wind?.speed && <p>wind {weather.wind.speed} m/s</p>}
    </div>
  )
}

const Country = ({ country }) => {
  const languages = Object.values(country.languages)
  const src = country.flags.png
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {languages.map(lang => 
          <li key={lang}>{lang}</li>)}
      </ul>
      <img src={src} alt={`Flag of ${country.name.common}`}/>
      <Weather capital={country.capital[0]}/>
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
      {filter !== '' &&
        <Countries 
          countriesToShow={countriesToShow} 
          setNewFilter={setNewFilter}
        />
      }
    </div>
  )
}

export default App
