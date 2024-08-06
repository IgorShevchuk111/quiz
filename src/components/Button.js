import React from "react";
import { useQuiz } from "./contexts/QuizContext";

function Button({ children, dispatchType }) {
  const { dispatch, selectedNumQuestions, index, answer, filteredQuestions } =
    useQuiz();

  const isDisabled = () => {
    switch (dispatchType) {
      case "prevAnswers":
        return index === 0;
      case "nextAnswers":
        return filteredQuestions.length === index + 1;
      default:
        return false;
    }
  };

  const shouldRender = () => {
    switch (dispatchType) {
      case "nextQuestion":
        return index < selectedNumQuestions - 1 && answer[index] !== undefined;
      case "finish":
        return (
          index === selectedNumQuestions - 1 && answer[index] !== undefined
        );
      default:
        return true;
    }
  };

  if (!shouldRender()) return null;

  return (
    <button
      disabled={isDisabled() ? true : undefined}
      className="btn  btn-ui"
      onClick={() => dispatch({ type: dispatchType })}
    >
      {children}
    </button>
  );
}

export default Button;
