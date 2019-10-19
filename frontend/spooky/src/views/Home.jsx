import React, { useState } from "react";
import { Container, Button, TextField } from "@material-ui/core";
import { Card } from "@material-ui/core";
import styled, { keyframes } from "styled-components";
import { useCookies } from "react-cookie";

export const Home = ({ history }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["spooky"]);
  const [name, setName] = useState(cookies.userName);
  const [roomCode, setRoomCode] = useState("");

  const handleChangeName = val => {
    setName(val.target.value);
    setCookie("userName", val.target.value);
  };

  const goToRoom = () => {
    history.push(`/play/${roomCode}`);
  };

  const handleChangeRoomCode = val => {
    setRoomCode(val.target.value);
  };

  return (
    <Wrapper>
      <Container>
        <Card>
          <Wrapper>
            <h1>Welcome to spooky quiz!</h1>
            <br />
            <Rotate>🎃</Rotate>
            <br />
            <TextField
              label="Spooky name"
              value={name}
              onChange={handleChangeName}
              margin="normal"
            />
            <br />
            <TextField
              label="Room code"
              value={roomCode}
              onChange={handleChangeRoomCode}
              margin="normal"
            />
            <br />

            <Button
              variant="contained"
              color="secondary"
              disabled={!name}
              onClick={goToRoom}
            >
              Join
            </Button>
          </Wrapper>
        </Card>
      </Container>
    </Wrapper>
  );
};

// Create the keyframes
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 4rem;
`;

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;
