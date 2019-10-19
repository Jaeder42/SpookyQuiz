import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "@material-ui/core";
import styled from "styled-components";
import { Socket } from "../utils/socket";

export const View = () => {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [question, setQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (timer > 0) setTimer(timer - 1);
    }, 1000);
  }, [timer]);

  useEffect(() => {
    setSocket(Socket(""));
  }, []);
  useEffect(() => {
    if (socket != null) {
      socket.on("player_joined", players => {
        setPlayers(players);
      });
      socket.on("round_result", ({ currentQuestionCorrectIndex, players }) => {
        setCorrectAnswer(currentQuestionCorrectIndex);
      });
      socket.on("new_round", result => {
        setCorrectAnswer(null);

        setQuestion({
          text: result.question,
          options: result.answers.map((val, i) => ({ id: i, text: val }))
        });
      });
    }
  }, [socket]);

  const GO = () => {
    socket.emit("new_game", 2);
    setStarted(true);
    setTimer(10);
  };
  return (
    <Wrapper>
      <Container>
        <Card>
          <Wrapper>
            {!started && (
              <Option onClick={GO} variant="contained" color="primary">
                START
              </Option>
            )}
            {timer > 0 && <h1>{timer}</h1>}
            {!!question && (
              <Wrapper>
                <h2 dangerouslySetInnerHTML={{ __html: question.text }} />
                {question.options.map(option => (
                  <Option
                    variant="contained"
                    key={option.id}
                    color="secondary"
                    right={correctAnswer === option.id ? "asda" : ""}
                  >
                    {option.text}
                  </Option>
                ))}
              </Wrapper>
            )}
            <PlayerContainer>
              {Object.keys(players).map(key => (
                <Player>
                  <PlayerText>
                    <div>{key}</div> Points:{players[key].points} Lives:
                    {players[key].lives > 0 &&
                      Array.apply(null, Array(players[key].lives)).map(
                        (a, i) => "❤"
                      )}
                  </PlayerText>
                </Player>
              ))}
            </PlayerContainer>
          </Wrapper>
        </Card>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Player = styled.div`
  margin: 10px 10px;
  padding: 10px;
  background-color: #212121;
  border-radius: 10px;
`;

const PlayerText = styled.span`
  color: orange;
  font-size: 20px;
`;
const PlayerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;
const Option = styled(Button)`
  margin: 5px 0px !important;
  ${({ correct }) => (correct ? "background-color: green !important" : "")};
  ${({ right }) => (right ? "border: 10px solid green !important;" : "")};
`;
