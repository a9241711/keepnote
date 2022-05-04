import styled,{createGlobalStyle,keyframes} from "styled-components";


export const Media_Query_SM='@media screen and (max-width:767px)';
export const Media_Query_MD='@media screen and (max-width:1023px)';
export const Media_Query_LG='@media screen and (min-width:1024px)';



export const GlobalStyle=createGlobalStyle`
  *{
    margin:0;
    padding:0;
  }
  body{
    margin:0;
    padding:0;
    font-size:16px;
  }

`

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
  font-size: 16px;
  color: #202124;
  font-weight: 400;
  font-family: Roboto, Arial, sans-serif;
  pointer-events: none;
  margin:0;
  transition: all ease-in-out .2s; 
  word-break: break-all;
`;

export const NoteTitleInput = styled.textarea.attrs({
  name: "title",
  placeholder: "標題",
  rows:2,
  cols:20,
})`
  font-size: 18px;
  font-weight: 700;
  width: 580px;
  resize:none;
  height: auto;
  border: none;
  padding:10px 20px;
  outline: none;
  box-sizing: border-box;
  background-color:#ffffff;
  overflow: hidden;
  ::placeholder {
    font-size: 16px;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
  }
  &:focus {
    background-color: #ffffff;
  }
`;

export const NoteTextInput = styled(NoteTitleInput).attrs({
  name: "text",
  placeholder: "新增記事",
  rows:3,
  cols:20,
})`
  font-size: 14px;
  font-weight: 400;
`;

export const Button=styled.button`
  width: 100px;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  border: none;
  border-radius: 5%;
  background-color: #F1F3F4;
  transition: all ease-in-out .2s; 
  margin:0 5px;
  &:hover{
    cursor: pointer;
    border: 1px solid #888;
    background-color: #ddd;
  }
`
export const IconTipText=styled.span`
    visibility: hidden;
    width: 100%;
    background-color: rgba(0,0,0,0.8);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    top:100%;
    left: 0;
`
export const IconDiv=styled.div`
    position: relative;
    z-index: 0;
    width:32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-in-out .2s; 
    &:hover{
        background-color: rgba(95,99,104,0.157);
        border-radius: 50%;
        cursor:pointer;
    }
    &:hover ${IconTipText}{
      visibility: visible;
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
//特效區
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