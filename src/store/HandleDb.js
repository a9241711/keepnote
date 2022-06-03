import { db } from "./firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs,addDoc, setDoc, orderBy, collectionGroup,deleteDoc, increment, FieldValue,batch,deleteField, arrayUnion,Timestamp,limit, arrayRemove} from "firebase/firestore";
import {getMessaging,getToken } from "firebase/messaging";
import { mailPermissionSend } from "./thirdpary/permissionMail";

//**userSignUp Memeber*/
export const saveSignUpdData= async(user)=>{
    console.log(user);
    let uid=user["uid"];
    let email=user["email"];
    let providerId=user["providerId"]
    let refUser=doc(db,"user",uid);//紀錄使用者uid
    let notelistSnap=await getDoc(refUser);
    if(notelistSnap.exists()){
        return
    }else{
        await setDoc(refUser,{email,uid,providerId});
    }
}

//更新個人圖像
export const updateUserImg=async(uid,url)=>{
    const userRef=doc(db,"user",uid);//使用者資料路徑
    const updateData={profileUrl:url};
    await updateDoc(userRef,updateData);
}

//讀取個人圖像
export const queryUserImg=async(uid)=>{
    const userRef=doc(db,"user",uid);//使用者資料路徑
    const snapShot=await getDoc(userRef);
    const response=snapShot.data();
    console.log("respinse",response)
    if(!response.profileUrl){
        return null
    }else{
        return {profileUrl:response.profileUrl}
    }
}


//Note Lists Data
//save noteData
export const saveNoteData=async(id,noteTitle,noteText,uid,noteColor,timer,currentToken,emailList)=>{
    console.log("emailList",emailList)
    const time=Timestamp.now();
    const refBoard=doc(db,"user",uid,"notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用
    // const noteCollection=query(collection(db,"user",uid,"notelist"));//
    // const noteCollectionDocs=await getDocs(noteCollection);
    const noteStatus=0 //自訂note狀態，初始值為0，若封存為1
    if(timer!==1){//表示有設定notification
        console.log("timer")
        const whenToNotify=new Date(timer);
        await setDoc(refBoard,{id,noteTitle,noteText,time,color:noteColor,
            token:currentToken,
            // whenToNotify,
            noteStatus,
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
                        whenToNotify:whenToNotify,
                        noteStatus,
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
                     whenToNotify:whenToNotify,
                     noteStatus,
                     notificationSent:false
                 });
        }
    }else{
        await setDoc(refBoard,{id,noteTitle,noteText,time,color:noteColor,noteStatus});
    }
    if(typeof emailList !=="undefined"){//代表有值
        const originUser=await getDocs(query(collection(db,"user",),where("uid","==",uid)));//要分享權限的人
        const originUserRef=[];
        originUser.forEach((item)=>{
            originUserRef.push(item.data());
        })
        //處理email List
        for(let i =0; i<emailList.length;i++){
            const userQ=query(collection(db,"user",),where("email","==",emailList[i]));//找到被分享對象
            const userCollectionDocs=await getDocs(userQ);//被分享對象
            const targetUserRef=[];
            console.log("userCollectionDocs",userCollectionDocs,!userCollectionDocs.empty)
            userCollectionDocs.forEach(item=>{
                targetUserRef.push(item.data());//該user的uid，若無註冊的用戶會回傳[]
            })
            //存入目標用戶的email
            const updateData={permissionEmail:arrayUnion(emailList[i]),permissionUid:arrayUnion(targetUserRef[0]["uid"])}
            await updateDoc(refBoard,updateData)//refBoard是擁有者的文件路徑
            console.log(originUserRef[0]["email"],targetUserRef,updateData);
            //目標用戶的資料處理
            // const targetDataRef=doc(db,`user/${targetUserRef[0]["uid"]}/notelist/${id}`);//目標用戶的資料ref
            const permissionListsRef=doc(db,"user",targetUserRef[0]["uid"],"permissionLists",id);
            const targetData={id,originDataRef:refBoard,targetEmail:originUserRef[0]["email"],targetUid:originUserRef[0]["uid"],noteStatus:0}
            await setDoc (permissionListsRef,targetData)//存到目標用戶底下
            //存入notelists，方便做listpage的排序跟顯示，Target Eamail
            const targetNotelists=doc(db,"notelists",targetUserRef[0]["uid"]);
            const notelistSnap=await getDoc(targetNotelists);
            if(notelistSnap.exists()){
                await updateDoc(targetNotelists,{orderlists:arrayUnion(refBoard)});
            }else{
                await setDoc(targetNotelists,{orderlists:arrayUnion(refBoard)});
            }
        }
        mailPermissionSend(originUserRef[0]["email"],emailList);//新增資料至mail，傳送訊息
    }
    
    // //存入notelists，方便做listpage的排序跟顯示
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    if(notelistSnap.exists()){
        await updateDoc(refNotelists,{orderlists:arrayUnion(refBoard)});
    }else{
        await setDoc(refNotelists,{orderlists:arrayUnion(refBoard)});
    }
}

