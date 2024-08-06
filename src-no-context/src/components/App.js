import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import NextButton from "./Button.js";
import Progress from "./Progress.js";
import FinishScreen from "./FinishScreen.js";
import Timer from "./Timer.js";
import Footer from "./Footer.js";
import Button from "./Button.js";

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
  numQuestions: null,
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
        numQuestions: action.payload.length,
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

function App() {
  const [
    {
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
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const canShowNextButton =
    index < selectedNumQuestions - 1 && answer[index] !== undefined;

  const canShowFinishButton =
    index === selectedNumQuestions - 1 && answer[index] !== undefined;

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
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            selectedNumQuestions={selectedNumQuestions}
            dispatch={dispatch}
            difficulty={difficulty}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              points={points}
              selectedNumQuestions={selectedNumQuestions}
              index={index}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={filteredQuestions[index]}
              dispatch={dispatch}
              answer={answer}
              index={index}
            />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              {canShowNextButton && (
                <NextButton dispatchType="nextQuestion" dispatch={dispatch}>
                  Next
                </NextButton>
              )}
              {canShowFinishButton && (
                <NextButton dispatchType="finish" dispatch={dispatch}>
                  Finish
                </NextButton>
              )}
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
            name={name}
          />
        )}
        {status === "reviewAnswers" && (
          <>
            <Progress
              points={points}
              selectedNumQuestions={selectedNumQuestions}
              index={index}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={filteredQuestions[index]}
              dispatch={dispatch}
              answer={answer}
              index={index}
            />
            <div className="container-btn">
              <Button
                dispatch={dispatch}
                dispatchType="prevAnswers"
                prevDisabled={index === 0}
              >
                Prev
              </Button>
              <Button dispatch={dispatch} dispatchType="finish">
                Back
              </Button>
              <Button
                dispatch={dispatch}
                dispatchType="nextAnswers"
                nextDisabled={filteredQuestions.length === index + 1}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
