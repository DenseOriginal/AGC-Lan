require('dotenv').config();

import errorHandler from "errorhandler";
import { app } from "./app";
import { run } from "./discord/client";
import chalk from 'chalk';



/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}


/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        `[${chalk.bold.greenBright('WEBSITE')}] App is running at http://localhost:%d in %s mode`,
        app.get("port"),
        app.get("env")
    );
    console.log(`[${chalk.bold.greenBright('WEBSITE')}] Press CTRL-C to stop\n`);
});

// Start discord bot
run();

export default server;
