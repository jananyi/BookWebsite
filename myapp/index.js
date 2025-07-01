const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
const dbPath = path.join(__dirname, 'goodreads.db')

let db = null

app.use(express.json())

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// ✅ GET all books
app.get('/books/', async (request, response) => {
  const getBooksQuery = `SELECT * FROM book ORDER BY book_id;`
  const booksArray = await db.all(getBooksQuery)
  response.send(booksArray)
})

// ✅ GET single book by ID
app.get('/books/:bookId/', async (request, response) => {
  const {bookId} = request.params
  const getBookQuery = `SELECT * FROM book WHERE book_id = ${bookId};`
  const book = await db.get(getBookQuery)
  response.send(book)
})

// ✅ POST a new book
app.post('/books/', async (request, response) => {
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = request.body

  const addBookQuery = `
    INSERT INTO book 
      (title, author_id, rating, rating_count, review_count, description, pages, date_of_publication, edition_language, price, online_stores)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `

  const dbResponse = await db.run(addBookQuery, [
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  ])

  const bookId = dbResponse.lastID
  response.send({bookId})
})

// ✅ PUT (not POST) to update a book
app.put('/books/:bookId/', async (request, response) => {
  const {bookId} = request.params
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = request.body

  const updateBookQuery = `
    UPDATE book
    SET
      title = ?,
      author_id = ?,
      rating = ?,
      rating_count = ?,
      review_count = ?,
      description = ?,
      pages = ?,
      date_of_publication = ?,
      edition_language = ?,
      price = ?,
      online_stores = ?
    WHERE
      book_id = ?;
  `

  await db.run(updateBookQuery, [
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
    bookId,
  ])

  response.send('Book details are updated')
})

// ✅ DELETE book
app.delete('/books/:bookId/', async (request, response) => {
  const {bookId} = request.params
  const deleteBookQuery = `DELETE FROM book WHERE book_id = ?;`
  await db.run(deleteBookQuery, [bookId])
  response.send('Successfully deleted')
})

// ✅ GET all books by author
app.get('/authors/:authorId/books/', async (request, response) => {
  const {authorId} = request.params
  const getAuthorBooksQuery = `SELECT * FROM book WHERE author_id = ?;`
  const authorBooks = await db.all(getAuthorBooksQuery, [authorId])
  response.send(authorBooks)
})
