import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "@material-ui/core";
import styled from "styled-components";
import { Socket } from "../utils/socket";

export const View = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(Socket());
  }, []);
  useEffect(() => {
    if (socket != null) {
    }
  }, [socket]);
  return (
    <Wrapper>
      <Container>
        <Card>
          <Wrapper>
            <Button
              onClick={() => {
                socket.emit("start_game", 0);
              }}
            >
              START
            </Button>
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

const Option = styled(Button)`
  margin: 5px 0px !important;
`;
