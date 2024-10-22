import { useQuiz } from "./contexts/QuizContext";

function Options({ question }) {
  const { dispatch, answer, index } = useQuiz();

  const isAnswered = answer && answer[index] !== undefined;

  const handleOptionClick = (optionIndex) => {
    if (!isAnswered) {
      dispatch({
        type: "newAnswer",
        payload: optionIndex,
      });
    }
  };

  return (
    <div className="options">
      {question.options.map((option, optionIndex) => {
        return (
          <button
            key={option}
            disabled={isAnswered}
            className={`btn btn-option ${
              optionIndex === answer[index] && "answer"
            }
           ${
             isAnswered &&
             (optionIndex === question.correctOption ? "correct" : "wrong")
           }`}
            onClick={() => handleOptionClick(optionIndex)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Options;
