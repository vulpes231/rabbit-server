const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// endpoints
app.use("/", require("./routes/root"));

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
