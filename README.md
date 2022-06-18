# KeepNote 

KeepNote is a user-friendly note-taking website letting users capture ideas in all applications.

KeepNote是一個圖文記事網站。簡單、方便、即時性，手機、平板還是電腦，所有裝置皆可使用。
## Catalog
- [Live Demo](#live-demo)

- [Features](#features)
  - [#1 Add Text and Background color](#1️⃣-add-text-and-background-color)
  - [#2 Drawing Board](#2️⃣-drawing-board)
  - [#3 Note Notification](#3️⃣-note-notification)
  - [#4 Share Note Permission](#4️⃣-share-note-permission)
  - [#5 Keyword Search](#5️⃣-keyword-search)
  - [#6 Member System](#6️⃣-member-system)
  - [#7 Drag n Drop](#7️⃣-drag-n-drop)
- [Skills Structure](#skills-structure)
- [Backend Technique](#backend-technique)
    - [Firebase](#firebase)
- [Frontend Technique](#frontend-technique)
    - [Components Structure](#components-structure)
    - [React (hook)](#react-hook)
    - [React Router](#react-router)
    - [Styled-Components](#styled-components)
    - [Third-Party Library](#third-party-library)
- [Contact](#contact)
  
## Live Demo
[Link](https://keepproject-e7d2b.web.app/)
#### Test Account
| - | - |
| -------- | -------- |
| Account | test@gmail.com |
| Password | 123456 |



## Features
### 1️⃣ Add Text and Background color
![Imgur](https://i.imgur.com/iazEOGS.gif)
RWD支援行動載具  
![Imgur](https://i.imgur.com/gTUbOJX.gif)


### 2️⃣ Drawing Board
結合Custom Hook,Canvas Api,Rough.js，提供多種畫板工具，讓使用者可以新增、修改畫版，下載圖片檔並儲存圖畫  
Integrate Custom Hook, Canvas Api, Rough.js. Provide Multiple tools for users to create and redo the pattern drawn by themselves. 
After finished, users can download the pattern as an image file and save the image on the website.
![Imgur](https://i.imgur.com/Offview.gif)
Support Mobile devices used by using touch event.支援行動裝置使用  
![Imgur](https://i.imgur.com/0WIZ09R.gif)
  
### 3️⃣ Note Notification
桌機版訊息通知，結合firebase cloud message 和 cloud function，時間到彈出視窗提醒  
Note Notifications for desktop computers. Integrated firebase cloud message and cloud function, 
automatically sending notifications to users while time is up.
![Imgur](https://i.imgur.com/cKpnjo9.gif)
 
### 4️⃣ Share Note Permission
分享權限給其他人，共同編輯記事，並結合Sendgrid發送邀請郵件。僅擁有者可刪除記事  
Share permission, cooperate with others to co-editing the note and integrate with Sendgrid to send the email to the shared user.  
Only note owner allowed to delete.
![Imgur](https://i.imgur.com/UXW6hgm.gif)

### 5️⃣ Keyword Search
![Imgur](https://i.imgur.com/BZZsIQD.png)

### 6️⃣ Member System
整合firebase authentification第三方服務，可用Google登入  
Integrate Firebase authentification allowing users to log in with a Google account.

### 7️⃣ Drag n Drop
![Imgur](https://i.imgur.com/L4mmPKn.gif)

## Skills Structure
![Imgur](https://i.imgur.com/rErG74z.png)

## Backend Technique
### Firebase
- Cloud message
- Cloud Function
- Authentification
- Cloud Storage for frontend SPA

# Frontend Technique

### React (hook)
- SPA with functional components
### Custom Hook
useHistoryPosition for the undo-redo feature and element state on the drawing board.
### Components Structure
![Imgur](https://i.imgur.com/TbwwWpF.png)

### React Router
- SPA routing

### Styled-Components
- Maintainable and easy scalability for CSS

### Third Party Library
- rough.js for Canvas used
- React-Beautiful-Dnd for Drag n Drop on Modile device
- React-Masonry-Css
- Sendgrid

# Contact
👨 周代恆  
E-mail : a9241711@gmail.com
