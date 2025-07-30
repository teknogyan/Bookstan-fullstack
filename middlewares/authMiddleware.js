const authMiddleware = (req, res, next) => {
  if(req.cookies.jwtCookie) {
  console.log("cookies from user: ", req.cookies.jwtCookie)
  const isValid = jwt.verify(req.cookies.jwtCookie, process.env.JWT_SECRET)
  if (isValid) {
    next()
  }}
   else {
    res.render("auth/login", {message: "Please login to access this page!"})
  }
}
module.exports = authMiddleware