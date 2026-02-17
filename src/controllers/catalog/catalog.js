import { getAllCourses, getCourseBySlug } from "../../models/catalog/courses.js";
import { getSectionsByCourseSlug } from "../../models/catalog/catalog.js";

// this is the route handler for the course catalog list page
const catalogPage = async (req, res, next) => {
  try {
    const courses = await getAllCourses();

    res.render("catalog/list", {
      title: "Course Catalog",
      courses,
    });
  } catch (err) {
    next(err);
  }
};

// the route handler for individual course detail pages
const courseDetailPage = async (req, res, next) => {
  try {
    const courseSlug = req.params.slugId;
    const sortBy = req.query.sort || "time";

    const course = await getCourseBySlug(courseSlug);
    const sections = await getSectionsByCourseSlug(courseSlug, sortBy);

    if (Object.keys(course).length === 0) {
      const err = new Error(`Course ${courseSlug} not found`);
      err.status = 404;
      return next(err);
    }

    res.render("catalog/detail", {
      title: `${course.courseCode} - ${course.name}`,
      course,
      sections,
      currentSort: sortBy,
    });
  } catch (err) {
    next(err);
  }
};

export { catalogPage, courseDetailPage };
