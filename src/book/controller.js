const pool = require("../../db");
const queries = require("./queries");

// GET ALL BOOKS IN THE DATABASE
const getBooks = async (req, res) => {
  const random = req.body.random;
  const client = await pool.connect();
  try {
    const results = await client.query(queries.getBooks);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// pool.query(queries.getBooks, (error, results) => {
//   if (error) {
//     throw error;
//   }
//   res.status(200).json(results.rows);
// });

// GET BOOK BY BOOK ID
const getBookById = async (req, res) => {
  const id = parseInt(req.params.id);
  const client = await pool.connect();
  try {
    const results = await client.query(queries.getBookById, [id]);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// ADD A BOOK TO WRITER
const addBookWriter = async (req, res) => {
  const { writer_id, book_id } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SAVEPOINT before_insert"); // savepoint before insert
    const result = await client.query(queries.addBookWriter, [
      writer_id,
      book_id,
    ]);
    await client.query("COMMIT"); // commit if success
    res.status(201).json({ message: "Book added to writer" });
  } catch (error) {
    await client.query("ROLLBACK TO SAVEPOINT before_insert"); // rollback if error
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
  //const results = await pool.query(queries.addBookWriter, [writer_id, book_id]);
};

// DELETE A BOOK
const deleteBookByID = async (req, res) => {
  const book_id = parseInt(req.params.id);

  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Start transaction
    await client.query("SAVEPOINT before_insert"); // savepoint before insert

    //Check if the book exists
    const existenceResult = await client.query(queries.getBookById, [book_id]);

    if (existenceResult.rowCount === 0) {
      await client.query("ROLLBACK"); // Rollback transaction
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete the book
    await client.query(queries.deleteBookWriterByBook, [book_id]);
    await client.query(queries.deleteBookByID, [book_id]);

    await client.query("COMMIT"); // Commit transaction
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK TO SAVEPOINT before_insert"); // rollback if error
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release(); // Release the client
  }
};

// DELETE A BOOK BY QUERY

const wishlistBook = async (req, res) => {
  const book_id = parseInt(req.params.book_id);
  const customer_id = parseInt(req.params.customer_id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SAVEPOINT before_insert"); // savepoint before insert
    const existenceResult = await client.query(queries.getBookById, [book_id]);

    if (existenceResult.rowCount === 0) {
      await client.query("ROLLBACK"); // Rollback transaction
      return res.status(404).json({ error: "Book not found" });
    }

    const result = await client.query(queries.wishlistBook, [
      book_id,
      customer_id,
    ]);
    await client.query("COMMIT"); // commit if success
    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
    await client.query("ROLLBACK TO SAVEPOINT before_insert"); // rollback if error
  } finally {
    client.release();
  }
};

const unWishlistBook = async (req, res) => {
  const book_id = parseInt(req.params.book_id);
  const customer_id = parseInt(req.params.customer_id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SAVEPOINT before_insert"); // savepoint before insert
    const existenceResult = await client.query(queries.getBookById, [book_id]);

    if (existenceResult.rowCount === 0) {
      await client.query("ROLLBACK"); // Rollback transaction
      return res.status(404).json({ error: "Book not found" });
    }
    await res.status(200).json(existenceResult.rows[0]);

    const result = await client.query(queries.unWishlistBook, [
      book_id,
      customer_id,
    ]);
    await client.query("COMMIT"); // commit if success
    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
    await client.query("ROLLBACK TO SAVEPOINT before_insert"); // rollback if error
  } finally {
    client.release();
  }
};
// UPDATE BOOK PRICE
const updateBookPrice = async (req, res) => {
  const book_id = parseInt(req.params.book_id);
  const { price } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SAVEPOINT before_insert"); // savepoint before insert
    const existenceResult = await client.query(queries.getBookById, [book_id]);

    if (existenceResult.rowCount === 0) {
      await client.query("ROLLBACK"); // Rollback transaction
      return res.status(404).json({ error: "Book not found" });
    }
    await res.status(200).json(existenceResult.rows[0]);

    const result = await client.query(queries.updateBookPrice, [
      book_id,
      price,
    ]);
    await client.query("COMMIT"); // commit if success
    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
    await client.query("ROLLBACK TO SAVEPOINT before_insert"); // rollback if error
  } finally {
    client.release();
  }
};

// const queryTry = (req, res) => {
//   console.log(req.query.book_id);
//   res.status(200).json(req.query.book_id);
// };

module.exports = {
  getBooks,
  getBookById,
  addBookWriter,
  deleteBookByID,
  updateBookPrice,
  wishlistBook,
  unWishlistBook,
};
