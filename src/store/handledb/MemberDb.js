import { db } from "../firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs,setDoc,} from "firebase/firestore";

//**會員資料相關*/
//**user Memeber section*/
export const saveSignUpdData= async(user)=>{
    const uid=user["uid"];
    const email=user["email"];
    const providerId=user["providerId"];
    const refUser=doc(db,"user",uid);//紀錄使用者uid
    const notelistSnap=await getDoc(refUser);
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

//讀取個人圖像 With Uid
export const queryUserImg=async(uid)=>{
    const userRef=doc(db,"user",uid);//使用者資料路徑
    const snapShot=await getDoc(userRef);
    const response=snapShot.data();
    if(!response.profileUrl){
        return null;
    }else{
        return {profileUrl:response.profileUrl};
    }
}

//讀取個人圖像 With Email
export const querySingleUserImg=async(email,setEmailList)=>{
    const userRef=query(collection(db,"user"),where("email","==",email));
    const snapShot=await getDocs(userRef);
    const response=[];
    if(snapShot.empty){
        const user={email,profileUrl:null};
        response.push(user);
    }else{
        snapShot.forEach(item=>{
            if(typeof item.data()["profileUrl"] !=="undefined"){
                response.push(item.data());
            }else{
                const userData= item.data();
                userData["profileUrl"]=null;
                response.push(userData);
            }
        })
    }
    setEmailList(pre=>[...pre,response[0]]);
}
//讀取個人array emails圖像 With Email for permission item
export const queryUserImgForItemByEmail=async(emailLists,setEmailList)=>{
    const array=[];
    for(let i =0 ; i< emailLists.length;i++){
        const userRef=query(collection(db,"user"),where("email","==",emailLists[i]));
        const snapShot=await getDocs(userRef);
        snapShot.forEach(item=>{
            if(typeof item.data()["profileUrl"] !=="undefined"){
                array.push(item.data());
            }else{
                const reponse= item.data();
                reponse["profileUrl"]=null;
                array.push(reponse);
            }
        })
    }
    setEmailList(array);
}
//讀取個人array emails圖像 With Email for permission index
export const queryUserImgByEmail=async(emailLists,setEmailList)=>{
    const array=[];
    for(let i =0 ; i< emailLists.length;i++){
        const userRef=query(collection(db,"user"),where("email","==",emailLists[i]));
        const snapShot=await getDocs(userRef);
        snapShot.forEach(item=>{
            if(typeof item.data()["profileUrl"] !=="undefined"){
                array.push(item.data());
            }else{
                const reponse= item.data();
                reponse["profileUrl"]=null;
                array.push(reponse);
            }
        })
    }
    setEmailList(array);
}

//找尋email是否為會員
export const queryForEmail=async(emailList)=>{
    let response=[]
    //處理email List
    for(let i =0; i<emailList.length;i++){
        const userQ=query(collection(db,"user",),where("email","==",emailList[i]["email"]));//找到被分享對象
        const userCollectionDocs=await getDocs(userQ);//被分享對象
        if(!userCollectionDocs.empty){
            response.push({ success:`${emailList[i]["email"]} 該帳號是KeepNote用戶`})
        }else{
            response.push({ error:`${emailList[i]["email"]} 該帳號非KeepNote用戶，無法分享權限`})
        }
    }
    return response
}
