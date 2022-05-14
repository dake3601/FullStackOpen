import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState(null)

  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return (
      <div>
        <h2>books</h2>
        loading...
      </div>
    )
  }

  const books = result.data.allBooks

  const genreSet = new Set()

  books.forEach((book) => book.genres.forEach((genre) => genreSet.add(genre)))

  const booksToShow = !genreFilter
    ? books
    : books.filter((book) => book.genres.includes(genreFilter))

  return (
    <div>
      <h2>books</h2>
      <p>{!genreFilter ? 'in all genres' : `in genre ${genreFilter}`}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setGenreFilter(null)}>all</button>
      {[...genreSet].map((genre) => (
        <button key={genre} onClick={() => setGenreFilter(genre)}>
          {genre}
        </button>
      ))}
    </div>
  )
}

export default Books
