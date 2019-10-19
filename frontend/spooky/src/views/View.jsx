import React, { useState } from "react";
import { Container, Card, Button } from "@material-ui/core";
import styled from "styled-components";

export const View = () => {
  const question = {
    text: "One of these is the correct answer, which one?",
    options: [
      { id: 0, text: "Answer 1" },
      { id: 1, text: "Answer 2" },
      { id: 2, text: "Answer 3" },
      { id: 3, text: "Answer 4", correct: true }
    ]
  };

  return (
    <Wrapper>
      <Container>
        <Card>
          <Wrapper>
            <h2>{question.text}</h2>
            {question.options.map(option => (
              <Option variant="contained" color={"secondary"}>
                {option.text}
              </Option>
            ))}
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