//getALl ArchiveLists where noteStatus ===1
export const getAllArchiveLists=async(setArchiveLists,uid)=>{
    //取得noteLists
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    let result=notelistSnap.data();
    console.log(result)
    if(result ===undefined ) {//若無資料
        setArchiveLists([]);
        return}
    let num=result["orderlists"].length-1
    let noteLists=[];
    for(let i=num;i>=0;i--){//從後面取得最新
        const listRef=result["orderlists"][i];
        const getListData=await getDoc(listRef);
        const getListId=getListData.data().id;//取得id，為了檢查是否permissionList有資料
        console.log(typeof getListData);
        //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
        const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",getListId));//若有該id表示是被分享權限
        const permissionDocShop =await getDocs(permissionQ);
        if(!permissionDocShop.empty){//若確定有該id，則執行以下
            const originList=[];//取得permission資訊
            permissionDocShop.forEach(item=>{
                originList.push(item.data());
            });
            if(originList[0].noteStatus===1){//確認狀態為1，已封存
                const orginData=getListData.data();//取得原始資料
                orginData["owner"]=false;//非記事擁有者
                orginData["targetEmail"]=originList[0].targetEmail;//擁有記事所有權的帳號
                noteLists.push(orginData);//取得原始資料
            }
        }else{//若非permission內的資料
            if(getListData.data().noteStatus===1){
                const orginData=getListData.data();//取得原始資料
                orginData["owner"]=true;//記事擁有者
                noteLists.push(orginData);//取得原始資料
            }
        }
    }  
    noteLists.forEach((item)=>{//處理時間
        const timeStampDate = item["time"];
        const dateInMillis  = timeStampDate.seconds * 1000;
        var date = "上次編輯時間：" + new Date(dateInMillis).toLocaleDateString()+" " +  new Date(dateInMillis).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        item["time"]=date;
    })
    setArchiveLists(noteLists);
}

