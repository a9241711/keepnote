import styled,{createGlobalStyle} from "styled-components";

export const GlobalStyle=createGlobalStyle`
  body{
    margin:0;
    padding:0;
    font-size:14px;
  }

`

export const H1 = styled.h1`
  font-size: 36px;
  color: red;
`;
export const H2 = styled.h1`
  font-size: 30px;
  color: red;
`;
export const H3 = styled.h1`
  font-size: 22px;
  color: #202124;
  font-weight: 400;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
`;

export const Text = styled.p`
  font-size: 16px;
  color: #202124;
  font-weight: 400;
  font-family: Roboto, Arial, sans-serif;
  pointer-events: none;
`;

export const NoteTitleInput = styled.textarea.attrs({
  name: "title",
  placeholder: "標題",
  rows:2,
  cols:20,
})`
  width: 100%;
  height: auto;
  border: none;
  padding:10px 20px;
  margin:10px 0;
  outline: none;
  resize:none;
  box-sizing: border-box;
  background-color:#ffffff;
  ::placeholder {
    font-size: 16px;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
  }
  &:focus {
    background-color: #ffffff;
  }
`;

export const NoteTextInput = styled.textarea.attrs({
  name: "text",
  placeholder: "新增記事",
  rows:2,
  cols:20,
})`
  width: 100%;
  height: auto;
  border: none;
  padding:10px 20px;
  margin:10px 0;
  outline: none;
  resize:none;
  box-sizing: border-box;
  background-color:#ffffff;
  ::placeholder {
    font-size: 16px;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
  }
  &:focus {
    background-color: #ffffff;
  }
`;

