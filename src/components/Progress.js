import React from "react";
import { useQuiz } from "./contexts/QuizContext";

function Progress() {
  const { index, selectedNumQuestions, points, maxPossiblePoints, answer } =
    useQuiz();

  return (
    <header className="progress">
      <progress
        max={selectedNumQuestions}
        value={index + Number(answer != null)}
      />
      <p>
        Question <strong>{index + 1}</strong> / {selectedNumQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
