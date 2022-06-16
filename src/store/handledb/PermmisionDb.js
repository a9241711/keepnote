import { db } from "../firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs, setDoc,deleteDoc,deleteField, arrayUnion} from "firebase/firestore";
import { mailPermissionSend } from "../thirdpary/permissionMail";

//** 權限分享 */
//**Permission */
export const savePermission=async(uid,id,emailList)=>{
    //每次都先清空資料
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，表示該記事並非uid的擁有者則執行以下
        const originData=[];//原始資料區
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        const originUidRef=originData[0]["targetUid"];//擁有者Uid
        const originEmailRef=originData[0]["targetEmail"];//擁有者Email
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
                    return item.id !==id;
                })
                await setDoc(refPermissionLists, {orderlists:setListDocs});//用刪除後的array覆蓋掉原本的資料
            }
            await updateDoc(originDbNote,{permissionUid:deleteField(),permissionEmail:deleteField()});//刪除targetEmail
        }
        let response=[];
        //處理email List
        for(let i =0; i<emailList.length;i++){
            if(emailList[i]["email"] ===originEmailRef) {continue};//若要分享者跟擁有者相同則Jump to next i++
            const userQ=query(collection(db,"user",),where("email","==",emailList[i]["email"]));//找到被分享對象
            const userCollectionDocs=await getDocs(userQ);//被分享對象
            const targetUserRef=[];
            if(!userCollectionDocs.empty){
                userCollectionDocs.forEach(item=>{
                    targetUserRef.push(item.data());//該user的uid，若無註冊的用戶會回傳[]
                })
                //存入目標用戶的email
                const updateData={permissionEmail:arrayUnion(emailList[i]["email"]),permissionUid:arrayUnion(targetUserRef[0]["uid"])};
                await updateDoc(originDbNote,updateData);
                //目標用戶的資料處理
                // const targetDataRef=doc(db,`user/${targetUserRef[0]["uid"]}/notelist/${id}`);//目標用戶的資料ref
                const permissionListsRef=doc(db,"user",targetUserRef[0]["uid"],"permissionLists",id);
                const targetData={id,originDataRef:originDbNote,targetEmail:originEmailRef,targetUid:originUidRef,noteStatus:0};
                await setDoc (permissionListsRef,targetData);//存到目標用戶底下
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
                response.push({ error:`${emailList[i]["email"]} 該帳號非KeepNote用戶，無法分享權限`});
            }
        }
        mailPermissionSend(originEmailRef,emailList);
        return response;
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
            }
            await updateDoc(originDbNote,{permissionUid:deleteField(),permissionEmail:deleteField()});//刪除targetEmail
        }
        //使用者的uid id //要授予權限的使用者email
        const originDataRef=doc(db,"user",uid,"notelist",id);//使用者要給權限的記事，要更新資料,要存入email用戶的permissionList
        const originUser=await getDocs(query(collection(db,"user",),where("uid","==",uid)));//要分享權限的人
        const originUserRef=[];
        originUser.forEach((item)=>{
            originUserRef.push(item.data());
        })
        let response=[];
        //處理email List
        for(let i =0; i<emailList.length;i++){
            if(emailList[i]["email"]===originUserRef[0]["email"]) continue;//若要分享者跟擁有者相同則Jump to next i++
            const userQ=query(collection(db,"user",),where("email","==",emailList[i]["email"]));//找到被分享對象
            const userCollectionDocs=await getDocs(userQ);//被分享對象
            const targetUserRef=[];
            if(!userCollectionDocs.empty){
                userCollectionDocs.forEach(item=>{
                    targetUserRef.push(item.data());//該user的uid，若無註冊的用戶會回傳[]
                })
                //存入目標用戶的email
                const updateData={permissionEmail:arrayUnion(emailList[i]["email"]),permissionUid:arrayUnion(targetUserRef[0]["uid"])}
                await updateDoc(originDataRef,updateData)
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
                response.push({ error:`${emailList[i]["email"]} 該帳號非KeepNote用戶，無法分享權限`})
            }
        }
        mailPermissionSend(originUserRef[0]["email"],emailList);
        return response;
    }
}