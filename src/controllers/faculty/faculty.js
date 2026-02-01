import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

const facultyListPage = (req, res) => {
  const sortBy = req.query.sort || "name";
  const { facultyArray, safeSort } = getSortedFaculty(sortBy);

  
  res.render("faculty/list", {
    title: "Faculty Directory",
    faculty: facultyArray,
    currentSort: safeSort,
  });
};



const facultyDetailPage = (req, res, next) => {
  const facultyId = req.params.facultyId;
  const member = getFacultyById(facultyId);

  if (!member) {
    const err = new Error(`Faculty member "${facultyId}" not found`);
    err.status = 404;
    return next(err);
  }

  res.render("faculty/detail", {
    title: member.name,
    faculty: member,
  });
};

export { facultyListPage, facultyDetailPage };
