
import React, { useState, useEffect } from "react";

const TOTAL_TIME = 10;

const rawQuestions = [
  {
    id: 1,
    question: "ข้อใดคือผลบวกของ 2 + 3?",
    options: ["4", "5", "6", "7"],
    answer: "5",
  },
  {
    id: 2,
    question: "กรุงเทพมหานครเป็นเมืองหลวงของประเทศใด?",
    options: ["ลาว", "ไทย", "พม่า", "เวียดนาม"],
    answer: "ไทย",
  },
  {
    id: 3,
    question: "1 กิโลกรัม เท่ากับกี่กรัม?",
    options: ["10", "100", "500", "1000"],
    answer: "1000",
  },
  {
    id: 4,
    question: "วัวมีกี่ขา?",
    options: ["10", "4", "3", "2"],
    answer: "4",
  },
];

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function shuffleOptionsInQuestions(questions) {
  return questions.map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }));
}

export default function App() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [studentNo, setStudentNo] = useState("");
  const [room, setRoom] = useState("");
  const [submittedName, setSubmittedName] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timeUsed, setTimeUsed] = useState(0);

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) newScore++;
    });
    setScore(newScore);
    setSubmitted(true);
    setTimeUsed(TOTAL_TIME - timeLeft);
  };

  useEffect(() => {
    if (submittedName) {
      const shuffled = shuffleArray(rawQuestions);
      const withShuffledOptions = shuffleOptionsInQuestions(shuffled);
      setQuestions(withShuffledOptions);
    }
  }, [submittedName]);

  useEffect(() => {
    if (submittedName && !submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [submittedName, submitted, timeLeft]);

  if (!submittedName) {
    return (
      <div className="p-4 sm:p-6 w-full max-w-screen-sm mx-auto">
        <h1 className="text-lg sm:text-xl font-bold mb-4 break-words">กรุณากรอกข้อมูลเพื่อนเริ่มทำข้อสอบ</h1>
        <input type="text" placeholder="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} className="border rounded p-2 w-full mb-2" />
        <input type="text" placeholder="นามสกุล" value={surname} onChange={(e) => setSurname(e.target.value)} className="border rounded p-2 w-full mb-2" />
        <input type="text" placeholder="เลขที่" value={studentNo} onChange={(e) => setStudentNo(e.target.value)} className="border rounded p-2 w-full mb-2" />
        <input type="text" placeholder="ห้อง" value={room} onChange={(e) => setRoom(e.target.value)} className="border rounded p-2 w-full mb-4" />
        <button onClick={() => setSubmittedName(true)} disabled={!name || !surname || !studentNo || !room} className="bg-blue-500 text-white rounded px-4 py-2 w-full">
          เริ่มทำแบบทดสอบ
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 w-full max-w-screen-sm mx-auto">
        <h1 className="text-xl font-bold mb-4">ผลคะแนนของคุณ</h1>
        <p className="text-base">ชื่อ: {name} {surname}</p>
        <p className="text-base">เลขที่: {studentNo} ห้อง: {room}</p>
        <p className="text-base">คะแนน: {score} / {questions.length}</p>
        <p className="text-base">เวลาที่ใช้: {timeUsed} วินาที</p>
      </div>
    );
  }

  const progressPercent = (timeLeft / TOTAL_TIME) * 100;

  return (
    <div className="p-4 sm:p-6 w-full max-w-screen-sm mx-auto">
      <h1 className="text-lg sm:text-xl font-bold mb-4 break-words">แบบทดสอบสำหรับ {name} {surname}</h1>
      <p className="mb-2 text-sm sm:text-base">เลขที่: {studentNo} ห้อง: {room}</p>
      <div className="mb-2">
        <p className="text-red-500 font-semibold text-sm sm:text-base">เวลาที่เหลือ: {timeLeft} วินาที</p>
        <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full mt-1">
          <div className="h-3 sm:h-4 bg-red-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <p className="font-medium text-sm sm:text-base break-words">{q.question}</p>
          {q.options.map((opt) => (
            <label key={opt} className="block text-sm sm:text-base">
              <input type="radio" name={`q-${q.id}`} value={opt} onChange={() => handleAnswer(q.id, opt)} checked={answers[q.id] === opt} /> {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} className="bg-green-500 text-white rounded px-4 py-2 mt-4 w-full">
        ส่งคำตอบ
      </button>
    </div>
  );
}