//getALl noteList where noteStatus ===0
export const getAllLists=async(getFilterButDataChange,isFilter,getOriginData,setData,uid)=>{
    //取得noteLists
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    let result=notelistSnap.data();

    if(result ===undefined || Object.keys(result).length===0 ) {//若無資料
        setData([]);
        getOriginData([]);
        return};
    let num=result["orderlists"].length-1
    let noteLists=[];
    for(let i=num;i>=0;i--){//從後面取得最新
        const listRef=result["orderlists"][i];
        const getListData=await getDoc(listRef);
        const getListId=getListData.data().id;//取得id，為了檢查是否permissionList有資料
        const getListPermissionEmail=getListData.data().permissionEmail;//取得permissionEmail，為了檢查是否permissionEmail有資料
        //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
        const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",getListId));//若有該id表示是被分享權限
        const permissionDocShop =await getDocs(permissionQ);
        if(!permissionDocShop.empty){//若確定有該id，則執行以下
            const originList=[];//取得permission資訊
            permissionDocShop.forEach(item=>{
                originList.push(item.data());
            });
            if(originList[0].noteStatus===0){//確認狀態為0，未封存
                const orginData=getListData.data();//取得原始資料
                orginData["owner"]=false;//非記事擁有者
                orginData["targetEmail"]=originList[0].targetEmail;//擁有記事所有權的帳號
                //取得whenToNotify from notifications
                const q=query(collection(db,"user",uid,"notifications"),where("id","==",getListId),orderBy("whenToNotify","desc"));//
                const docShop =await getDocs(q);
                console.log(getListId,docShop,originList)
                if(!docShop.empty){
                    docShop.forEach(item=> {
                        const notification=item.data()["whenToNotify"];
                        orginData["whenToNotify"]=notification;
                    })
                }
            noteLists.push(orginData);
            }
        }
        else if (typeof getListPermissionEmail !=="undefined" && getListPermissionEmail.length >0){//permissionEmail有分享權限
            if(getListData.data().noteStatus===0){
                const orginData=getListData.data();
                orginData["owner"]=true;//記事擁有者
                orginData["permissionEmail"]=getListPermissionEmail;//有已分享權限的帳號
                //取得whenToNotify from notifications
                const q=query(collection(db,"user",uid,"notifications"),where("id","==",getListData.data()["id"]),orderBy("whenToNotify","desc"));//
                const docShop =await getDocs(q);
                if(!docShop.empty){
                    docShop.forEach(item=> {
                        const notification=item.data()["whenToNotify"];
                        console.log("notification",notification);
                        orginData["whenToNotify"]=notification;
                        })
                    }
                noteLists.push(orginData);
            }
        }
        else{//若非permission內的資料，且permissionEmail沒有資料
            if(getListData.data().noteStatus===0){
                const orginData=getListData.data();
                orginData["owner"]=true;//記事擁有者
                orginData["permissionEmail"]=[];//無任何已分享權限的帳號
                //取得whenToNotify from notifications
                const q=query(collection(db,"user",uid,"notifications"),where("id","==",getListData.data()["id"]),orderBy("whenToNotify","desc"));//
                const docShop =await getDocs(q);
                if(!docShop.empty){
                    docShop.forEach(item=> {
                        const notification=item.data()["whenToNotify"];
                        console.log("notification",notification);
                        orginData["whenToNotify"]=notification;
                        })
                    }
                noteLists.push(orginData);
            }
        }
    }  
    noteLists.forEach((item)=>{//處理Time時間顯示
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
    setData(noteResults);
    if(isFilter){//已有篩選search
        getFilterButDataChange(true);
        getOriginData(noteResults);
    }else{//沒有篩選search
        getOriginData(noteResults);
    }
}

//要根據Drag and drop結果，更新位置update array from firestore
export const updateListsPosition= async (setList,uid)=>{
    let refNotelists=doc(db,"notelists",uid);
    await getDoc(refNotelists);//取得原本的list順序
    let setListDocs=await Promise.all( setList.slice(0).reverse().map(async(item)=>{//加上slice(0)淺拷貝array，避免動到原本的array
        const{id}=item;
        //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
        const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
        const permissionDocShop =await getDocs(permissionQ);
        if(!permissionDocShop.empty){//若確定有該id，則執行以下
            const originData=[];
            permissionDocShop.forEach(item=>{
                originData.push(item.data());
            });
            const originRef=originData[0]["originDataRef"];
            console.log("originRef",originRef);
            return originRef
        }else{
            const refData=doc(db,"user",uid,"notelist",id);
            console.log("refData",refData);
            return refData
        }
    }))
    console.log("setListDocs",setListDocs)
    await setDoc(refNotelists, {orderlists:setListDocs});//用更新後的位置覆蓋掉原本的資料
}

//update Board base 64 to noteData
export const updateBoardData=async(id,url,uid)=>{
     //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
     const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
     const permissionDocShop =await getDocs(permissionQ);
     if(!permissionDocShop.empty){//若確定有該id，則執行以下
        console.log("HERE")
        const originData=[];
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        const originRef=originData[0]["originDataRef"];
        const updateData={image:url};
        await updateDoc(originData[0]["originDataRef"], updateData);//存入image
        //存入notelists for Drag and drop
        let refNotelists=doc(db,"notelists",uid);
        let notelistSnap=await getDoc(refNotelists);
        if(notelistSnap.exists()){
            await updateDoc(refNotelists,{orderlists:arrayUnion(originRef)});
        }else{
            await setDoc(refNotelists,{orderlists:arrayUnion(originRef)});
        }
    }else{//若無該id則非permission
        console.log("HEREFOR IMAGE")
        const updateRef=doc(db, "user", uid,"notelist",id);
        const updateData={image:url};
        await updateDoc(updateRef,updateData);//存入image
        //存入notelists for Drag and drop
        let refNotelists=doc(db,"notelists",uid);
        let notelistSnap=await getDoc(refNotelists);
        if(notelistSnap.exists()){
            await updateDoc(refNotelists,{orderlists:arrayUnion(updateRef)});
        }else{
            await setDoc(refNotelists,{orderlists:arrayUnion(updateRef)});
        }
     }
}

//query for image
export const queryImageData=async(id,uid)=>{
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const originData=[]
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        console.log("originData",originData,originData[0]["originDataRef"]);
        const originQ=await getDoc(originData[0]["originDataRef"]);
        console.log(originQ.data());//處理image
        if(!originQ.data().image){return {error:null}}
        else{
            return {image:originQ.data().image};
        }
    }
    const q=query(collection(db,"user",uid,"notelist"),where("id","==",id));//
    const docShop =await getDocs(q);
    const array=[];
     docShop.forEach((doc) => {
      const data=doc.data();
      array.push(data);
    });
    const res=array.map((item)=> {
        if(!item.image){return {error:null}}
        else{
            return {image:item["image"]};
        }
        })
    return res[0]
}
//update note Title and text and color
export const updateNoteData = async(id,updateTextElements,uid)=>{
    const time=Timestamp.now();
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const originData=[]
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        updateTextElements.time=time;
        await updateDoc(originData[0]["originDataRef"], updateTextElements);//找到要更新的路徑
    }
    else{
        const updateToDb = doc(db, "user", uid,"notelist",id);
        updateTextElements.time=time;
        await updateDoc(updateToDb, updateTextElements,time);
    }
    
}

