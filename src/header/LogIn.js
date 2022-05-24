
import { BgRoundDiv } from "../components/constant";

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