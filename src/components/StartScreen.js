import React from "react";

function StartScreen({
  numQuestions,
  selectedNumQuestions,
  dispatch,
  difficulty,
}) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>

      <h3>
        {selectedNumQuestions} {difficulty}-level questions to test your React
        mastery
      </h3>
      <label>
        Select number of questions
        <select
          value={selectedNumQuestions}
          onChange={(e) =>
            dispatch({ type: "selectedNumQuestions", payload: +e.target.value })
          }
        >
          {Array.from({ length: numQuestions }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>
      <label>
        Select difficulty level
        <select
          value={difficulty}
          onChange={(e) =>
            dispatch({ type: "difficulty", payload: e.target.value })
          }
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <button
        onClick={() => dispatch({ type: "start" })}
        className="btn btn-ui"
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
