import { createContext, useContext } from "react";

const QuizContext = createContext();

function QuizProvider({ children }) {
  return <QuizContext.Provider>{children}</QuizContext.Provider>;
}

function useQuiz() {
  const context = useContext(QuizContext);
  return context;
}

export { QuizProvider, useQuiz };
