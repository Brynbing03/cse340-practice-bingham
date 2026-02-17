// to get the current greeting depending on what time it is :)
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning!";
    if (currentHour < 18) return "Good Afternoon!";
    return "Good Evening!";
  };


// this is express middleware that adds head asset management functionality to routes
// it has routs for stroing css and js 
const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];
  
    res.addStyle = (css, priority = 0) => {
      res.locals.styles.push({ content: css, priority });
    };
  
    res.addScript = (js, priority = 0) => {
      res.locals.scripts.push({ content: js, priority });
    };
  
    res.locals.renderStyles = () => {
      return res.locals.styles
        .sort((a, b) => b.priority - a.priority)
        .map((item) => item.content)
        .join("\n");
    };
  
    res.locals.renderScripts = () => {
      return res.locals.scripts
        .sort((a, b) => b.priority - a.priority)
        .map((item) => item.content)
        .join("\n");
    };
  };
  
  
  const addLocalVariables = (req, res, next) => {
    setHeadAssetsFunctionality(res);
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
  