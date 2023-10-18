import dotenv from 'dotenv';
import mongoose, { disconnect } from 'mongoose';

dotenv.config();

const mongoUri = process.env.MONGO_DB_URI || '';

const startdb = async () => {
  mongoose.set('strictQuery', false);
  return await mongoose.connect(mongoUri);
};

const disconnectdb = (cb: () => void) =>
  disconnect()
    .then(cb)
    .catch((error) => {
      console.error(error);
    });

export { disconnectdb, startdb };
