import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
      validate: {
        validator: function (title) {
          return title.split(" ").length > 1;
        },
        message: "Must contain at least 2 words",
      },
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timeStamps: true }
);

/*
◆ 스키마 : 데이터의 틀을 정의
◆ 모델 : 스키마를 기반으로 객체를 생성해서 CRUD를 가능하게 하는 인터페이스

mongoose.model(1st, 2nd)
1 : 대문자/단수형, flextion 이름 결정지음
ex. 'Task' => tasks라는 컬렉션
2: 스키마
*/
const Task = mongoose.model("Task", TaskSchema);

export default Task;
