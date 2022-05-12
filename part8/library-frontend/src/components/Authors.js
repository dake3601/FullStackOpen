import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const submit = async (event) => {
    event.preventDefault()

    if (!name) {
      return
    }

    editAuthor({
      variables: { name: name.label, setBornTo: Number(born) },
    })

    setName('')
    setBorn('')
  }

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return (
      <div>
        <h2>authors</h2>
        loading...
      </div>
    )
  }

  const authors = result.data.allAuthors

  const options = result.data.allAuthors.map((author) => ({
    label: author.name,
  }))

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <Select
          value={name}
          onChange={(selectedOption) => setName(selectedOption)}
          options={options}
        />
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
