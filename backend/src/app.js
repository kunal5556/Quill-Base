const express = require("express");
const cors = require("cors");
const sendResponse = require("./utils/sendResponse");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: false }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  sendResponse(res, 200, { status: "ok" });
});

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
