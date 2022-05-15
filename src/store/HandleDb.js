import { db } from "./firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs,addDoc, setDoc, orderBy, collectionGroup,deleteDoc, increment, FieldValue,batch,deleteField, arrayUnion,Timestamp,limit} from "firebase/firestore";
import {getMessaging,getToken } from "firebase/messaging";




//userSignUp
export const saveSignUpdData= async(user)=>{
    console.log(user);
    let uid=user["uid"];
    let email=user["email"];
    let refUser=doc(db,"user",uid);//紀錄使用者uid
    await setDoc(refUser,{email,uid});
}

//Note Lists Data
//save noteData
export const saveNoteData=async(id,noteTitle,noteText,uid,noteColor,timer,currentToken)=>{
    const time=Timestamp.now();
    let refBoard=doc(db,"user",uid,"notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用
    let noteCollection=query(collection(db,"user",uid,"notelist"));//
    let noteCollectionDocs=await getDocs(noteCollection);
    let noteDocsLength=noteCollectionDocs.docs.length +1; //自訂index number
    const whenToNotify=new Date(timer)
    await setDoc(refBoard,{id,noteTitle,noteText,index:noteDocsLength,time,color:noteColor,
        token:currentToken,
        whenToNotify,
        notificationSent:false});
    //儲存Notifications
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
    //存入notelists，方便做listpage的排序跟顯示
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    if(notelistSnap.exists()){
        console.log("notelistSnap",notelistSnap.data());
        await updateDoc(refNotelists,{orderlists:arrayUnion(refBoard)});
    }else{
    await setDoc(refNotelists,{orderlists:arrayUnion(refBoard)});
    }
}

//getALl noteList 
export const getAllLists=async(setData,uid)=>{
    //取得noteLists
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    let result=notelistSnap.data();
    if(result ===undefined ) return {"message":null}
    let num=result["orderlists"].length-1
    let noteLists=[]
    for(let i=num;i>=0;i--){//從後面取得最新
        const listRef=result["orderlists"][i];
        const getListData=await getDoc(listRef);
        noteLists.push(getListData.data());
    }  
    noteLists.forEach((item)=>{//處理時間
        const timeStampDate = item["time"];
        const dateInMillis  = timeStampDate.seconds * 1000;
        var date = "上次編輯時間：" + new Date(dateInMillis).toLocaleDateString()+" " +  new Date(dateInMillis).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        item["time"]=date;
    })
    const noteAllElements= async()=>{//要noteList board資料組合起來
        for(let i=0; i<noteLists.length; i++){
            const boardId=noteLists[i].id;
            const boardref=query(collection(db,"user", uid,"notelist",boardId,"board"))//board的儲存位置
            const boardSnap=await getDocs(boardref);
            const getBoardArr=[]
            boardSnap.forEach((doc)=>{
                const item=doc.data();
                if(item.type !== "pencil"){
                    getBoardArr.push({...item})
                }else{
                    const pointsCopy=item.points
                    const points=Object.keys(pointsCopy).map((key)=>[pointsCopy[key][0],pointsCopy[key][1]])//將points物件轉為array
                    item.points=points//把轉換後的array覆蓋回item
                    getBoardArr.push({...item})
                }   
            }) 
            if(getBoardArr.length>0){
                noteLists[i].board=getBoardArr;
            }else{
                noteLists[i].board="";
            }

        }
        return noteLists
    }
    const noteResults= await noteAllElements();//把Board資料跟noteList結合
    console.log("noteResults",noteResults)
    setData(noteResults);
}

//要根據Drag and drop結果，更新位置update array from firestore
export const updateListsPosition= async (setList,uid)=>{
    let refNotelists=doc(db,"notelists",uid);
    await getDoc(refNotelists);//取得原本的list順序
    let setListDocs=setList.slice(0).reverse().map((item)=>{//加上slice淺拷貝，避免動到原本的array
        const{id}=item;
        let refData=doc(db,"user",uid,"notelist",id);
        return refData
    })
    await setDoc(refNotelists, {orderlists:setListDocs});//用更新後的位置覆蓋掉原本的資料

}

//update Board base 64 to noteData
export const updateBoardData=async(id,url,uid)=>{
    const updateRef=doc(db, "user", uid,"notelist",id);
    const updateData={image:url};
    await updateDoc(updateRef,updateData);//存入image
    //存入notelists for frag and drop
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    if(notelistSnap.exists()){
        await updateDoc(refNotelists,{orderlists:arrayUnion(updateRef)});
    }else{
    await setDoc(refNotelists,{orderlists:arrayUnion(updateRef)});
    }

}

//update note Title and text
export const updateNoteData = async(id,updateTextElements,uid)=>{
    const time=Timestamp.now();
    const updateToDb = doc(db, "user", uid,"notelist",id);
    updateTextElements.time=time;
    await updateDoc(updateToDb, updateTextElements,time);

}

//deleteNoteData+ deleteBoard subcollection
export const deleteDbNote = async(id,uid)=>{
    console.log(id,"id");//刪掉user內容所有內容
    const deleteDbNote = doc(db,"user",uid,"notelist",id);
    const deleteBoardRef=collection(db,`user/${uid}/notelist/${id}/board`);
    await deleteDoc(deleteDbNote);
    const boardSnap=await getDocs(deleteBoardRef);
    boardSnap.forEach((item)=> deleteDoc(item.ref));
    //刪掉noteList的內容
    const refNotelists=doc(db,"notelists",uid);
    const notelistSnap=await getDoc(refNotelists);
    const result=notelistSnap.data();
    const setListDocs=result["orderlists"].filter((item)=>{//過濾掉要刪除的項目
        return item.id !==id
    })
    await setDoc(refNotelists, {orderlists:setListDocs});//用刪除後的array覆蓋掉原本的資料
}

//delete Board
export const deleteBoard = async(id,uid)=>{
    const deleteDbImage = doc(db,"user",uid,"notelist",id);//刪除image路徑
    const deleteBoardRef=collection(db,`user/${uid}/notelist/${id}/board`);//刪除board路徑
    await updateDoc(deleteDbImage,{image:deleteField()});
    const boardSnap=await getDocs(deleteBoardRef);
    boardSnap.forEach((item)=> deleteDoc(item.ref));
}


//Board Datas
//save Board+note data
export const saveBoardData= async (elements,id,noteTitle,noteText,uid,noteColor,timer,currentToken)=>{//存放物件用
    const time=Timestamp.now();
    const refBoard=doc(db,"user",uid,"notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用
    let noteCollection=query(collection(db,"user",uid,"notelist"));//
    let noteCollectionDocs=await getDocs(noteCollection);
    let noteDocsLength=noteCollectionDocs.docs.length +1; //自訂index number
    const whenToNotify=new Date(timer);
    await setDoc(refBoard,{id,noteTitle,noteText,index:noteDocsLength,
        time,color:noteColor,                    
        token:currentToken,
        whenToNotify,
        notificationSent:false});
     //儲存Notifications
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
    const drawElement=async (element)=>{
        // const boardRef=db.collection("user").doc("one").collection("board").doc();
        const ref=collection(db,"user",uid,"notelist",id,"board")//board的儲存位置
        if(element.type !=="pencil" ) {
            const {id, x1, y1, x2, y2, type, color,range}=element;
            const docRef= await addDoc(ref,{id, x1, y1, x2, y2, type, color,range})
        }else{
            const{id,type,color,range,points }=element
            const pointsCopy= points.map((point)=>({...point}))
            const docRef2=await addDoc(ref,{id,type,color,range,points:pointsCopy })
        }
    }
    drawElement( elements);
    //存入notelists，方便做listpage的排序跟顯示
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    if(notelistSnap.exists()){
        console.log("notelistSnap",notelistSnap.data());
        await updateDoc(refNotelists,{orderlists:arrayUnion(refBoard)});
    }else{
    await setDoc(refNotelists,{orderlists:arrayUnion(refBoard)});
    }
}

//get board data
export const getBoardData= async(id,uid)=>{
    const ref=query(collection(db,"user", uid,"notelist",id,"board"))//board的儲存位置
    const docSnap=await getDocs(ref);
    const getBoardArr=[]
    docSnap.forEach((doc)=>{
    const item=doc.data();
    if(item.type !== "pencil"){
        getBoardArr.push({...item})
    }else{
        const pointsCopy=item.points
        const points=Object.keys(pointsCopy).map((key)=>[pointsCopy[key][0],pointsCopy[key][1]])//將points物件轉為array
        item.points=points//把轉換後的array覆蓋回item
        getBoardArr.push({...item})
    }
    })
    return getBoardArr
}



//Time Push notification
//crete function to get token in order to push notification
//import messaging module
const messaging=getMessaging();
const publicVapidKey=process.env.REACT_APP_VAPID_KEY;

export const requestForToken=async(uid,noteTitle,noteText,timer,id)=>{//取得token
        return getToken(messaging,{vapidKey:publicVapidKey})
        .then((currentToken) => {
          if (currentToken) {
            console.log(currentToken)
            const time=new Date(timer);
            console.log("uid,id,time,currentToken,noteTitle,noteText",uid,id,time,currentToken,noteTitle,noteText)
            const response= saveNotification(uid,id,time,currentToken,noteTitle,noteText);
            console.log(uid,id,time,currentToken,noteTitle,noteText,response)
            return response
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

//save data to db
const saveNotification= async(uid,id,time,currentToken,noteTitle,noteText)=>{
    console.log(uid,id,time,currentToken,noteTitle,noteText)
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
    const updateRef=doc(db, "user", uid,"notelist",id);
    const updateData={whenToNotify:time};
    await updateDoc(updateRef,updateData);//存入NotifyTime，in order to show in fronted
    return {message:true};
}

//Search if notification reservation 查詢指定ID的預定notification
export const queryNotification=async(uid,id)=>{
    const q=query(collection(db,"user",uid,"notelist"),where("id","==",id)) ;//
    const docShop =await getDocs(q);
    const response=[];
    if(!docShop.empty){
        docShop.forEach(item=> {
            const data=item.data();
            const timeStampDate = data["whenToNotify"]["seconds"];
            console.log("timeStampDate",timeStampDate,data)
            // const dateInMillis  = timeStampDate * 1000;
            // const whenToNotify =new Date(dateInMillis).toLocaleDateString(undefined,{month:"short",day:"numeric"})+" " +  new Date(dateInMillis).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
            response.push( {whenToNotify:timeStampDate,uid,id})
        })
    }else{
        return {error:"no data"}
    }
    return response[0]
}
  
//DELETE notification reservation 刪除預定時間
export const deleteNotification=async (uid,id)=>{
    const q=query(collection(db,"user",uid,"notifications"),where("id","==",id)) ;
    const docShop =await getDocs(q);
    docShop.forEach(item=>{
        deleteDoc(item.ref)
    });
    //更新noteList主資料區
    const updateRef=doc(db, "user", uid,"notelist",id);
    const updateData={whenToNotify:""};
    await updateDoc(updateRef,updateData);//存入NotifyTime，in order to show in fronted
    return {success:true}
}
