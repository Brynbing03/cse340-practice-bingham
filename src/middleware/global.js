/**
 * Helper function to get the current greeting based on the time of day.
 */
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning!";
    if (currentHour < 18) return "Good Afternoon!";
    return "Good Evening!";
  };
  
  /**
   * Middleware to add local variables to res.locals for use in all templates.
   */
  const addLocalVariables = (req, res, next) => {
    // Current year for footer
    res.locals.currentYear = new Date().getFullYear();
  
    // Environment variable for templates (dev vs production)
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
  
    // Query params available to templates
    res.locals.queryParams = { ...req.query };
  
    // Greeting as plain text (templates decide how to wrap/display it)
    res.locals.greeting = getCurrentGreeting();
  
    // Random theme class
    const themes = ["blue-theme", "green-theme", "red-theme"];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];
  
    next();
  };
  
  export { addLocalVariables };
  