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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
