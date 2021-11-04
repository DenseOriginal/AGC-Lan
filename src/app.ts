import express, { Request, RequestHandler, Response } from "express";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import { join } from "path";
// import { BaseRouter } from "./routes/router";
// import "./passport/index";
import { connect } from "./database";
import mongoose from "mongoose";
import exphbs from "express-handlebars";
import { RootRouter } from "./routes/router";
import bodyParser from "body-parser";
const MongooseStore = require('mongoose-express-session')(session.Store);

// Create server
export const app = express();

// Connect to mongoDB
const connection = connect();

// Express config
app.set('port', process.env.PORT || 3000);
app.set("views", join(__dirname, "../views"));


app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: {
    // Diffrent helpers, to extend the functionality of handlebars
    // Hbs doesn't nativly support conditional operators, so we implement our own
    eq: (v1: any, v2: any) => v1 === v2,
    ne: (v1: any, v2: any) => v1 !== v2,
    lt: (v1: any, v2: any) => v1 < v2,
    gt: (v1: any, v2: any) => v1 > v2,
    lte: (v1: any, v2: any) => v1 <= v2,
    gte: (v1: any, v2: any) => v1 >= v2,
    not: (v1: any) => !v1,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
}
}));
app.set("view engine", "hbs");

app.use(express.static(join(__dirname, '../public')));
app.use(morgan('dev'));
app.use(session({ // Setup session storage in mongoDB, this makes sure users stay logged in between session
  secret: process.env.SESSION_SECRET as string,
  resave: true,
  saveUninitialized: true,
  store: new MongooseStore({ connection: mongoose })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Import and use the RootRouter
app.use(RootRouter);