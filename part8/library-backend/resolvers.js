require('dotenv').config()
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        query.author = author._id
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }
      const books = await Book.find(query).populate('author')
      books.forEach((book) => {
        book.author.bookCount = book.author.books.length
      })
      return books
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map((author) => ({
        name: author.name,
        bookCount: author.books.length,
        books: null,
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

      const duplicated = await Book.findOne({ title: args.title })
      if (duplicated) {
        throw new UserInputError('Title must be unique', {
          invalidArgs: args.title,
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
      }
      await author.save()

      const book = new Book({ ...args, author: author._id })
      await book.save()
      author.books.push(book._id)
      await author.save()
      author.bookCount = author.books.length
      book.author = author

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

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
      author.bookCount = author.books.length
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
