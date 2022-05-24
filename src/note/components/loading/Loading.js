import styled,{keyframes} from"styled-components";
import { KeepLogo } from "../../../assets";
import { Media_Query_LG } from "../../../components/constant";


const bars6=keyframes`
    0% {
      height: 5px;
      -webkit-transform: translateY(0px);
              transform: translateY(0px);
      -webkit-transform: translateY(0px);
              transform: translateY(0px);
      background: #FBBC04;
    }
    25% {
      height: 30px;
      -webkit-transform: translateY(15px);
              transform: translateY(15px);
      -webkit-transform: translateY(15px);
              transform: translateY(15px);
      background: #FBBC04;
    }
    50% {
      height: 5px;
      -webkit-transform: translateY(0px);
              transform: translateY(0px);
      -webkit-transform: translateY(0px);
              transform: translateY(0px);
      background: #FBBC04;
    }
    100% {
      height: 5px;
      -webkit-transform: translateY(0px);
              transform: translateY(0px);
      -webkit-transform: translateY(0px);
              transform: translateY(0px);
      background: #FBBC04;
    }
`

const LoadingAnimate=styled.div`
    display: block;
    position: fixed;
    top: 30%;
    left: 50%;
    height: 50px;
    width: 50px;
    ${Media_Query_LG}{
        margin-left: 10px;
    }
`
const Span=styled.span`
    position: absolute;
    display: block;
    bottom: 10px;
    width: 9px;
    height: 5px;
    background: #FBBC04;
    animation:  ${bars6} 1.5s  infinite ease-in-out;
    &:nth-child(2){
        left: 11px;
        animation-delay: 0.2s;
    }&:nth-child(3){
        left: 22px;
        animation-delay: 0.4s;
    }&:nth-child(4){
        left: 33px;
        animation-delay: 0.6s;
    }&:nth-child(5){
        left: 44px;
        animation-delay: 0.8s;
    }
`


const Loading=()=>{

    return(
            
        <LoadingAnimate>
            <Span></Span>
            <Span></Span>
            <Span></Span>
            <Span></Span>
            <Span></Span>
        </LoadingAnimate>
    )

}
export default Loading;