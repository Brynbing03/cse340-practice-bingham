import { getFacultyBySlug, getSortedFaculty } from "../../models/faculty/faculty.js";

const facultyListPage = async (req, res, next) => {
  try {
    const sortBy = req.query.sort || "name";
    const facultyArray = await getSortedFaculty(sortBy);

    res.render("faculty/list", {
      title: "Faculty Directory",
      faculty: facultyArray,
      currentSort: sortBy,
    });
  } catch (err) {
    next(err);
  }
};

const facultyDetailPage = async (req, res, next) => {
  try {
    const facultySlug = req.params.slugId;
    const member = await getFacultyBySlug(facultySlug);

    if (Object.keys(member).length === 0) {
      const err = new Error(`Faculty member "${facultySlug}" not found`);
      err.status = 404;
      return next(err);
    }

    res.render("faculty/detail", {
      title: member.name,
      faculty: member,
    });
  } catch (err) {
    next(err);
  }
};

export { facultyListPage, facultyDetailPage };
