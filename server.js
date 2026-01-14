import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const NODE_ENV = process.env.NODE_ENV || "production";
const PORT = process.env.PORT || 3000;

// middleware

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// routes...

app.get("/", (req, res) => {
  res.render("home", { title: "Welcome Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Me" });
});

app.get("/products", (req, res) => {
  res.render("products", { title: "Our Products" });
});

app.get("/student", (req, res) => {
  res.render("student", {
    title: "Student Information",
    name: "Brynlee Bingham",
    id: "A01234567",
    email: "brynlee@example.com",
    address: "Rexburg, ID",
  });
});

// server stuff

app.listen(PORT, () => {
  console.log(`Running in ${NODE_ENV} mode`);
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
