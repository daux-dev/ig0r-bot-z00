const express = require("express");
const session = require("express-session");
const app = express();

require("dotenv").config();

const passport = require("passport");
const LocalStrategy = require("passport-local");
const func = require("./func.js");
const auth = require("./auth.js");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.set("view engine", "ejs");
app.set("views", "./z00/views");
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy (auth.authUser));
app.use(express.urlencoded({
    extended: true
}));

passport.serializeUser( (userObj, done) => {
    done(null, userObj)
});

passport.deserializeUser((userObj, done) => {
    done (null, userObj )
});

app.use(express.static("./public"));

app.get("/", auth.checkLoggedIn, async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error);
    }
});

app.get("/dashboard", auth.checkAuthenticated, async (req, res) => {
    try {
        const db = await func.dbOpen();
        const events = await func.getComingEvents(db);
        const attends = await func.getNextAttends(db);
        await db.close();
        res.render("dashboard", {
            events: events,
            current: events.shift(),
            attends: attends
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/new", auth.checkAuthenticated, async (req, res) => {
    try {
        const data = {
            h1: "new",
            id: "",
            title: "",
            image: "",
            desc: "",
            date: "",
            time: ""
        }  
        res.render("new", {data: data});
    } catch (error) {
        console.log(error);
    }
});

app.get("/edit", auth.checkAuthenticated, async (req, res) => {
    try {
        console.log(req.query);
        if (req.query.id) {
            const event = await func.getEventById(req.query.id);
            const data = {
                h1: "edit",
                id: event.event_id,
                title: event.event_title,
                image: event.event_image,
                desc: event.event_desc,
                date: event.event_date,
                time: event.event_time
            }
            res.render("new", {data: data});
        } else {
            res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error);
    }
});

app.get("/all", auth.checkAuthenticated, async (req, res) => {
    try {
        const data = await func.getAllEvents();
        res.render("all", {
            events: data
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/next", async (req, res) => {
    try {
        const db = await func.dbOpen();
        const events = await func.getApiEvents(db);
        const attends = await func.getNextAttends(db);

        //replace empty event_image string with default image link
        const eventsImg = events.map(e => {
            if (!e.event_image) {
                e.event_image = "https://z00.insertgame.de/img/default.jpg";
                return e;
            } else {
                return e;
            }
        });
        //add attendance number for current event
        eventsImg[0].event_attendees = attends.length;

        await res.send(eventsImg);
        await db.close();
    } catch (error) {
        console.log(error);
    }
});

app.get("/api", async (req, res) => {
    try {
        if(req.query.event_id){
            const id = req.query.event_id;
            const event = await func.getEventById(id);
            const attends = await func.getAttendsById(id);
            event ? event.event_attendees = attends : null;
            event.event_image ? null : event.event_image = "https://z00.insertgame.de/img/default.jpg";
            res.send(event);
        } else {
            res.send("");
        }
    } catch (error) {
        console.log(error);
    }
})

app.post("/new", auth.checkAuthenticated, async (req, res) => {
    try {
        const newEvent = {
            title: req.body.title,
            image: req.body.image,
            desc: req.body.desc,
            date: req.body.date,
            time: req.body.time
        }
        console.log(newEvent);
        const run = await func.createEvent(newEvent);
        console.log(run);
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error.message);
        res.redirect("/new");
    }
});

app.post("/edit", auth.checkAuthenticated, async (req, res) => {
    try {
        const editEvent = {
            id: req.body.id,
            title: req.body.title,
            image: req.body.image,
            desc: req.body.desc,
            date: req.body.date,
            time: req.body.time
        }

        console.log(editEvent);
        const run = await func.editEvent(editEvent);
        console.log("run: " + run);
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
});

app.post("/update", auth.checkAuthenticated, async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.button === "edit") {
            res.redirect("/edit?id=" + req.body.event_id);
        } else if (req.body.button === "delete") {  
            const run = await func.deleteEvent(req.body.event_id);
            console.log(run.changes);
            res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/",
 }));

 app.post("/logout", (req, res) => {
    req.logOut( err => {
        if (err) {return next(err);}
        res.redirect("/");
    });
 });

app.listen(8000, () => {
    console.log("START <z00 v0.3> PORT:8000");
});