//**封存 */
//Update NoteStatus from 0 to 1
export const updateNoteStatus = async(id,uid)=>{
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const updateDbNote = doc(db,"user",uid,"permissionLists",id);
        const noteStatus=1;
        await updateDoc(updateDbNote, {noteStatus:noteStatus});//找到要更新的路徑更新status為1
    }else{
        console.log(id,"id");//更新status為1
        const updateDbNote = doc(db,"user",uid,"notelist",id);
        const noteStatus=1;
        await updateDoc(updateDbNote,{noteStatus:noteStatus});
    }
}

//update NoteStatus from 1 to 0 恢復封存
export const updateNoteStatusBack= async(id,uid)=>{
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const updateDbNote = doc(db,"user",uid,"permissionLists",id);;
        const noteStatus=0;
        await updateDoc(updateDbNote, {noteStatus:noteStatus});//找到要更新的路徑更新status為0
    }else{
        console.log(id,"id");//更新status為0
        const updateDbNote = doc(db,"user",uid,"notelist",id);
        const noteStatus=0;
        await updateDoc(updateDbNote,{noteStatus:noteStatus});
    }
}

//deleteNoteData+ deleteBoard subcollection
export const deleteDbNote = async(id,uid)=>{
    console.log(id,uid,)
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const updateDbNote = doc(db,"user",uid,"permissionLists",id);
        const userRef=doc(db,"user",uid);
        const user=await getDoc(userRef);
        const userEmail=user.data().email;
        const userUid=user.data().uid;
        await deleteDoc(updateDbNote);//找到要刪除的target uid 的 permission data
        const originData=[];//原始資料區
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
            // deleteDoc(originRef);//刪除原始資料文件
        });
        const originRef=originData[0]["originDataRef"];//原始資料路徑
        console.log("originData",originData,userEmail);
        await updateDoc(originRef,{permissionUid:arrayRemove(userUid),permissionEmail:arrayRemove(userEmail)});//刪除targetEmail

        //刪掉noteList的內容
        const refNotelists=doc(db,"notelists",uid);
        const notelistSnap=await getDoc(refNotelists);
        const result=notelistSnap.data();
        const setListDocs=result["orderlists"].filter((item)=>{//過濾掉要刪除的項目
            console.log(item,id)
            return item.id !==id
        })
        console.log("setListDocs",setListDocs)
        await setDoc(refNotelists, {orderlists:setListDocs});//用刪除後的array覆蓋掉原本的資料
    }else{//刪除擁有者自己的資料
        const originDbNote = doc(db,"user",uid,"notelist",id);
        const user=await getDoc(originDbNote);//要找到permissionEmail
        if(user.data().permissionEmail){//若有則要刪除該permissionEmail的相關資料
            const permissionUid=user.data().permissionUid;//找到已分享權限的帳號uid
            for(let i=0;i<permissionUid.length;i++){
                const permissionDoc=doc(db,"user",permissionUid[i],"permissionLists",id);//找到permissionList刪除
                await deleteDoc(permissionDoc);
                //刪掉noteList的內容
                const refPermissionLists=doc(db,"notelists",permissionUid[i]);
                const permissionListSnap=await getDoc(refPermissionLists);
                const result=permissionListSnap.data();
                const setListDocs=result["orderlists"].filter((item)=>{//過濾掉要刪除的項目
                    return item.id !==id
                })
                await setDoc(refPermissionLists, {orderlists:setListDocs});//用刪除後的array覆蓋掉原本的資料
                console.log("setListDocs",setListDocs,"permissionDoc",permissionDoc)
            }
            console.log(permissionUid)
        }
        console.log(id,"id");//刪掉擁有者user內容所有內容
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
}

