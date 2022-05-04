import React from 'react'
import styled from 'styled-components'

const UserDiv=styled.div`
    width: 40px;
    height: 40px;
    color: #FFFFFF;
    background-color: #5C6BC0;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-weight: 700;
`

function User({isLoggin}) {
    const email=isLoggin["email"]
    const userName= email.toUpperCase().slice(0,1);
    console.log(userName)
  return (
    <UserDiv>
        {userName}
    </UserDiv>
  )
}

export default User