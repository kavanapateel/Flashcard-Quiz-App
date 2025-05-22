import { useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const flipAnimation = keyframes`
  from { transform: rotateY(0deg); }
  to { transform: rotateY(180deg); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Card = styled.div`
  width: 320px;
  min-height: 200px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  position: relative;
  perspective: 1000px;
  background: ${props => props.theme.cardBg};
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  transform: ${props => props.isBack ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const Question = styled.div`
  font-weight: bold;
  color: ${props => props.theme.primary};
  animation: ${fadeIn} 0.5s ease-out;
  margin-bottom: 2rem;
  font-size: 1.3rem;
  line-height: 1.5;
  padding: 0 1rem;
`;

const Input = styled.input`
  width: 80%;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.secondary};
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;

  &:focus {
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.primary};
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Answer = styled.div`
  color: ${props => props.isCorrect ? props.theme.success : props.theme.error};
  font-weight: bold;
  animation: ${fadeIn} 0.5s ease-out;
  margin-bottom: ${props => props.isResult ? '1.5rem' : '0.5rem'};
  font-size: ${props => props.isResult ? '1.2rem' : '1rem'};
`;

const StreakIndicator = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: ${props => props.theme.accent};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  animation: ${fadeIn} 0.5s ease-out;
  display: ${props => props.show ? 'block' : 'none'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

export default function Flashcard({ question, answer, onNext, onAnswer, theme }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowAnswer(true);
    setIsFlipped(true);
    onAnswer(correct);
  };

  const handleNext = () => {
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(false);
    setIsFlipped(false);
    onNext();
  };

  return (
    <Card theme={theme}>
      <CardInner isFlipped={isFlipped}>
        <CardFace>
          <Question theme={theme}>{question}</Question>
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={showAnswer}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !showAnswer && userAnswer.trim()) {
                handleCheckAnswer();
              }
            }}
            theme={theme}
          />
          {!showAnswer ? (
            <Button 
              onClick={handleCheckAnswer}
              disabled={!userAnswer.trim()}
              theme={theme}
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext} theme={theme}>
              Next Question
            </Button>
          )}
        </CardFace>
        <CardFace isBack>
          <Answer isCorrect={isCorrect} theme={theme} isResult>
            {isCorrect ? "Correct! 🎉" : "Incorrect 😕"}
          </Answer>
          <Answer isCorrect={isCorrect} theme={theme}>
            Correct answer: {answer}
          </Answer>
          <Button onClick={handleNext} theme={theme} style={{ marginTop: '1.5rem' }}>
            Next Question
          </Button>
          <StreakIndicator show={isCorrect} theme={theme}>
            {isCorrect ? "🔥" : ""}
          </StreakIndicator>
        </CardFace>
      </CardInner>
    </Card>
  );
}
