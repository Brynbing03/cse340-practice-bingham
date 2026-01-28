// /**
//  * Imports
//  */
// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";

// /**
//  * Declare Important Variables
//  */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const NODE_ENV = (process.env.NODE_ENV || "production").toLowerCase();
// const PORT = process.env.PORT || 3000;

// /**
//  * Setup Express Server
//  */
// const app = express();

// /**
//  * Configure Express middleware
//  */
// // Serve static files from the public directory
// app.use(express.static(path.join(__dirname, "public")));

// // Set EJS as the templating engine
// app.set("view engine", "ejs");

// // Tell Express where to find your templates
// app.set("views", path.join(__dirname, "src/views"));

// /**
//  * Global template variables middleware
//  *
//  * Makes common variables available to all EJS templates without having to pass
//  * them individually from each route handler
//  */
// app.use((req, res, next) => {
//   res.locals.NODE_ENV = NODE_ENV || "production";
//   next();
// });

// /**
//  * Routes
//  */
// app.get("/", (req, res) => {
//   const title = "Welcome Home";
//   res.render("home", { title });
// });

// app.get("/about", (req, res) => {
//   const title = "About Me";
//   res.render("about", { title });
// });

// app.get("/products", (req, res) => {
//   const title = "Our Products";
//   res.render("products", { title });
// });

// app.get("/student", (req, res) => {
//   const title = "Student Information";

//   const student = {
//     name: "Brynlee Bingham",
//     id: "A01234567",
//     email: "brynlee@example.com",
//     address: "Rexburg, ID",
//   };

//   // Pass student fields directly (no nested `student` object)
//   res.render("student", { title, ...student });
// });

// /**
//  * WebSocket server for live reloading (development only)
//  * Must run before app.listen
//  */
// if (NODE_ENV.includes("dev")) {
//   try {
//     const ws = await import("ws");
//     const wsPort = parseInt(PORT, 10) + 1;

//     const wsServer = new ws.WebSocketServer({ port: wsPort });

//     wsServer.on("listening", () => {
//       console.log(`WebSocket server is running on port ${wsPort}`);
//     });

//     wsServer.on("error", (error) => {
//       console.error("WebSocket server error:", error);
//     });
//   } catch (error) {
//     console.error("Failed to start WebSocket server:", error);
//   }
// }

// /**
//  * Start Server
//  */
// app.listen(PORT, () => {
//   console.log(`Running in ${NODE_ENV} mode`);
//   console.log(`Server running at http://127.0.0.1:${PORT}`);
// });

/**
 * Imports
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Declare Important Variables
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = (process.env.NODE_ENV || "production").toLowerCase();
const PORT = process.env.PORT || 3000;

/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express middleware
 */
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Tell Express where to find your templates
app.set("views", path.join(__dirname, "src/views"));

/**
 * Global template variables middleware
 * Makes NODE_ENV available to all EJS templates
 */
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

/**
 * Routes
 */
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

/**
 * WebSocket server for live reloading (development only)
 */
if (NODE_ENV.includes("dev")) {
  try {
    const ws = await import("ws");
    const wsPort = parseInt(PORT, 10) + 1;

    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server running on port ${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`Running in ${NODE_ENV} mode`);
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
