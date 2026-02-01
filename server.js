// console.log("✅ SERVER.JS LOADED: error-handling version");

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
//  */
// app.use((req, res, next) => {
//   res.locals.NODE_ENV = NODE_ENV;
//   next();
// });

// // this is for intro to middleware assignment

// /**
//  * Configure Express middleware
//  */

// // Serve static files from the public directory
// app.use(express.static(path.join(__dirname, "public")));

// // Middleware to make NODE_ENV available to all templates
// app.use((req, res, next) => {
//   res.locals.NODE_ENV = (NODE_ENV || "production").toLowerCase();
//   next();
// });

// // 1) Request logging middleware
// app.use((req, res, next) => {
//   next();
// });


// // 2) Global data: current year
// app.use((req, res, next) => {
//   res.locals.currentYear = new Date().getFullYear();
//   next();
// });

// // 3) Time-based greeting middleware (store as a <p> tag string)
// app.use((req, res, next) => {
//   const currentHour = new Date().getHours();

//   let greetingText = "Hello!";
//   if (currentHour < 12) {
//     greetingText = "Good morning!";
//   } else if (currentHour < 18) {
//     greetingText = "Good afternoon!";
//   } else {
//     greetingText = "Good evening!";
//   }

//   // Stored as HTML so you can render with <%- greeting %>
//   res.locals.greeting = `<p class="greeting">${greetingText}</p>`;
//   next();
// });

// // 4) Random theme middleware
// app.use((req, res, next) => {
//   const themes = ["blue-theme", "green-theme", "red-theme"];
//   const randomTheme = themes[Math.floor(Math.random() * themes.length)];
//   res.locals.bodyClass = randomTheme;
//   next();
// });

// // 5) Query parameter helper middleware
// app.use((req, res, next) => {
//   res.locals.queryParams = req.query || {};
//   next();
// });


// /**
//  * Course data - place this after imports/variables, before routes
//  */
// const courses = {
//   CS121: {
//     id: "CS121",
//     title: "Introduction to Programming",
//     description:
//       "Learn programming fundamentals using JavaScript and basic web development concepts.",
//     credits: 3,
//     sections: [
//       { time: "9:00 AM", room: "STC 392", professor: "Brother Jack" },
//       { time: "2:00 PM", room: "STC 394", professor: "Sister Enkey" },
//       { time: "11:00 AM", room: "STC 390", professor: "Brother Keers" },
//     ],
//   },
//   MATH110: {
//     id: "MATH110",
//     title: "College Algebra",
//     description:
//       "Fundamental algebraic concepts including functions, graphing, and problem solving.",
//     credits: 4,
//     sections: [
//       { time: "8:00 AM", room: "MC 301", professor: "Sister Anderson" },
//       { time: "1:00 PM", room: "MC 305", professor: "Brother Miller" },
//       { time: "3:00 PM", room: "MC 307", professor: "Brother Thompson" },
//     ],
//   },
//   ENG101: {
//     id: "ENG101",
//     title: "Academic Writing",
//     description:
//       "Develop writing skills for academic and professional communication.",
//     credits: 3,
//     sections: [
//       { time: "10:00 AM", room: "GEB 201", professor: "Sister Anderson" },
//       { time: "12:00 PM", room: "GEB 205", professor: "Brother Davis" },
//       { time: "4:00 PM", room: "GEB 203", professor: "Sister Enkey" },
//     ],
//   },
// };

// /**
//  * Routes
//  */
// app.get("/", (req, res) => {
//   res.render("home", { title: "Welcome Home" });
// });

// app.get("/about", (req, res) => {
//   res.render("about", { title: "About Me" });
// });



// app.get("/student", (req, res) => {
//   res.render("student", {
//     title: "Student Information",
//     name: "Brynlee Bingham",
//     id: "A01234567",
//     email: "brynlee@example.com",
//     address: "Rexburg, ID",
//   });
// });

// /**
//  * Course catalog list page
//  */
// app.get("/catalog", (req, res) => {
//   res.render("catalog", {
//     title: "Course Catalog",
//     courses,
//   });
// });

// /**
//  * Course detail page with route parameter + query parameter sorting
//  * Examples:
//  * /catalog/CS121
//  * /catalog/CS121?sort=professor
//  * /catalog/MATH110?sort=room
//  */
// app.get("/catalog/:courseId", (req, res, next) => {
//   const courseId = req.params.courseId;
//   const course = courses[courseId];