//delete Board and Image
export const deleteBoard = async(id,uid)=>{
     //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
     const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
     const permissionDocShop =await getDocs(permissionQ);
     if(!permissionDocShop.empty){//若確定有該id，則執行以下
         const originData=[];//原始資料區
         permissionDocShop.forEach(item=>{
             originData.push(item.data());
         });
        const originRef=originData[0]["originDataRef"];//原始資料路徑
        const ref=collection(db,originData[0]["originDataRef"]["path"],"board")//board的儲存位置
        const boardSnap=await getDocs(ref);
        boardSnap.forEach((item)=> deleteDoc(item.ref));//刪除board路徑
        const time=Timestamp.now();
        await updateDoc(originRef, {time:time});//更新time時間
        await updateDoc(originRef,{image:deleteField()});//刪除image
    }else{
        const deleteDbImage = doc(db,"user",uid,"notelist",id);//刪除image路徑
        const deleteBoardRef=collection(db,`user/${uid}/notelist/${id}/board`);//刪除board路徑
        await updateDoc(deleteDbImage,{image:deleteField()});
        const boardSnap=await getDocs(deleteBoardRef);
        boardSnap.forEach((item)=> deleteDoc(item.ref));
        const time=Timestamp.now();
        await updateDoc(deleteDbImage, {time:time});
    }
}


//Board Datas
//save Board+note data
export const saveBoardData= async (elements,id,uid)=>{//存放DrawElement物件用
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    const drawElement=async (element)=>{//存入畫板相關
        if(!permissionDocShop.empty){//若確定有該id，則執行以下
            console.log("HERE")
            const originData=[]
            permissionDocShop.forEach(item=>{
                originData.push(item.data());
            });
            const ref=collection(db,originData[0]["originDataRef"]["path"],"board")//board的儲存位置
            if(element.type !=="pencil" ) {
                const {id, x1, y1, x2, y2, type, color,range}=element;
                await addDoc(ref,{id, x1, y1, x2, y2, type, color,range})
            }else{
                const{id,type,color,range,points }=element
                const pointsCopy= points.map((point)=>({...point}))
                await addDoc(ref,{id,type,color,range,points:pointsCopy })
            }
        }else{
            console.log("HERE")
            const ref=collection(db,"user",uid,"notelist",id,"board")//board的儲存位置
            if(element.type !=="pencil" ) {
                const {id, x1, y1, x2, y2, type, color,range}=element;
                await addDoc(ref,{id, x1, y1, x2, y2, type, color,range})
            }else{
                const{id,type,color,range,points }=element
                const pointsCopy= points.map((point)=>({...point}))
                await addDoc(ref,{id,type,color,range,points:pointsCopy })
            }
        }
    }
        
    const time=Timestamp.now();
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        console.log("HEREBoard");
        const originData=[]
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        const originRef=originData[0]["originDataRef"];
        const snapShot=await getDoc(originRef);
        if(snapShot.exists()){//若已有文字記事，則更新圖片記事
            drawElement( elements);
            await updateDoc(originRef, {time});
        }else{//若沒有建立文字記事，則直接建立圖片記事    
            await setDoc(originRef,{id,noteTitle:"",noteText:"",time,color:"#FFFFFF",noteStatus:0});
        }
        //存入notelists，方便做listpage的排序跟顯示
        let refNotelists=doc(db,"notelists",uid);
        let notelistSnap=await getDoc(refNotelists);
        if(notelistSnap.exists()){
            await updateDoc(refNotelists,{orderlists:arrayUnion(originRef)});
        }else{
            await setDoc(refNotelists,{orderlists:arrayUnion(originRef)});
        }
    }
    else{//若無該id，則繼續執行以下
        const refBoard=doc(db,"user",uid,"notelist",id);
        console.log("here")
        let snapShot=await getDoc(refBoard)
        if(snapShot.exists()){//若已有文字記事，則更新圖片記事
            drawElement( elements);
            await updateDoc(refBoard, {time});
        }else{//若沒有建立文字記事，則直接建立圖片記事    
            await setDoc(refBoard,{id,noteTitle:"",noteText:"",time,color:"#FFFFFF",noteStatus:0});
        }
    
        //存入notelists，方便做listpage的排序跟顯示
        let refNotelists=doc(db,"notelists",uid);
        let notelistSnap=await getDoc(refNotelists);
        if(notelistSnap.exists()){
            await updateDoc(refNotelists,{orderlists:arrayUnion(refBoard)});
        }else{
        await setDoc(refNotelists,{orderlists:arrayUnion(refBoard)});
        }
    }
}

