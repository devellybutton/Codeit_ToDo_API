import express from "express";

const app = express();

// GET 메소드 (url, 콜백함수)
app.get("/hello", (req, res) => {
  res.send("Hello Express!");
});

// 포트 번호 : 컴퓨터 내에서 실행되는 프로세스를 구분
// 콜백 함수 : 앱이 시작되면 콜백함수가 실행됨.
app.listen(3000, () => console.log("Server Started"));

// 브라우저로 접속 : localhost:3000/hello

