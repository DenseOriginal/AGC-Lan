import chalk from 'chalk';

export const botLog = (...messages: any) =>
	console.log(`[${chalk.bold.greenBright('BOT')}]`, ...messages);

export const botInfo = (...messages: any) =>
	console.info(`[${chalk.bold.blue('BOT')}]`, ...messages);

export const botError = (...messages: any) =>
	console.error(`[${chalk.bold.red('BOT')}]`, ...messages);