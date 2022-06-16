import { db } from "../firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs,addDoc, setDoc, orderBy,deleteDoc, arrayUnion,Timestamp, arrayRemove} from "firebase/firestore";
import { mailPermissionSend } from "../thirdpary/permissionMail";


/** Note資料區 */
//**Note Lists Data section */ 
//save noteData
export const saveNoteData=async(id,noteTitle,noteText,uid,noteColor,timer,currentToken,emailList)=>{
    const time=Timestamp.now();
    const refBoard=doc(db,"user",uid,"notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用
    const noteStatus=0 //自訂note狀態，初始值為0，若封存為1
    if(timer!==1){//表示有設定notification
        const whenToNotify=new Date(timer);
        await setDoc(refBoard,{id,noteTitle,noteText,time,color:noteColor,
            token:currentToken,
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
            const userQ=query(collection(db,"user",),where("email","==",emailList[i]["email"]));//找到被分享對象
            const userCollectionDocs=await getDocs(userQ);//被分享對象
            const targetUserRef=[];
            userCollectionDocs.forEach(item=>{
                targetUserRef.push(item.data());//該user的uid，若無註冊的用戶會回傳[]
            })
            //存入目標用戶的email
            const updateData={permissionEmail:arrayUnion(emailList[i]["email"]),permissionUid:arrayUnion(targetUserRef[0]["uid"])}
            await updateDoc(refBoard,updateData)//refBoard是擁有者的文件路徑
            //目標用戶的資料處理
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

/** Query */
//getALl noteList where noteStatus ===0
export const getAllLists=async(getFilterButDataChange,isFilter,getOriginData,setData,uid)=>{
    //取得noteLists
    const refNotelists=doc(db,"notelists",uid);
    const notelistSnap=await getDoc(refNotelists);
    const result=notelistSnap.data();

    if(result ===undefined || Object.keys(result).length===0 ) {//若無資料
        setData([]);
        getOriginData([]);
        return;
    }
    const num=result["orderlists"].length-1;
    const noteLists=[];
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
        let date = "上次編輯時間：" + new Date(dateInMillis).toLocaleDateString()+" " +  new Date(dateInMillis).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        item["time"]=date;
    })
    const noteAllElements= async()=>{//要noteList board資料組合起來
        for(let i=0; i<noteLists.length; i++){
            const boardId=noteLists[i].id;
            const boardref=query(collection(db,"user", uid,"notelist",boardId,"board"));//board的儲存位置
            const boardSnap=await getDocs(boardref);
            const getBoardArr=[];
            boardSnap.forEach((doc)=>{
                const item=doc.data();
                if(item.type !== "pencil"){
                    getBoardArr.push({...item});
                }else{
                    const pointsCopy=item.points;
                    const points=Object.keys(pointsCopy).map((key)=>[pointsCopy[key][0],pointsCopy[key][1]]);//將points物件轉為array
                    item.points=points;//把轉換後的array覆蓋回item
                    getBoardArr.push({...item});
                }   
            }) 
            if(getBoardArr.length>0){
                noteLists[i].board=getBoardArr;
            }else{
                noteLists[i].board="";
            }
        }
        return noteLists;
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

//query for image
export const queryImageData=async(id,uid)=>{
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const originData=[];
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        const originQ=await getDoc(originData[0]["originDataRef"]);
        //處理image
        if(!originQ.data().image){return {error:null};}
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
        if(!item.image){return {error:null};}
        else{
            return {image:item["image"]};
        }
        })
    return res[0];
}

/**刪除 */
//deleteNoteData+ deleteBoard subcollection
export const deleteDbNote = async(id,uid)=>{
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
        await updateDoc(originRef,{permissionUid:arrayRemove(userUid),permissionEmail:arrayRemove(userEmail)});//刪除targetEmail

        //刪掉noteList的內容
        const refNotelists=doc(db,"notelists",uid);
        const notelistSnap=await getDoc(refNotelists);
        const result=notelistSnap.data();
        const setListDocs=result["orderlists"].filter((item)=>{//過濾掉要刪除的項目
            return item.id !==id;
        })
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
                    return item.id !==id;
                })
                await setDoc(refPermissionLists, {orderlists:setListDocs});//用刪除後的array覆蓋掉原本的資料
            }
        }
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
            return item.id !==id;
        })
        await setDoc(refNotelists, {orderlists:setListDocs});//用刪除後的array覆蓋掉原本的資料
    }
}


/** 更新Note資料 */
//update note Title and text and color
export const updateNoteData = async(id,updateTextElements,uid)=>{
    const time=Timestamp.now();
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const originData=[];
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

//根據Drag and drop結果，更新位置update array from firestore
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
            return originRef;
        }else{
            const refData=doc(db,"user",uid,"notelist",id);
            return refData;
        }
    }))
    await setDoc(refNotelists, {orderlists:setListDocs});//用更新後的位置覆蓋掉原本的資料
}



