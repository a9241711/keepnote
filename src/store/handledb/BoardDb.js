import { db } from "../firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs,addDoc, setDoc, arrayUnion,Timestamp} from "firebase/firestore";


/**畫版資料 */
//Board Datas
//save Board+note data
export const saveBoardData= async (elements,id,uid)=>{//存放DrawElement物件用
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    const drawElement=async (element)=>{//存入畫板相關
        if(!permissionDocShop.empty){//若確定有該id，則執行以下
            const originData=[];
            permissionDocShop.forEach(item=>{
                originData.push(item.data());
            });
            const ref=collection(db,originData[0]["originDataRef"]["path"],"board")//board的儲存位置
            if(element.type !=="pencil" ) {
                const {id, x1, y1, x2, y2, type, color,range}=element;
                await addDoc(ref,{id, x1, y1, x2, y2, type, color,range});
            }else{
                const{id,type,color,range,points }=element;
                const pointsCopy= points.map((point)=>({...point}));
                await addDoc(ref,{id,type,color,range,points:pointsCopy });
            }
        }else{
            const ref=collection(db,"user",uid,"notelist",id,"board")//board的儲存位置
            if(element.type !=="pencil" ) {
                const {id, x1, y1, x2, y2, type, color,range}=element;
                await addDoc(ref,{id, x1, y1, x2, y2, type, color,range});
            }else{
                const{id,type,color,range,points }=element;
                const pointsCopy= points.map((point)=>({...point}));
                await addDoc(ref,{id,type,color,range,points:pointsCopy });
            }
        }
    }
        
    const time=Timestamp.now();
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
        const originData=[];
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
        let snapShot=await getDoc(refBoard);
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
        const originData=[];
        permissionDocShop.forEach(item=>{
            originData.push(item.data());
        });
        const ref=query(collection(db,originData[0]["originDataRef"]["path"],"board"))//board的儲存位置
        const docSnap=await getDocs(ref);
        const getBoardArr=[];
        docSnap.forEach((doc)=>{
        const item=doc.data();
        if(item.type !== "pencil"){
            getBoardArr.push({...item});
        }
        else{
            const pointsCopy=item.points;
            const points=Object.keys(pointsCopy).map((key)=>[pointsCopy[key][0],pointsCopy[key][1]]);//將points物件轉為array
            item.points=points//把轉換後的array覆蓋回item
            getBoardArr.push({...item});
        }
        })
        return getBoardArr;
    }
    const ref=query(collection(db,"user", uid,"notelist",id,"board"))//board的儲存位置
    const docSnap=await getDocs(ref);
    const getBoardArr=[];
    docSnap.forEach((doc)=>{
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
    return getBoardArr;
}

//update Board base 64 to noteData
export const updateBoardData=async(id,url,uid)=>{
    //permission，要先找到目前帳戶內是否有該id在permissionList裡面，若有，則透過路徑找到資料
    const permissionQ=query(collection(db,"user",uid,"permissionLists"),where("id","==",id));//若有該id表示是被分享權限
    const permissionDocShop =await getDocs(permissionQ);
    if(!permissionDocShop.empty){//若確定有該id，則執行以下
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
