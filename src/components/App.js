import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import Progress from "./Progress.js";
import FinishScreen from "./FinishScreen.js";
import Timer from "./Timer.js";
import Footer from "./Footer.js";
import Button from "./Button.js";
import { useQuiz } from "./contexts/QuizContext.js";
import ButtonContainer from "./ButtonContainer.js";

function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <Button dispatchType="nextQuestion">Next</Button>
              <Button dispatchType="finish">Finish</Button>
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
        {status === "reviewAnswers" && (
          <>
            <Progress />
            <Question />
            <ButtonContainer>
              <Button dispatchType="prevAnswers">Prev</Button>
              <Button dispatchType="finish">Back</Button>
              <Button dispatchType="nextAnswers">Next</Button>
            </ButtonContainer>
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
