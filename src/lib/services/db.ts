import mongoose from "mongoose";

// Exit application on error
mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`MongoDB connection error: ${err}`);
  // eslint-disable-next-line no-process-exit
  process.exit(-1);
});

// print mongoose logs in dev env
if (import.meta.env.DEV) {
  mongoose.set('debug', true);
}

await mongoose.connect(import.meta.env.VITE_MONGO_URI, {
	keepAlive: true,
});

export const dbConnection =  mongoose.connection;