import { db } from "./firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs,addDoc, setDoc, orderBy, collectionGroup,deleteDoc, increment, FieldValue,batch,deleteField, arrayUnion} from "firebase/firestore";
import { async } from "@firebase/util";



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
export const saveNoteData=async(id,noteTitle,noteText,uid)=>{
    let refBoard=doc(db,"user",uid,"notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用
    let noteCollection=query(collection(db,"user",uid,"notelist"));//one之後要改成會員uuid
    let noteCollectionDocs=await getDocs(noteCollection);
    let noteDocsLength=noteCollectionDocs.docs.length +1; //自訂index number
    await setDoc(refBoard,{id,noteTitle,noteText,index:noteDocsLength});
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
    //測試取得noteLists
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    let result=notelistSnap.data();
    if(result ===undefined) return {"message":null}
    let num=result["orderlists"].length-1
    let noteLists=[]
    for(let i=num;i>=0;i--){//從後面取得最新
        const listRef=result["orderlists"][i];
        const getListData=await getDoc(listRef);
        noteLists.push(getListData.data());
    }   
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
}

//要根據Drag and drop結果，更新位置update array from firestore
export const updateListsPosition= async (setList,uid)=>{
    // let refBoard=doc(db,"user",uid,"notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    let result=notelistSnap.data();
    let setListDocs=setList.slice(0).reverse().map((item)=>{//加上slice淺拷貝，避免動到原本的array
        const{id}=item;
        let refData=doc(db,"user",uid,"notelist",id);
        return refData
    })
    await setDoc(refNotelists, {orderlists:setListDocs});//用更新後的位置覆蓋掉原本的資料

}
//update noteData
// export const updateNoteData=async()=>{
//     const updateToDb = doc(db, "user", "one","notelist","857129ce-d0de-4fd2-a78c-479024d9d63d");
//     const updateNote = {
//     //   id,
//     //   noteText: updateTitle,
//     //   noteTitle: updateText,
//     //   index,
//     };
//     await updateDoc(updateToDb, updateNote);

// }

//update Board base 64 to noteData
export const updateBoardData=async(id,url,uid)=>{
    const updateRef=doc(db, "user", uid,"notelist",id);
    const updateData={image:url};
    await updateDoc(updateRef,updateData);//存入image
    //測試存入notelists
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    if(notelistSnap.exists()){
        console.log("notelistSnap",notelistSnap.data());
        await updateDoc(refNotelists,{orderlists:arrayUnion(updateRef)});
    }else{
    await setDoc(refNotelists,{orderlists:arrayUnion(updateRef)});
    }

}

//update note Title and text
export const updateNoteData = async(id,updateTextElements,uid)=>{
    const updateToDb = doc(db, "user", uid,"notelist",id);
    console.log(id,updateTextElements)
    await updateDoc(updateToDb, updateTextElements);

}

//deleteNoteData+ deleteBoard subcollection
export const deleteDbNote = async(id,uid)=>{
    console.log(id,"id");//刪掉user內容所有內容
    const deleteDbNote = doc(db,"user",uid,"notelist",id);
    const deleteBoardRef=collection(db,`user/${uid}/notelist/${id}/board`);
    const deleteOps=[]
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
    console.log(id,"id");
    const deleteDbImage = doc(db,"user",uid,"notelist",id);//刪除image路徑
    const deleteBoardRef=collection(db,`user/${uid}/notelist/${id}/board`);//刪除board路徑
    await updateDoc(deleteDbImage,{image:deleteField()});
    const boardSnap=await getDocs(deleteBoardRef);
    boardSnap.forEach((item)=> deleteDoc(item.ref));
}


//Board Datas
//save Board+note data
export const saveBoardData= async (elements,id,noteTitle,noteText,uid)=>{//存放物件用
    const refBoard=doc(db,"user",uid,"notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用
    console.log({id,noteTitle,noteText,},refBoard);
    let noteCollection=query(collection(db,"user",uid,"notelist"));//one之後要改成會員uuid
    let noteCollectionDocs=await getDocs(noteCollection);
    let noteDocsLength=noteCollectionDocs.docs.length +1; //自訂index number
    await setDoc(refBoard,{id,noteTitle,noteText,index:noteDocsLength});
    const drawElement=async (element)=>{
        // const boardRef=db.collection("user").doc("one").collection("board").doc();
        const ref=collection(db,"user",uid,"notelist",id,"board")//board的儲存位置
        if(element.type !=="pencil" ) {
            const {id, x1, y1, x2, y2, type, color,range}=element;
            const docRef= await addDoc(ref,{id, x1, y1, x2, y2, type, color,range})
            console.log(docRef,docRef.id)
        }else{
            const{id,type,color,range,points }=element
            const pointsCopy= points.map((point)=>({...point}))
            const docRef2=await addDoc(ref,{id,type,color,range,points:pointsCopy })
            console.log(docRef2,docRef2.id)
        }
    }
    // elements.forEach((element,index) => drawElement( element,index));
    drawElement( elements);
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

