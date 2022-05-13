require('dotenv').config()
const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql,
} = require('apollo-server')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // filters missing
      let books = []
      if (!args.genre && !args.author) {
        books = await Book.find({}).populate('author')
      } else if (!args.genre) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return books
        }
        books = await Book.find({ author: author._id }).populate('author')
      } else if (!args.author) {
        books = await Book.find({ genres: { $in: [args.genre] } }).populate(
          'author'
        )
      } else {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return books
        }
        books = await Book.find({
          author: author._id,
          genres: { $in: [args.genre] },
        }).populate('author')
      }
      const authorsMap = new Map()
      books.forEach((book) => authorsMap.set(book.author.name, 0))
      books.forEach((book) =>
        authorsMap.set(book.author.name, authorsMap.get(book.author.name) + 1)
      )
      for (var i = 0; i < books.length; i++) {
        books[i].author.bookCount = authorsMap.get(books[i].author.name)
      }
      return books
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({}).populate('author')
      const authorsMap = new Map()
      const authorBorn = new Map()
      authors.forEach((author) => authorBorn.set(author.name, author.born))
      authors.forEach((author) => authorsMap.set(author.name, 0))
      books.forEach((book) =>
        authorsMap.set(book.author.name, authorsMap.get(book.author.name) + 1)
      )
      return Array.from(authorsMap).map(([author, count]) => ({
        name: author,
        born: authorBorn.get(author),
        bookCount: count,
      }))
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      if (args.title.length < 2) {
        throw new UserInputError('Book title is too short', {
          invalidArgs: args.title,
        })
      }

      if (args.author.length < 4) {
        throw new UserInputError('Book author name is too short', {
          invalidArgs: args.author,
        })
      }

      const books = await Book.find({})
      if (books.find((b) => b.title === args.title)) {
        throw new UserInputError('Title must be unique', {
          invalidArgs: args.title,
        })
      }

      const authors = await Author.find({})
      const authorsNames = authors.map((authors) => authors.name)
      if (!authorsNames.includes(args.author)) {
        const author = new Author({ name: args.author })
        await author.save()
      }

      const author = await Author.findOne({ name: args.author })

      const book = new Book({ ...args, author: author._id })
      await book.save()
      await book.populate('author')

      const bookCount = books.reduce(
        (prev, currBook) =>
          prev + (currBook.author.toString() === author._id.toString()),
        0
      )

      book.author.bookCount = 1 + bookCount
      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      await author.save()
      const books = await Book.find({})
      author.bookCount = books.reduce(
        (prev, currBook) =>
          prev + (currBook.author.toString() === author._id.toString()),
        0
      )
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
