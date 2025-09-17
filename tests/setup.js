import mongoose from "mongoose";
import dotenv from "dotenv";
import { jest } from "@jest/globals";  // ✅ add this

dotenv.config();


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
  });
});
jest.setTimeout(30000); // 30 seconds

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});