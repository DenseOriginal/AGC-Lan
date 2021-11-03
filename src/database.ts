import mongoose from "mongoose";

// Exit application on error
mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`MongoDB connection error: ${err}`);
  // eslint-disable-next-line no-process-exit
  process.exit(-1);
});

// print mongoose logs in dev env
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', false);
}

export const connect = () => {
  mongoose.connect(process.env.MONGO_URI as string, {
    keepAlive: true,
  });
  return mongoose.connection;
};