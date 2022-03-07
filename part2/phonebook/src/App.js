import { useEffect, useState } from 'react'
import axios from 'axios'
import entriesService from './services/entries'

const Filter = ({ filter, handleFilterChange}) => (
  <form>
    <div>
      filter shown with: <input 
              value={filter}
              onChange={handleFilterChange}
            />
    </div>
  </form>
)

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handlePhoneChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input 
              value={newName}
              onChange={handleNameChange}
            />
    </div>
    <div>
      number: <input 
                value={newNumber}
                onChange={handlePhoneChange}
              />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ( { person } ) => <li>{person.name} {person.number}</li>

const Persons = ({ personsToShow }) => (
  <ul>
    {personsToShow.map((person) => <Person key={person.name} person={person}/>)}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('');

  useEffect(() => {
    entriesService
      .getAll()
      .then(initialEntries => {
        setPersons(initialEntries)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    }

    const repeat = persons.reduce((s, p) => s || personObject.name === p.name, false)

    if (repeat) {
      window.alert(`${newName} is already added to phonebook`)
      return 
    } 

    entriesService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = filter === '' 
                        ? persons 
                        : persons.filter(({ name }) => 
                            name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange}

      />
      <h2>Add a New Entry</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <Persons 
        personsToShow={personsToShow} 
      />
    </div>
  )
}

export default App
