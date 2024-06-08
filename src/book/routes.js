const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getBooks);
router.get("/:id", controller.getBookById);
router.post("/add/:writer_id/:book_id", controller.addBookWriter);
router.post("/wishlist/:book_id/:customer_id", controller.wishlistBook);
router.put("/update/:book_id", controller.updateBookPrice);
router.delete("/del/:id", controller.deleteBookByID);
router.delete("/unwishlist/:book_id/:customer_id", controller.unWishlistBook);

//router.post("/coba", controller.queryTry);
module.exports = router;
