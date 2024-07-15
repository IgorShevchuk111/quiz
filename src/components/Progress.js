import React from "react";

function Progress({
  index,
  selectedNumQuestions,
  points,
  maxPossiblePoints,
  answer,
}) {
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
