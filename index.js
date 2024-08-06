const express = require("express");
const { connectDB } = require("./configs/connectDB");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const { reqLogger, errorLogger } = require("./middlewares/logger");
const { corsOptions } = require("./configs/corsOptions");
require("dotenv").config();
const cors = require("cors");
const { verifyJWT } = require("./middlewares/verifyJWT");

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(reqLogger);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// admin endpoints without auth
app.use("/login", require("./routes/admin/login"));
app.use("/enroll", require("./routes/admin/create"));
// user endpoints wihtout auth
app.use("/signin", require("./routes/user/signin"));
app.use("/signup", require("./routes/user/signup"));
app.use("/", require("./routes/root"));

// user endpoints with auth
app.use(verifyJWT);
app.use("/user", require("./routes/user/user"));
app.use("/logout", require("./routes/user/logout"));
app.use("/products", require("./routes/user/product"));
app.use("/wallet", require("./routes/user/wallet"));
app.use("/transactions", require("./routes/user/transaction"));
app.use("/order", require("./routes/user/order"));
app.use("/chat", require("./routes/user/message"));
app.use("/ticket", require("./routes/user/ticket"));

// admin endpoints with auth
app.use("/manageproducts", require("./routes/admin/prodAdmin"));
app.use("/manageusers", require("./routes/admin/useraccess"));
app.use("/manageorders", require("./routes/admin/orderaccess"));
app.use("/managetrnxs", require("./routes/admin/trnxaccess"));
app.use("/managewallets", require("./routes/admin/walletaccess"));
app.use("/managechat", require("./routes/admin/chat"));
app.use("/manageticket", require("./routes/admin/ticket"));

app.use(errorLogger);

mongoose.connection.once("connected", () => {
  app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
  );
});
