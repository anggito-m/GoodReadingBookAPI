const express = require("express");
const bookRoutes = require("./src/book/routes");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/v1/book", bookRoutes);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
