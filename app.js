import express from "express";
import tasks from "./data/mock.js";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";

const app = express();

// req.body로 접근하려면 express.json() 필요함
app.use(express.json());

// GET 메소드 (url, 콜백함수)
// app.get("/tasks", (req, res) => {
//   res.send(tasks); // js를 json으로 변환
// });

// 쿼리파라미터
// sort가 oldest인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
// count : 태스크 개수
app.get("/tasks", (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count);

  const compareFn =
    sort === "oldest"
      ? (a, b) => a.createdAt - b.createdAt
      : (a, b) => b.createdAt - a.createdAt;

  let newTasks = tasks.sort(compareFn);

  if (count) {
    newTasks = newTasks.slice(0, count);
  }

  res.send(newTasks); // js를 json으로 변환
});

// 브라우저로 접속 : localhost:3000/hello
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;
  const ids = tasks.map((task) => task.id);
  newTask.id = Math.max(...ids) + 1;
  newTask.isComplete = false;
  newTask.createdAt = new Date();
  newTask.updatedAt = new Date();

  tasks.push(newTask);
  res.status(201).send(newTask);
});

app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    task.updatedAt = new Date();
    res.send(task);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  // id를 가진 task의 인덱스를 찾기
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx >= 0) {
    tasks.splice(idx, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
});

// 포트 번호 : 컴퓨터 내에서 실행되는 프로세스를 구분
// 콜백 함수 : 앱이 시작되면 콜백함수가 실행됨.
app.listen(3000, () => console.log("Server Started"));

mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));
