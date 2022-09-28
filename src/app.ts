/// <reference path="types.d.ts" />

import express, { Request, RequestHandler, Response } from "express";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import { join } from "path";
import { connect } from "./config/database";
import exphbs from "express-handlebars";
import { RootRouter } from "./routes/router";
import bodyParser from "body-parser";
import { setupAdminBro } from "./routes/staff/admin-bro";
import { IUser } from "./models/user";
import { roles } from "./config/passport";
import favicon from "serve-favicon";
import MongoStore from "connect-mongo";
import { readFileSync } from "fs";
import { ApiRouter } from "./routes/api/router";

// Create server
export const app = express();

// Connect to mongoDB
// Even tho the variable isn't used, the `connect` function is still called
// So remove this
const connection = connect();

// Express config
app.set('port', process.env.PORT || 3000);

app.use(favicon(join(__dirname, '..', 'public', 'favicon', 'favicon.ico')))
app.use(express.static(join(__dirname, '../public')));
app.use(morgan('dev'));
app.use(session({ // Setup session storage in mongoDB, this makes sure users stay logged in between session
  secret: process.env.SESSION_SECRET as string,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI as string }),
  rolling: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // One week
  name: 'express.session'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Setup AdminBro
setupAdminBro(app);

app.use('/assets', express.static(join(__dirname, '../dist/client/assets')));

app.use('/api', ApiRouter);

app.get('*', (req, res) => {
  const html = readFileSync(join(__dirname, '..', 'dist', 'client', 'index.html'), 'utf8');
  const injectedHtml = html.replace('// <!-- __INJECT SCRIPT HERE__ -->', `
    window.user = ${JSON.stringify(req.user)};
  `);

  res.send(injectedHtml);
});

// Import and use the RootRouter
app.use(RootRouter);