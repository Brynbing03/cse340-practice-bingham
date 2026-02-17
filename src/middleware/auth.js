// this is middleware to require authentication for protected routes.
//this redirects to the login pg if the user isnt authenticated 

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
      res.locals.isLoggedIn = true;
      next();
    } else {
      res.redirect("/login");
    }
  };
  
  export { requireLogin };
  