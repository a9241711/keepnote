import { useContext,useState } from "react";
import AuthContext from "../store/AuthContext";
import { BgRoundDiv } from "../components/constant";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LogIn=()=>{


    return(
        <BgRoundDiv    >
        <Link  to={"/login"} style={{textDecoration: "none"}}>
        登入
        </Link>
      </BgRoundDiv>

    )

}

export default LogIn