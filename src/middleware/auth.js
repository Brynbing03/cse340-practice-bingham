// middleware to require authentication for protected routes
// redirects to login if user is not authenticated

const requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.isLoggedIn = true;
    next();
  } else {
    req.flash("error", "You must be logged in to access this page.");
    res.redirect("/login");
  }
};

/**
 * middleware factory to require a specific role
 * example: requireRole('admin')
 */
const requireRole = (roleName) => {
  return (req, res, next) => {
    // must be logged in first
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    // check role
    if (req.session.user.roleName !== roleName) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/");
    }

    // user has correct role
    next();
  };
};

export { requireLogin, requireRole };