import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "@material-ui/core";
import styled from "styled-components";
import { Socket } from "../utils/socket";
export const Play = () => {
  const [phase, setPhase] = useState("answering");
  const [socket, setSocket] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const answer = id => {
    setUserAnswer(id);
  };

  useEffect(() => {
    setSocket(Socket(""));
  }, []);

  const question = {
    text: "One of these is the correct answer, which one?",
    options: [
      { id: 0, text: "Answer 1" },
      { id: 1, text: "Answer 2" },
      { id: 2, text: "Answer 3" },
      { id: 3, text: "Answer 4" }
    ],
    correctOption: 3
  };
  if (phase === "answering") {
    return (
      <Wrapper>
        <Button
          onClick={() =>
            setPhase(phase !== "answering" ? "answering" : "pause")
          }
        >
          debug
        </Button>
        <Container>
          <Card>
            <Wrapper>
              <h2>{question.text}</h2>
              {question.options.map(option => (
                <Option
                  variant="contained"
                  onClick={() => answer(option.id)}
                  color={
                    userAnswer !== null && userAnswer === option.id
                      ? "primary"
                      : "secondary"
                  }
                >
                  {option.text}
                </Option>
              ))}
            </Wrapper>
          </Card>
        </Container>
      </Wrapper>
    );
  } else if (phase === "pause") {
    return (
      <Wrapper>
        <Button
          onClick={() =>
            setPhase(phase !== "answering" ? "answering" : "waiting")
          }
        >
          debug
        </Button>
        <Container>
          <Card>
            <Wrapper>
              <h2>{question.text}</h2>
              {question.options.map(option => (
                <Option
                  variant="contained"
                  disabled={userAnswer !== option.id}
                  color={
                    userAnswer !== null && userAnswer === option.id
                      ? "primary"
                      : "secondary"
                  }
                  right={question.correctOption === option.id}
                  correct={
                    userAnswer === option.id &&
                    question.correctOption === option.id
                  }
                >
                  {option.text}
                </Option>
              ))}
            </Wrapper>
          </Card>
        </Container>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <Container>
          <Card>
            <Wrapper>WAITING</Wrapper>
          </Card>
        </Container>
      </Wrapper>
    );
  }
};

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Option = styled(Button)`
  margin: 5px 0px !important;
  ${({ correct }) => (correct ? "background-color: green !important" : "")};
  ${({ right }) => (right ? "border: 10px solid green !important;" : "")};
`;
