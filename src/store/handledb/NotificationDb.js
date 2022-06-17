import { db } from "../firebase";
import { collection,updateDoc, query,where, getDocs,addDoc, orderBy,deleteDoc,Timestamp} from "firebase/firestore";
import {getMessaging,getToken } from "firebase/messaging";

//**Time Push notification 提醒*/
//crete function to get token in order to push notification
//import messaging module
const messaging=getMessaging();
const publicVapidKey=process.env.REACT_APP_VAPID_KEY;

export const requestForToken=async(uid,noteTitle,noteText,timer,id)=>{//取得token
        return getToken(messaging,{vapidKey:publicVapidKey})
        .then((currentToken) => {
          if (currentToken) {
            const time=new Date(timer);
            const response= saveNotification(uid,id,time,currentToken,noteTitle,noteText);
            return response;
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // ...
        });
  }

//save notitfication data to db
const saveNotification= async(uid,id,time,currentToken,noteTitle,noteText)=>{
    const q=query(collection(db,"user",uid,"notifications"),where("id","==",id));
    const docShop=await getDocs(q);
    if(!docShop.empty){
        docShop.forEach(item=> {
            updateDoc(item.ref,{
                    id,
                    title:noteTitle,
                    text:noteText,
                    uid,
                    token:currentToken,
                    whenToNotify:time,
                    notificationSent:false
                })
            })     
    }else{
        const notificationRef=collection(db,"user",uid,"notifications");
        addDoc(notificationRef,{
                 id,
                 title:noteTitle,
                 text:noteText,
                 uid,
                 token:currentToken,
                 whenToNotify:time,
                 notificationSent:false
             });
    }
    //更新noteList主資料區
    return {message:true};
}

//Search if notification reservation 查詢指定ID的預定notification
export const queryNotification=async(uid,id)=>{
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
     const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下

        const originData=[];
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        const q=query(collection(db,"user",uid,"notifications"),where("id","==",id),orderBy("whenToNotify","desc"));//
        const docShop =await getDocs(q);
        const response=[];
        if(!docShop.empty){
            docShop.forEach(item=> {
                const data=item.data();
                const timeStampDate = data["whenToNotify"]["seconds"];
                if(typeof timeStampDate =="undefined") {
                    response.push( {error:"no data"});
                    return
                }
                response.push( {whenToNotify:timeStampDate,uid,id});
            })
        }else{
            return {error:"no data"};
        }
        return response[0];
    }
    const q=query(collection(db,"user",uid,"notifications"),where("id","==",id),orderBy("whenToNotify","desc"));//
    const docShop =await getDocs(q);
    const response=[];
    if(!docShop.empty){
        docShop.forEach(item=> {
            const data=item.data();
            const timeStampDate = data["whenToNotify"]["seconds"];
            if(typeof timeStampDate =="undefined") {
                response.push( {error:"no data"});
                return
            }
            response.push( {whenToNotify:timeStampDate,uid,id});
        })
    }else{
        return {error:"no data"};
    }
    return response[0];
}
  
//DELETE notification reservation 刪除預定時間
export const deleteNotification=async (uid,id)=>{
    const q=query(collection(db,"user",uid,"notifications"),where("id","==",id)) ;
    const docShop =await getDocs(q);
    docShop.forEach(item=>{
        deleteDoc(item.ref);
    });
    //更新noteList主資料區
    // const updateRef=doc(db, "user", uid,"notelist",id);
    // console.log()
    // const time=Timestamp.now();
    // await updateDoc(updateRef, {time:time});
    return {success:true};
}



