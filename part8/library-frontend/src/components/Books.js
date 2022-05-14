import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  })

  useEffect(() => {
    if (result.data && !genre) {
      const books = result.data.allBooks
      const genreSet = new Set()
      books.forEach((book) =>
        book.genres.forEach((genre) => genreSet.add(genre))
      )
      setGenres([...genreSet])
    }
  }, [result.data]) // eslint-disable-line

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

  return (
    <div>
      <h2>books</h2>
      <p>
        {!genre ? (
          <>
            in <b>all</b> genres
          </>
        ) : (
          <>
            in genre <b>{genre}</b>
          </>
        )}
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setGenre(null)}>all</button>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
    </div>
  )
}

export default Books
