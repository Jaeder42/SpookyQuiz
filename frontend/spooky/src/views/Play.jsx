import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "@material-ui/core";
import styled from "styled-components";
import { Socket } from "../utils/socket";
import { useCookies } from "react-cookie";

export const Play = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["spooky"]);
  const [phase, setPhase] = useState("waiting");
  const [socket, setSocket] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [question, setQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (timer > 0) setTimer(timer - 1);
    }, 1000);
  }, [timer]);

  const answer = id => {
    if (!userAnswer) {
      setUserAnswer(id);
      socket.emit("client_answer", { userName: cookies.userName, option: id });
    }
  };

  useEffect(() => {
    setSocket(Socket(""));
  }, []);
  useEffect(() => {
    if (socket != null) {
      socket.emit("join_game", cookies.userName);

      socket.on("new_round", result => {
        setTimer(10);
        setUserAnswer(null);
        setQuestion({
          text: result.question,
          options: result.answers.map((val, i) => ({ id: i, text: val }))
        });
        setPhase("answering");
      });

      socket.on("present_result", result => {
        setResult(result);
        setPhase("game_over");
      });
      socket.on("game_over", () => {
        console.log("LOOOOSER");
      });
      socket.on("lost_life", () => {
        setLives(lives - 1);
      });

      socket.on("round_result", ({ currentQuestionCorrectIndex, players }) => {
        // if (!userAnswer) {
        //   socket.emit("client_answer", {
        //     userName: cookies.userName,
        //     option: null
        //   });
        // }
        setLives(players[cookies.userName].lives);
        setCorrectAnswer(currentQuestionCorrectIndex);
        setPhase("pause");
      });
    }
  }, [socket]);

  if (phase === "answering" && question) {
    return (
      <Wrapper>
        <Container>
          <Card>
            <Wrapper>
              <h2>{question.text}</h2>
              {question.options.map(option => (
                <Option
                  variant="contained"
                  key={option.id}
                  onClick={() => answer(option.id)}
                  disabled={!!(userAnswer && userAnswer !== option.id)}
                  color={
                    userAnswer !== null && userAnswer === option.id
                      ? "primary"
                      : "secondary"
                  }
                >
                  {option.text}
                </Option>
              ))}
              <HeartsRow>
                {lives > 0 &&
                  Array.apply(null, Array(lives)).map((a, i) => <div>❤</div>)}
              </HeartsRow>
              <h1>{timer}</h1>
            </Wrapper>
          </Card>
        </Container>
      </Wrapper>
    );
  } else if (phase === "pause" && question) {
    return (
      <Wrapper>
        <Container>
          <Card>
            <Wrapper>
              <h2>{question.text}</h2>
              {question.options.map(option => (
                <Option
                  variant="contained"
                  key={option.id}
                  disabled={userAnswer !== option.id}
                  color={
                    userAnswer !== null && userAnswer === option.id
                      ? "primary"
                      : "secondary"
                  }
                  right={correctAnswer === option.id ? "asda" : ""}
                  correct={
                    userAnswer === option.id && correctAnswer === option.id
                      ? "a"
                      : ""
                  }
                >
                  {option.text}
                </Option>
              ))}
              <HeartsRow>
                {lives > 0 &&
                  Array.apply(null, Array(lives)).map((a, i) => <div>❤</div>)}
                ️
              </HeartsRow>
            </Wrapper>
          </Card>
        </Container>
      </Wrapper>
    );
  } else if (phase === "game_over") {
    return (
      <Wrapper>
        <Container>
          <Card>
            <Wrapper>{JSON.string(result)}</Wrapper>
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

const HeartsRow = styled.div`
  display: flex;
  font-size: 30px;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: red;
`;
