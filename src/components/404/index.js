import { Link } from "react-router-dom";
import styled from "styled-components";
import { Text } from "../constant";

const NotFoundDiv=styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const NotFound=()=>{

    return(
        <NotFoundDiv>
        <Text>查無此分頁，請點擊以下連結返回首頁</Text>
        <Link  to={"/"} style={{textDecoration: "underline"}}>
         <Text>返回首頁</Text>
        </Link>
        </NotFoundDiv>
    )

}

export default NotFound;