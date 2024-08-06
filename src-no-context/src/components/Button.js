import React from "react";

function Button({
  dispatch,
  children,
  dispatchType,
  nextDisabled,
  prevDisabled,
}) {
  return (
    <button
      disabled={nextDisabled || prevDisabled}
      className="btn  btn-ui"
      onClick={() => dispatch({ type: dispatchType })}
    >
      {children}
    </button>
  );
}

export default Button;
