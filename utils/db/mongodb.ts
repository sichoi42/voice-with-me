import mongoose from 'mongoose';

const DB_URI = process.env.MONGODB_URI || '';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(`${DB_URI}`, {
        bufferCommands: false,
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
