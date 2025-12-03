if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
};

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderLust";

const listingRouter = require("./Router/listing.js");
const reviewsRouter = require("./Router/review.js");
const userRouter = require("./Router/user.js");
const e = require("connect-flash");


async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Database is connected");
}).catch(err =>{
    console.log("Error");
})

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// app.get("/",(req,res)=>{
//       res.send("I am root");
// });

const sessionOptions = {
    secret:"thisisasecret",   
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires: Date.now() + 1000*60*60*24*7,
      maxAge: 1000*60*60*24*7,
      httpOnly:true
    } 
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// app.all("/*",(req,res,next)=>{
//     next(new expressError("Page Not Found",404));
// });

// app.use((err,req,res,next)=>{
//     const {statusCode=500} = err;
//     if(!err.message) err.message = "Something went wrong";
//     res.status(statusCode).render("error.ejs",{err});
// });

app.listen(8080,()=>{
    console.log("App is listing on port 8080");
});
