const User = require("../models/user.js");


module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup");
};



module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(req.session.redirectTo || "/listings");
};

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.flash("success", "Logged out!");
        res.redirect("/listings");
    });
};