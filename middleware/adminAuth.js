const verifyAdmin = async (req, res, next) => {
  console.log("admin auth")
  console.log(req.session.admin_id)
  if (req.session.admin_id) {
    next();
  } else {
    res.redirect("/admin");
  }
};

module.exports = {
  verifyAdmin,
};


