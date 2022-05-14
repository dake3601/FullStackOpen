import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { ME, ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const resultMe = useQuery(ME)

  useEffect(() => {
    if (resultMe.data) {
      const genre = resultMe.data.me.favoriteGenre
      setGenre(genre)
    }
  }, [resultMe.data]) // eslint-disable-line

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  })

  if (!props.show) {
    return null
  }

  if (resultMe.loading || result.loading) {
    return (
      <div>
        <h2>Recommendations</h2>
        loading...
      </div>
    )
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>Recommendations</h2>
      <p>books in your favorite genre {genre}</p>
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
    </div>
  )
}

export default Books
