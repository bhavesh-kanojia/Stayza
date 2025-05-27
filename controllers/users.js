const User = require("../models/user.js");

module.exports.renderSignupForm =  (req, res) => {
    const formData = req.flash("formData")[0] || {};
    res.render("users/signup.ejs", { formData });
};
module.exports.signup = async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      let regUser = await User.register(newUser, password);
      console.log(regUser);
      req.login(regUser, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      req.flash("formData", req.body);
      res.redirect("/signup");
    }
};
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};
module.exports.login = (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/listings");
    });
};