// to get the current greeting depending on what time it is :)
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning!";
    if (currentHour < 18) return "Good Afternoon!";
    return "Good Evening!";
  };
  
  const addLocalVariables = (req, res, next) => {
//haha the current year for footer
    res.locals.currentYear = new Date().getFullYear();
  
//environment variable for templates
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
  
// query parameters that are available to templates
    res.locals.queryParams = { ...req.query };
  
// i wanted the greeting as plain text
    res.locals.greeting = getCurrentGreeting();
  
    //random theme class
    const themes = ["blue-theme", "green-theme", "red-theme"];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];
  
    next();
  };
  
  export { addLocalVariables };
  