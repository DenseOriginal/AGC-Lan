import express, { Request, RequestHandler, Response } from "express";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import { join } from "path";
// import { BaseRouter } from "./routes/router";
// import "./passport/index";
import { connect } from "./config/database";
import mongoose from "mongoose";
import exphbs from "express-handlebars";
import { RootRouter } from "./routes/router";
import bodyParser from "body-parser";
import { setupAdminBro } from "./routes/staff/admin-bro";
import { IUser } from "./models/user";
import { roles } from "./config/passport";
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
    },
    formatDate(time: Date, format: "long" | "short" | "time" = "short") {
      if(format == "time") {
        return `${time.getHours()}:${time.getMinutes()}`;
      }

      if(format == "long") {
        // Cool date format
        // Only display the year if it isn't the current year
        // Then split the string by spaces
        // Map over each word and capitalize the first letter
        // The join the array back again using a space
        return time.toLocaleDateString('da-dk', {
          weekday: "long",
          month: "short",
          day: "2-digit",
          year: time.getFullYear() != (new Date()).getFullYear() ? "numeric" : undefined,
        }).split(' ').map(day => day.charAt(0).toUpperCase() + day.substr(1).toLowerCase()).join(' ');
      }

      // Format the date with date/month
      // Then if we don't have the same year, then also display the year
      return `${time.getDate()}/${time.getMonth() + 1}${time.getFullYear() != (new Date()).getFullYear() ? '/' + time.getFullYear() : ''}`
    },
    isStaff: (user: IUser | undefined) => user && (roles[user.role as string] > 0),
    isAdmin: (user: IUser | undefined) => user && (roles[user.role as string] > 1),
    isSuperAdmin: (user: IUser | undefined) => user && (roles[user.role as string] > 2),
}
}));
app.set("view engine", "hbs");

app.use(express.static(join(__dirname, '../public')));
app.use(morgan('dev'));
app.use(session({ // Setup session storage in mongoDB, this makes sure users stay logged in between session
  secret: process.env.SESSION_SECRET as string,
  resave: true,
  saveUninitialized: true,
  store: new MongooseStore({ connection: mongoose }),
  rolling: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // One month
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Setup handlebar locals
app.use((req, res, next) => {
  res.locals.user = req.user;

  next();
});

// Setup AdminBro
setupAdminBro(app);

// Import and use the RootRouter
app.use(RootRouter);