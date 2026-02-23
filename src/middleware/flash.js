/**
 * flash message middleware
 *
 * this lets us store short messages in the session
 * so they survive a redirect but disappear after being shown once
 *
 * in controllers:
 *   req.flash('success', 'message here')  // store a message
 *   req.flash('error')                    // get error messages
 *   req.flash()                           // get all messages
 */

// this sets up the flash system on the request
const flashMiddleware = (req, res, next) => {
    // track if we stored a message so we know to save the session
    let sessionNeedsSave = false;
  
    // override res.redirect so session saves before redirect
    const originalRedirect = res.redirect.bind(res);
    res.redirect = (...args) => {
      if (sessionNeedsSave && req.session) {
        req.session.save(() => {
          originalRedirect.apply(res, args);
        });
      } else {
        originalRedirect.apply(res, args);
      }
    };
  
    // this function both stores and retrieves flash messages
    req.flash = function (type, message) {
      // if there is no session, we cannot store anything
      if (!req.session) {
        if (type && message) {
          return;
        }
        return { success: [], error: [], warning: [], info: [] };
      }
  
      // create flash storage if it doesn't exist yet
      if (!req.session.flash) {
        req.session.flash = {
          success: [],
          error: [],
          warning: [],
          info: [],
        };
      }
  
      // if two arguments are passed, we are storing a message
      if (type && message) {
        if (!req.session.flash[type]) {
          req.session.flash[type] = [];
        }
  
        req.session.flash[type].push(message);
        sessionNeedsSave = true;
        return;
      }
  
      // if only a type is passed, return messages of that type
      if (type && !message) {
        const messages = req.session.flash[type] || [];
        req.session.flash[type] = [];
        return messages;
      }
  
      // if no arguments, return all messages
      const allMessages = req.session.flash || {
        success: [],
        error: [],
        warning: [],
        info: [],
      };
  
      // clear all messages after they are retrieved
      req.session.flash = {
        success: [],
        error: [],
        warning: [],
        info: [],
      };
  
      return allMessages;
    };
  
    next();
  };
  
  // this makes flash available inside all ejs templates
  const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash;
    next();
  };
  
  // this runs both pieces in the correct order
  const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
      flashLocals(req, res, next);
    });
  };
  
  export default flash;