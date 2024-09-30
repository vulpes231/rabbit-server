const express = require("express");
const { connectDB } = require("./configs/connectDB");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const { reqLogger, errorLogger } = require("./middlewares/logger");
const { corsOptions } = require("./configs/corsOptions");
// allowedOrigins
require("dotenv").config();
const cors = require("cors");
const { verifyJWT } = require("./middlewares/verifyJWT");
const socketIo = require("socket.io");
const Message = require("./models/Message");
const http = require("http");
const { allowedOrigins } = require("./configs/allowedOrigins");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

connectDB();
const PORT = process.env.PORT || 3000;

app.use(reqLogger);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Message({
        chatId: data.chatId,
        from: data.username,
        msg: data.msg,
      });
      await newMessage.save();

      io.to(data.chatId).emit("newMessage", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// admin endpoints without auth
app.use("/login", require("./routes/admin/login"));

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
app.use("/completed", require("./routes/user/completed"));

// admin endpoints with auth
app.use("/manageproducts", require("./routes/admin/prodAdmin"));
app.use("/manageaddress", require("./routes/admin/address"));
app.use("/manageusers", require("./routes/admin/useraccess"));
app.use("/manageorders", require("./routes/admin/orderaccess"));
app.use("/managetrnxs", require("./routes/admin/trnxaccess"));
app.use("/managewallets", require("./routes/admin/walletaccess"));
app.use("/managechat", require("./routes/admin/chat"));
app.use("/manageticket", require("./routes/admin/ticket"));
app.use("/managelogout", require("./routes/admin/managelogout"));
app.use("/manageadmins", require("./routes/admin/admin"));
app.use("/callback", require("./routes/admin/confirm"));
app.use("/enroll", require("./routes/admin/create"));

app.use(errorLogger);

mongoose.connection.once("connected", () => {
  server.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
  );
});
