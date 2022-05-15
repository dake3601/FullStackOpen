import { useState } from 'react'
import { useSubscription, useApolloClient } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(
        `New book: ${addedBook.title} by ${addedBook.author.name} added`
      )

      const genres = addedBook.genres.concat([''])
      genres.forEach((genre) => {
        const result = client.readQuery({
          query: ALL_BOOKS,
          variables: { genre },
        })

        if (!result) {
          return
        }

        client.cache.updateQuery(
          { query: ALL_BOOKS, variables: { genre } },
          ({ allBooks }) => {
            return {
              allBooks: allBooks.concat(addedBook),
            }
          }
        )
      })
    },
  })

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors show={page === 'authors'} />

        <Books show={page === 'books'} />

        <Login show={page === 'login'} setToken={setToken} setPage={setPage} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={() => setToken(null) && setPage('authors')}>
          logout
        </button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === 'recommend'} />
    </div>
  )
}

export default App