//get board data
export const getBoardData= async(id,uid)=>{
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const originData=[]
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        const ref=query(collection(db,originData[0]["originDataRef"]["path"],"board"))//board的儲存位置
        const docSnap=await getDocs(ref);
        const getBoardArr=[]
        docSnap.forEach((doc)=>{
        const item=doc.data();
        if(item.type !== "pencil"){
            getBoardArr.push({...item})
        }
        else{
            const pointsCopy=item.points
            const points=Object.keys(pointsCopy).map((key)=>[pointsCopy[key][0],pointsCopy[key][1]])//將points物件轉為array
            item.points=points//把轉換後的array覆蓋回item
            getBoardArr.push({...item})
        }
        })
        return getBoardArr

    }
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



//**Time Push notification*/
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

//save notitfication data to db
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
    // const updateRef=doc(db, "user", uid,"notelist",id);
    // const updateData={whenToNotify:time};
    // await updateDoc(updateRef,updateData);//存入NotifyTime，in order to show in fronted
    return {message:true};
}

//Search if notification reservation 查詢指定ID的預定notification
export const queryNotification=async(uid,id)=>{
    console.log("queryNotification")
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
     const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下

        const originData=[]
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
                console.log(typeof timeStampDate =="undefined",timeStampDate,data)
                if(typeof timeStampDate =="undefined") {
                    response.push( {error:"no data"})
                    return
                }
                console.log(typeof timeStampDate =="undefined",timeStampDate,data)
                // const dateInMillis  = timeStampDate * 1000;
                // const whenToNotify =new Date(dateInMillis).toLocaleDateString(undefined,{month:"short",day:"numeric"})+" " +  new Date(dateInMillis).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
                response.push( {whenToNotify:timeStampDate,uid,id})
            })
        }else{
            return {error:"no data"}
        }
        return response[0]
    }
    const q=query(collection(db,"user",uid,"notifications"),where("id","==",id),orderBy("whenToNotify","desc"));//
    const docShop =await getDocs(q);
    const response=[];
    if(!docShop.empty){
        docShop.forEach(item=> {
            const data=item.data();
            const timeStampDate = data["whenToNotify"]["seconds"];
            console.log(typeof timeStampDate =="undefined",timeStampDate,data)
            if(typeof timeStampDate =="undefined") {
                response.push( {error:"no data"})
                return
            }
            console.log(typeof timeStampDate =="undefined",timeStampDate,data)
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
    console.log("uid,id",uid,id)
    const q=query(collection(db,"user",uid,"notifications"),where("id","==",id)) ;
    const docShop =await getDocs(q);
    console.log(docShop);
    docShop.forEach(item=>{
        deleteDoc(item.ref)
    });
    // //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    // const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    // const permissionDocShop =await getDocs(permissionQ);
    // if(!permissionDocShop.empty){//若確定有該id，則不需更新原資料的time
    //     return {success:true}
    // }
    //更新noteList主資料區
    const updateRef=doc(db, "user", uid,"notelist",id);
    const time=Timestamp.now();
    await updateDoc(updateRef, {time:time});
    return {success:true}
}

//**Permission */
export const savePermission=async(uid,id,emailList)=>{
    console.log("emailList",emailList)
    //每次都先清空資料
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，表示該記事並非uid的擁有者則執行以下
        const originData=[];//原始資料區
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
            // deleteDoc(originRef);//刪除原始資料文件
        });
        // await deleteDoc(updateDbNote);//找到要刪除的target uid 的 permission data
        const originUidRef=originData[0]["targetUid"];//擁有者Uid
        const originEmailRef=originData[0]["targetEmail"];//擁有者Email
        // console.log("originData",originData,userEmail);
        // await updateDoc(originRef,{permissionUid:arrayRemove(userUid),permissionEmail:arrayRemove(userEmail)});//刪除targetEmail
        const originDbNote = doc(db,"user",originUidRef,"notelist",id);//找到擁有者的記事路徑
        const userData=await getDoc(originDbNote);//要找到notelist
        if(userData.data().permissionEmail){//若有則要刪除該permissionEmail的相關資料
            const permissionUid=userData.data().permissionUid;//找到已分享權限的帳號uid List
            for(let i=0;i<permissionUid.length;i++){
                const permissionDoc=doc(db,"user",permissionUid[i],"permissionLists",id);//找到permissionList刪除
                await deleteDoc(permissionDoc);
                //刪掉被分享者的noteList的內容
                const refPermissionLists=doc(db,"notelists",permissionUid[i]);
                const permissionListSnap=await getDoc(refPermissionLists);
                const result=permissionListSnap.data();
                const setListDocs=result["orderlists"].filter((item)=>{//過濾掉要刪除的項目
                    return item.id !==id
                })
                await setDoc(refPermissionLists, {orderlists:setListDocs});//用刪除後的array覆蓋掉原本的資料
                console.log("setListDocs",setListDocs,"permissionDoc",permissionDoc)
            }
            console.log(permissionUid);
            await updateDoc(originDbNote,{permissionUid:deleteField(),permissionEmail:deleteField()});//刪除targetEmail
        }
        console.log("emailList",emailList,originEmailRef,originUidRef)
        let response=[]
        //處理email List
        for(let i =0; i<emailList.length;i++){
            if(emailList[i] ==originEmailRef) {continue};//若要分享者跟擁有者相同則Jump to next i++
            const userQ=query(collection(db,"user",),where("email","==",emailList[i]));//找到被分享對象
            const userCollectionDocs=await getDocs(userQ);//被分享對象
            const targetUserRef=[];
            console.log("userCollectionDocs",emailList[i],!userCollectionDocs.empty)
            if(!userCollectionDocs.empty){
                userCollectionDocs.forEach(item=>{
                    targetUserRef.push(item.data());//該user的uid，若無註冊的用戶會回傳[]
                })
                //存入目標用戶的email
                const updateData={permissionEmail:arrayUnion(emailList[i]),permissionUid:arrayUnion(targetUserRef[0]["uid"])}
                await updateDoc(originDbNote,updateData)
                console.log(originEmailRef,targetUserRef,originUidRef);
                //目標用戶的資料處理
                // const targetDataRef=doc(db,`user/${targetUserRef[0]["uid"]}/notelist/${id}`);//目標用戶的資料ref
                const permissionListsRef=doc(db,"user",targetUserRef[0]["uid"],"permissionLists",id);
                const targetData={id,originDataRef:originDbNote,targetEmail:originEmailRef,targetUid:originUidRef,noteStatus:0}
                await setDoc (permissionListsRef,targetData)//存到目標用戶底下
                //存入notelists，方便做listpage的排序跟顯示
                const targetNotelists=doc(db,"notelists",targetUserRef[0]["uid"]);
                const notelistSnap=await getDoc(targetNotelists);
                if(notelistSnap.exists()){
                    await updateDoc(targetNotelists,{orderlists:arrayUnion(originDbNote)});
                }else{
                    await setDoc(targetNotelists,{orderlists:arrayUnion(originDbNote)});
                }
                response.push({ success:"已分享權限"})  
            }else{
                response.push({ error:`${emailList[i]} 該帳號非KeepNote用戶，無法分享權限`})
            }
        }
        console.log("SEMD MAiL")
        mailPermissionSend(originEmailRef,emailList);
        return response
    }else{//更新擁有者自己的資料與被分享者的資料刪除
        const originDbNote = doc(db,"user",uid,"notelist",id);
        const user=await getDoc(originDbNote);//要找到notelist
        if(user.data().permissionEmail){//若有則要刪除該permissionEmail的相關資料
            const permissionUid=user.data().permissionUid;//找到已分享權限的帳號uid List
            for(let i=0;i<permissionUid.length;i++){
                const permissionDoc=doc(db,"user",permissionUid[i],"permissionLists",id);//找到permissionList刪除
                await deleteDoc(permissionDoc);
                //刪掉被分享者的noteList的內容
                const refPermissionLists=doc(db,"notelists",permissionUid[i]);
                const permissionListSnap=await getDoc(refPermissionLists);
                const result=permissionListSnap.data();
                const setListDocs=result["orderlists"].filter((item)=>{//過濾掉要刪除的項目
                    return item.id !==id
                })
                await setDoc(refPermissionLists, {orderlists:setListDocs});//用刪除後的array覆蓋掉原本的資料
                console.log("setListDocs",setListDocs,"permissionDoc",permissionDoc)
            }
            console.log(permissionUid);
            await updateDoc(originDbNote,{permissionUid:deleteField(),permissionEmail:deleteField()});//刪除targetEmail
        }
        //使用者的uid id //要授予權限的使用者email
        const originDataRef=doc(db,"user",uid,"notelist",id);//使用者要給權限的記事，要更新資料,要存入email用戶的permissionList
        const originUser=await getDocs(query(collection(db,"user",),where("uid","==",uid)));//要分享權限的人
        const originUserRef=[];
        originUser.forEach((item)=>{
            originUserRef.push(item.data());
        })
        console.log("emailList",emailList.length,emailList)
        let response=[]
        //處理email List
        for(let i =0; i<emailList.length;i++){
            if(emailList[i]===originUserRef[0]["email"]) continue;//若要分享者跟擁有者相同則Jump to next i++
            const userQ=query(collection(db,"user",),where("email","==",emailList[i]));//找到被分享對象
            const userCollectionDocs=await getDocs(userQ);//被分享對象
            const targetUserRef=[];
            console.log("userCollectionDocs",userCollectionDocs,!userCollectionDocs.empty)
            if(!userCollectionDocs.empty){
                userCollectionDocs.forEach(item=>{
                    targetUserRef.push(item.data());//該user的uid，若無註冊的用戶會回傳[]
                })
                //存入目標用戶的email
                const updateData={permissionEmail:arrayUnion(emailList[i]),permissionUid:arrayUnion(targetUserRef[0]["uid"])}
                await updateDoc(originDataRef,updateData)
                console.log(originUserRef[0]["email"],targetUserRef,updateData);
                //目標用戶的資料處理
                // const targetDataRef=doc(db,`user/${targetUserRef[0]["uid"]}/notelist/${id}`);//目標用戶的資料ref
                const permissionListsRef=doc(db,"user",targetUserRef[0]["uid"],"permissionLists",id);
                const targetData={id,originDataRef,targetEmail:originUserRef[0]["email"],targetUid:originUserRef[0]["uid"],noteStatus:0}
                await setDoc (permissionListsRef,targetData)//存到目標用戶底下
                //存入notelists，方便做listpage的排序跟顯示
                const targetNotelists=doc(db,"notelists",targetUserRef[0]["uid"]);
                const notelistSnap=await getDoc(targetNotelists);
                if(notelistSnap.exists()){
                    await updateDoc(targetNotelists,{orderlists:arrayUnion(originDataRef)});
                }else{
                    await setDoc(targetNotelists,{orderlists:arrayUnion(originDataRef)});
                }
                response.push({ success:"已分享權限"})  
            }else{
                response.push({ error:`${emailList[i]} 該帳號非KeepNote用戶，無法分享權限`})
            }
        }
        console.log("SEMD MAiL")
        mailPermissionSend(originUserRef[0]["email"],emailList);
        return response
    }
}

//找尋email是否為會員
export const queryForEmail=async(emailList)=>{
        let response=[]
        //處理email List
        for(let i =0; i<emailList.length;i++){
            const userQ=query(collection(db,"user",),where("email","==",emailList[i]));//找到被分享對象
            const userCollectionDocs=await getDocs(userQ);//被分享對象
            if(!userCollectionDocs.empty){
                return 
            }else{
                response.push({ error:`${emailList[i]} 該帳號非KeepNote用戶，無法分享權限`})
            }
        }
        return response
}