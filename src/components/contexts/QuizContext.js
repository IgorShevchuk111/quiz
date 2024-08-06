import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  filteredQuestions: [],
  status: "loading",
  index: 0,
  answer: [],
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  selectedNumQuestions: null,
  difficulty: "all",
  name: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        filteredQuestions: action.payload,
        status: "ready",
        selectedNumQuestions: action.payload.length,
      };
    case "setHighscore":
      return {
        ...state,
        highscore: action.payload,
      };
    case "name":
      return {
        ...state,
        name: action.payload,
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.selectedNumQuestions * SECS_PER_QUESTION,
      };
    case "difficulty":
      const difficulty = action.payload;
      let filteredQuestions = state.questions;
      if (difficulty === "easy") {
        filteredQuestions = state.questions.filter(
          (question) => question.points === 10
        );
      } else if (difficulty === "medium") {
        filteredQuestions = state.questions.filter(
          (question) => question.points === 20
        );
      } else if (difficulty === "hard") {
        filteredQuestions = state.questions.filter(
          (question) => question.points === 30
        );
      }
      return {
        ...state,
        difficulty,
        filteredQuestions,
        numQuestions: filteredQuestions.length,
        selectedNumQuestions: filteredQuestions.length,
      };
    case "selectedNumQuestions":
      return {
        ...state,
        selectedNumQuestions: action.payload,
        filteredQuestions: state.filteredQuestions.slice(0, +action.payload),
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1 };
    case "nextAnswers":
      return { ...state, index: state.index + 1 };
    case "prevAnswers":
      return { ...state, index: state.index - 1 };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "finish":
      const highscore =
        state.highscore < state.points ? state.points : state.highscore;
      return { ...state, status: "finished", highscore: highscore };
    case "newAnswer":
      const question = state.filteredQuestions[state.index];

      return {
        ...state,
        answer: [...state.answer, action.payload],
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "reviewAnswers":
      return { ...state, status: "reviewAnswers", index: 0 };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        filteredQuestions: state.questions,
        numQuestions: state.questions.length,
        selectedNumQuestions: state.questions.length,
        highscore: state.highscore,
        status: "ready",
      };
    case "dataFailed":
      return { ...state, status: "error" };
    default:
      throw new Error("Action unknown");
  }
}

function QuizProvider({ children }) {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      difficulty,
      filteredQuestions,
      selectedNumQuestions,
      name,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  const maxPossiblePoints = filteredQuestions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(`http://localhost:8000/questions`);
        const data = res.data;
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }

    getData();
  }, []);

  useEffect(() => {
    async function setHighscore() {
      try {
        await axios.put(`http://localhost:8000/highscore`, {
          highscore,
        });
      } catch (err) {
        console.error(err, "Error");
      }
    }
    if (status === "finished") setHighscore();
  }, [highscore, status]);

  useEffect(() => {
    async function getHighscore() {
      try {
        const res = await axios.get(`http://localhost:8000/highscore`);
        const highscore = res.data.highscore;
        dispatch({ type: "setHighscore", payload: highscore });
      } catch (err) {
        console.error(err, "Error");
      }
    }
    getHighscore();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        difficulty,
        filteredQuestions,
        selectedNumQuestions,
        name,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outides the QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
