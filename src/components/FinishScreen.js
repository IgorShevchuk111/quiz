import React from "react";

import { useQuiz } from "./contexts/QuizContext";
import Button from "./Button";

function FinishScreen() {
  const { points, maxPossiblePoints, highscore, dispatch, name, status } =
    useQuiz();
  if (status !== "finished") return;

  const percentage = (points / maxPossiblePoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>
        {name} you scored <strong>{points}</strong> out of {maxPossiblePoints} (
        {Math.ceil(percentage)} %)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <div className="container-btn">
        <Button dispatch={dispatch} dispatchType="reviewAnswers">
          Review answers
        </Button>
        <Button dispatch={dispatch} dispatchType="restart">
          Restart quiz
        </Button>
      </div>
    </>
  );
}

export default FinishScreen;
