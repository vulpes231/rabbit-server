const express = require("express");
const { connectDB } = require("./configs/connectDB");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const { reqLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(reqLogger);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// endpoints
app.use("/users", require("./routes/user/user"));
app.use("/signin", require("./routes/user/signin"));
app.use("/signup", require("./routes/user/signup"));
app.use("/", require("./routes/root"));

app.use(errorLogger);

mongoose.connection.once("connected", () => {
  app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
  );
});
