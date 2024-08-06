import React from "react";
import Options from "./Options";
import { useQuiz } from "./contexts/QuizContext";

function Question() {
  const { filteredQuestions, index } = useQuiz();
  const question = filteredQuestions[index];

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}

export default Question;
