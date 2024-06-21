import mongoose from "mongoose";
import * as dotenv from "dotenv";
import data from "./mock.js";
import Task from "../models/Task.js";

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));

// 비동기로 진행됨.
await Task.deleteMany({}); // 삭제 조건
await Task.insertMany(data); // 삽입할 데이터

mongoose.connection.close();
