const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User"); 
require("dotenv").config();
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const app = express();
const port = 8000;

app.use(express.json());

app.use(express.json());

mongoose.connect("mongodb+srv://nitinborase72:"+process.env.MONGO_PASSWORD+"@cluster0.g64ub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Not Connected to MongoDB:", err.message);
    });

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User .findOne({ id: jwt_payload.sub })
    .then(user => {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
    .catch(err => {
        return done(err, false);
    });
}));



app.get("/", (req,res) => {
    res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);

app.listen(port, () =>{
    console.log("App is running on port "+8000)
});