import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
     console.log('Already connected to DB');
    return cached.conn;
   
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose) => {
      console.log('Connected to DB');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

export default connectDB;
