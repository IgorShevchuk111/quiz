import React, { useEffect } from "react";

function Timer({ secondsRemaining, dispatch }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(id);
  }, [dispatch]);
  return (
    <div className="timer">
      {minutes >= 10 ? minutes : `0${minutes}`}:
      {seconds >= 10 ? seconds : `0${seconds}`}
    </div>
  );
}

export default Timer;
