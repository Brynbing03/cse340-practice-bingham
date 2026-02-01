const homePage = (req, res) => {
    res.render("home", { title: "Home" });
  };
  
  const aboutPage = (req, res) => {
    res.render("about", { title: "About" });
  };
  
  const demoPage = (req, res) => {
    res.render("demo", { title: "Middleware Demo Page" });
  };
  
  const testErrorPage = (req, res, next) => {
    const err = new Error("This is a test error");
    err.status = 500;
    next(err);
  };
    
const studentPage = (req, res) => {
    res.render("student", {
      title: "Student Information",
      name: "Brynlee Bingham",
      id: "A01234567",
      email: "brynlee@example.com",
      address: "Rexburg, ID",
    });
  };
  
export { homePage, aboutPage, demoPage, testErrorPage, studentPage };
