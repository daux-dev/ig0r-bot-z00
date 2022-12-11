const func = require("./func.js");
const bcrypt = require("bcryptjs");

async function authUser(user, password, done) {
    try {
        console.log("<authUser> " + (new Date().toISOString()));
        const foundUser = await func.getUser(user);
        if (foundUser) {
            const compare = await bcrypt.compare(password, foundUser.password);
            if (compare) {
                const authenticated_user = {id: foundUser.id, name: foundUser.lord};
                console.log("--->SUCCESSFUL LOGIN: " + user);
                return done(null, authenticated_user);    
            } else {
                console.log("--->FAILED LOGIN ATTEMPT: " + user + " " + password);
                return done(null, false);
            }
        } else {
            console.log("--->FAILED LOGIN ATTEMPT: " + user + " " + password);
            return done(null, false);
        }
    } catch (error) {
        console.log(error);
    }
};

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect("/");
};

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { 
        return res.redirect("/dashboard")
    }
    next()
};


module.exports = {
    authUser,
    checkAuthenticated,
    checkLoggedIn
}