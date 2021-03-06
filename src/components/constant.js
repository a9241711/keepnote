import styled,{createGlobalStyle,keyframes} from "styled-components";

export const Media_Query_SM='@media screen and (min-width: 320px) and (max-width: 480px) ';
export const Media_Query_SMD='@media screen and (min-width: 481px) and (max-width: 768px) ';
export const Media_Query_MD='@media screen and (min-width:769px) and (max-width: 1023.99px)';
export const Media_Query_LG='@media screen and (min-width:1024px)';

// 共用global 
export const GlobalStyle=createGlobalStyle`
  *{
    margin:0;
    padding:0;
  }
  html {
  min-width: 100%;
  min-height: 100%;
}
  body{
    height:100%;
    margin:0;
    padding:0;
    font-size:16px;
    color: #202120;;
  }

`
// 共用pop up bg fixed div
export const ListPopModifyBg = styled.div`//修改文字的Fixed背景顏色，觸控版關閉
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(121, 122, 124, 0.6);
    z-index: 999;
    /* ${Media_Query_SMD}{
      display: none;
    }
    ${Media_Query_SM}{
      display: none;
    } */
`;

export const H1 = styled.h1`
  font-size: 36px;
  margin:5px 0;
  color: #FBBC04;
`;
export const H2 = styled.h2`
  font-size: 30px;
  margin:0;
  color: red;
`;
export const H3 = styled.h3`
  font-size: 24px;
  color: #202124;
  font-weight: 700;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  margin:5px 0;
`;

export const Text = styled.p`
  font-size: 14px;
  color: #202124;
  font-weight: 400;
  font-family: Roboto, Arial, sans-serif;
  pointer-events: none;
  margin:0;
  transition: all ease-in-out .2s; 
  word-break: break-all;
  line-height: 1.5rem;
  cursor:default;
`;

export const NoteTitleInput = styled.textarea.attrs({
  name: "title",
  placeholder: "新增記事...",
  rows:2,
  cols:20,
})`
  height: auto;
  font-size: 22px;
  font-weight: 400;
  resize:none;
  border: none;
  outline: none;
  box-sizing: border-box;
  background-color:transparent;
  overflow: hidden;
  margin:10px;
  ::placeholder {
    font-size: 16px;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
  }
  &:focus {
    background-color: transparent;
  }
`;

export const NoteTextInput = styled(NoteTitleInput).attrs({
  name: "text",
  placeholder: "內文",
  rows:3,
  cols:20,
})`
  font-size: 16px;
`;

export const Button=styled.button`//提交按鈕
  width: 100px;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  border: none;
  border-radius: 40px 40px;
  transition: all ease-in-out .5s; 
  margin:0 5px;
  outline: none;
  background-color: transparent;
  @media screen and (max-width:1024px){//觸控版
    background-color: #FBBC04;
    color:#FFFFFF;
    &:active{
    border: 1px solid #FBBC04 ;
    background-color: #FFFFFF;
    color: black;
  }
  }
  @media screen and (min-width:1024px){//桌機
    &:hover{
    cursor: pointer;
    border:  1px solid black ;
    background-color: rgba(0,0,0,0.039);
    color:black;
    outline: none;
  }
  }
`
export const CloseButton=styled(Button)`//取消按鈕
  &:hover{
    border: 1px solid #FBBC04 ;
    color: black;
  }
  @media screen and (max-width:1024px){//觸控版
    background-color: transparent;
    color:black;
    &:active{
    border: 1px solid #FBBC04 ;
    background-color: #FFFFFF;
    color: black;
  }
  }
  @media screen and (min-width:1024px){//桌機
    &:hover{
    cursor: pointer;
    border: none;
    background-color: rgba(0,0,0,0.039);
    outline: none;
  }
  }
`

export const IconTipText=styled.span`
    font-size: 12px;
    visibility: hidden;
    background-color: rgba(0,0,0,0.8);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    top:90%;
    left: 50%;
    transform: translateX(-50%);
    word-break: keep-all;
    z-index: 500;
    @media screen and (min-width: 320px) and (max-width: 480px){
    display: none;
    }
    @media screen and (min-width: 481px) and (max-width: 768px){
    display: none;
    }
`
export const IconDiv=styled.div`
    position: relative;
    z-index: 10;
    width:32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-in-out .2s; 
    padding:2.5px;
    background-repeat: no-repeat;
    background-position: center;
    @media screen and (min-width:1024px){//桌機版
      &:hover{
        background-color: rgba(95,99,104,0.157);
        opacity: 0.87;
        border-radius: 50%;
    }
      &:hover ${IconTipText}{
        visibility: visible;
      }
  }
`

//小工具背景變成圓形的專用div

export  const BgRoundDiv=styled.div`
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    transition: all ease-in-out .3s;
    &:hover{
        border-radius: 50%;
        background:rgba(99,99,104,0.157);
        cursor: pointer;
    }
`
//特效區 //Show up
//click icon背景色變化
export const ClickIconAnimate=keyframes`
  from{
    background-color:#999999;
  }
  to{
    background-color:white;
  }
`;

//小到大的放大框 
export const LargerAnimate=keyframes`
  0% {
    -webkit-transform: scale(0);
            transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 1;
  }
`

export const bounceInLeft=keyframes`
  0% {
    -webkit-transform: translateX(-600px);
            transform: translateX(-600px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateX(0px);
            transform: translateX(0x);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
`

//Close
//大到小的縮小框 
export const SmallAnimate=keyframes`
  0% {
    -webkit-transform: scale(0);
            transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 1;
  }
`

//Hover fadeIn
export const fadeIn= keyframes` 
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 `
//由上至下展開
export const scaleUp= keyframes`
  0% {
    -webkit-transform: scaleY(0.4);
            transform: scaleY(0.4);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
  }
  100% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
  }
`

//由右至左
export const scaleRight=keyframes`
  0% {
    -webkit-transform: scaleX(0);
            transform: scaleX(0);
    -webkit-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(1);
            transform: scaleX(1);
    -webkit-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
    opacity: 1;
}
`

//由下至上
export const scaleBottom=keyframes`
    0% {
    -webkit-transform: scaleY(0);
            transform: scaleY(0);
    -webkit-transform-origin: 0% 100%;
            transform-origin: 0% 100%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1);
    -webkit-transform-origin: 0% 100%;
            transform-origin: 0% 100%;
    opacity: 1;
  }

`