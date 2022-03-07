import { useEffect, useState } from 'react'
import entriesService from './services/entries'
import Notification from './components/Notification'

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

const Person = ( { person, deletePerson } ) => (
  <li>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person)}>
      delete
    </button>
  </li>
)
const Persons = ({ personsToShow, deletePerson }) => (
  <ul>
    {personsToShow.map((person) => 
      <Person 
        key={person.name} 
        person={person}
        deletePerson={deletePerson}
      />)}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('');
  const [message, setMessage] = useState(null)

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

    if (!repeat) {
      entriesService
      .create(personObject)
      .then(returnedPerson => {
        setMessage({
          info: `Added ${newName}`, 
          succeed: true
        })
        setTimeout(() => {
          setMessage(null)
        }, 3000)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      return 
    } 
    
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const person = persons.find(p => p.name === newName)
      const id = person.id
      const changedPerson = { ...person, number: newNumber }

      entriesService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          setMessage({
            info: `Changed ${newName}`, 
            succeed: true
          })
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessage({
            info: `Information of ${person.name} has already been removed from server`,
            succeed: false
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
          setNewName('')
          setNewNumber('')
        })
      }
  }
  
  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      const deletedPerson = persons.filter(p => p.id !== person.id)
      entriesService.remove(person.id)
      .then(() => {
        setPersons(deletedPerson)
      })
      .catch(error => {
        setMessage({
          info: `Information of ${person.name} has already been removed from server`,
          succeed: false
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(deletedPerson)
      })
  }
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
      <Notification message={message} />
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
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