//   // Handle course not found
//   if (!course) {
//     const err = new Error(`Course ${courseId} not found`);
//     err.status = 404;
//     return next(err);
//   }

//   // Get sort parameter (default to 'time')
//   const sortBy = req.query.sort || "time";

//   // Create a copy of sections to sort
//   let sortedSections = [...course.sections];

//   // Sort based on the parameter
//   switch (sortBy) {
//     case "professor":
//       sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
//       break;
//     case "room":
//       sortedSections.sort((a, b) => a.room.localeCompare(b.room));
//       break;
//     case "time":
//     default:
//       // Keep original time order as default
//       break;
//   }

//   console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

//   res.render("course-detail", {
//     title: `${course.id} - ${course.title}`,
//     course: { ...course, sections: sortedSections },
//     currentSort: sortBy,
//   });
// });

// // Test route for 500 errors (MUST be before catch-all)
// app.get("/test-error", (req, res, next) => {
//   const err = new Error("This is a test error");
//   err.status = 500;
//   next(err);
// });

// // this is for the route-specific middleware and /demo route

// // Route-specific middleware that sets custom headers
// const addDemoHeaders = (req, res, next) => {
//   res.setHeader("X-Demo-Page", "true");
//   res.setHeader("X-Middleware-Demo", "Hello from route-specific middleware!");
//   next();
// };

// // Demo page route with header middleware
// app.get("/demo", addDemoHeaders, (req, res) => {
//   res.render("demo", {
//     title: "Middleware Demo Page",
//   });
// });


// /**
//  * Catch-all route for 404 errors (MUST be after all real routes)
//  */
// app.use((req, res, next) => {
//   console.log("✅ CATCH-ALL HIT:", req.method, req.originalUrl);
//   const err = new Error("Page Not Found");
//   err.status = 404;
//   next(err);
// });

// /**
//  * Global error handler (MUST be after the catch-all)
//  */
// app.use((err, req, res, next) => {
//   console.log("✅ GLOBAL ERROR HANDLER HIT:", err.status, err.message);

//   // Prevent infinite loops, if a response has already been sent, do nothing
//   if (res.headersSent || res.finished) {
//     return next(err);
//   }

//   console.error(err);

//   // Determine status and template
//   const status = err.status || 500;
//   const template = status === 404 ? "404" : "500";

//   // Prepare data for the template
//   const context = {
//     title: status === 404 ? "Page Not Found" : "Server Error",
//     error: NODE_ENV === "production" ? "An error occurred" : err.message,
//     stack: NODE_ENV === "production" ? null : err.stack,
//     NODE_ENV,
//   };

//   // Render the appropriate error template with fallback
//   try {
//     res.status(status).render(`errors/${template}`, context);
//   } catch (renderErr) {
//     console.error("❌ Error rendering error template:", renderErr);
//     if (!res.headersSent) {
//       res
//         .status(status)
//         .send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
//     }
//   }
// });

// /**
//  * WebSocket server for live reloading (development only)
//  */
// if (NODE_ENV.includes("dev")) {
//   try {
//     const ws = await import("ws");
//     const wsPort = parseInt(PORT, 10) + 1;

//     const wsServer = new ws.WebSocketServer({ port: wsPort });

//     wsServer.on("listening", () => {
//       console.log(`WebSocket server running on port ${wsPort}`);
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


import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import MVC components
import routes from "./src/controllers/routes.js";
import { addLocalVariables } from "./src/middleware/global.js";

/**
 * Server configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express
 */
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

/**
 * Global Middleware
 */
app.use(addLocalVariables);

/**
 * Routes
 */
app.use("/", routes);

/**
 * Error Handling
 */
// 404 handler
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent || res.finished) {
    return next(err);
  }

  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: NODE_ENV === "production" ? "An error occurred" : err.message,
    stack: NODE_ENV === "production" ? null : err.stack,
    NODE_ENV,
  };

  try {
    res.status(status).render(`errors/${template}`, context);
  } catch (renderErr) {
    if (!res.headersSent) {
      res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
    }
  }
});

/**
 * Start WebSocket Server in Development Mode; used for live reloading
 */
if (NODE_ENV.includes("dev")) {
  const ws = await import("ws");
  try {
    const wsPort = parseInt(PORT, 10) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
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
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
