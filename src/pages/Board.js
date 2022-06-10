import styled from "styled-components";
import { GlobalStyle } from "../components/constant";
import BoardIndex from "../components/board/BoardIndex";

const BoardDiv = styled.div`
  width: 100%;
  height: 100%;
  background:#FFFFFF;
`;

const BoardPage =()=>{

    return(
        <>
            <GlobalStyle/>
            <BoardDiv>
                <BoardIndex />
            </BoardDiv>
        </>
    )
}

export default BoardPage