import React from "react";

function StartScreen({
  numQuestions,
  selectedNumQuestions,
  dispatch,
  difficulty,
}) {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handleName(e) {
    dispatch({
      type: "name",
      payload: capitalizeFirstLetter(e.target.value),
    });
  }

  function handleStart() {
    dispatch({ type: "start" });
  }

  function handleDifficulty(e) {
    dispatch({ type: "difficulty", payload: e.target.value });
  }

  function handleNumQuestions(e) {
    dispatch({ type: "selectedNumQuestions", payload: +e.target.value });
  }
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>

      <h3>
        {selectedNumQuestions} {difficulty}-level questions to test your React
        mastery
      </h3>
      <label>
        Select number of questions
        <select value={selectedNumQuestions} onChange={handleNumQuestions}>
          {Array.from({ length: numQuestions }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>
      <label>
        Select difficulty level
        <select value={difficulty} onChange={handleDifficulty}>
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <label>
        Enter your name please
        <input onChange={handleName} placeholder="Enter your name" />
      </label>
      <button onClick={handleStart} className="btn btn-ui">
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
