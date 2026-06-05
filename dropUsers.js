import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await mongoose.connection.db.collection('users').deleteMany({});
  console.log("All existing users deleted successfully.");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
