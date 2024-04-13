import styled from "styled-components";
import BoardIndex from "../components/board/BoardIndex";

const BoardDiv = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
`;

const BoardPage = () => {
  return (
    <>
      <BoardDiv>
        <BoardIndex />
      </BoardDiv>
    </>
  );
};

export default BoardPage;
