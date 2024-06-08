const getBooks = "SELECT * FROM book;";
const getBookById = "SELECT * FROM book WHERE book_id = $1;";
//const addBook = " BEGIN; SAVEPOINT before_insert; INSERT INTO book (book_id, title, description, release_year, language_id, original_language_id, price, last_update, special_features, fulltext) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10); ROLLBACK TO SAVEPOINT before_insert; COMMIT; Returning *;";
const addBookWriter =
  " INSERT INTO book_writer (writer_id, book_id) VALUES ($1, $2) RETURNING *;";

const deleteBookByID = "DELETE FROM book WHERE book_id = $1;";
const deleteBookWriterByBook = "DELETE FROM book_writer WHERE book_id = $1;";
const updateBookPrice =
  "UPDATE book SET price = $2 WHERE book_id = $1 RETURNING *;";
const wishlistBook =
  "INSERT INTO wishlist_item (book_id, customer_id) VALUES ($1, $2) RETURNING *;";
const unWishlistBook =
  "DELETE FROM wishlist_item WHERE book_id = $1 AND customer_id = $2;";

module.exports = {
  getBooks,
  getBookById,
  addBookWriter,
  deleteBookByID,
  deleteBookWriterByBook,
  updateBookPrice,
  wishlistBook,
  unWishlistBook,
};
