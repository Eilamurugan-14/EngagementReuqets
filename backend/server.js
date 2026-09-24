require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./config/database");

const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup aborted because SQL Server initialization failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();