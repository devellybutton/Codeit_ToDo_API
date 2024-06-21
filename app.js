import express from "express";
import mongoose from "mongoose";
import Task from "./models/Task.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

// req.body로 접근하려면 express.json() 필요함
app.use(cors());
app.use(express.json());

// try-catch 대신 asyncHandler
function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ mesage: "Cannot find given id." });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

// GET 메소드 (url, 콜백함수)
// app.get("/tasks", (req, res) => {
//   res.send(tasks); // js를 json으로 변환
// });

// 쿼리 파라미터
// sort가 oldest인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
// count : 태스크 개수
app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks); // js를 json으로 변환
  })
);

// 브라우저로 접속 : localhost:3000/hello
app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      await task.save();
      res.send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    // id를 가진 task의 인덱스를 찾기
    const task = await Task.findByIdAndDelete(id);
    if (task) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));

// 포트 번호 : 컴퓨터 내에서 실행되는 프로세스를 구분
// 콜백 함수 : 앱이 시작되면 콜백함수가 실행됨.
app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
