import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

// middleware

app.use(express.static(path.join(__dirname, "public")));

// routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "src/views/about.html"));
});

app.get("/products", (req, res) => {
  res.sendFile(path.join(__dirname, "src/views/products.html"));
});

// server stuff

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
