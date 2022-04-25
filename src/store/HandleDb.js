import { db } from "./firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs,addDoc, setDoc, orderBy} from "firebase/firestore";


//Note Lists Data
//save noteData
export const saveNoteData=async(id,noteTitle,noteText)=>{
    const refBoard=doc(db,"user","one","notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用

    console.log({id,noteTitle,noteText,},refBoard)
    const docRef=await setDoc(refBoard,{id,noteTitle,noteText});
    console.log(docRef)
}
//get ALL noteData
export const getTextData= async(setData)=>{
    const qNote=query(collection(db,"user","one","notelist"));
    const queryDocs=await getDocs(qNote);
    const getUserNotes=[];
    queryDocs.forEach((doc)=> {
        getUserNotes.push({...doc.data()});
        console.log(doc.data());
    });
    setData(getUserNotes);
}

//update noteData
export const updateNoteData=async()=>{
    const updateToDb = doc(db, "user", "one","notelist","857129ce-d0de-4fd2-a78c-479024d9d63d");
    const updateNote = {
    //   id,
    //   noteText: updateTitle,
    //   noteTitle: updateText,
    //   index,
    };
    await updateDoc(updateToDb, updateNote);

}


//Board Datas
//save Board data
export const saveBoardData= async (elements,id,noteTitle,noteText)=>{
    const refBoard=doc(db,"user","one","notelist",id);//創造自訂義的id並存入obj，未來可更新board資料用
    console.log({id,noteTitle,noteText,},refBoard)
    const docRef=await setDoc(refBoard,{id,noteTitle,noteText});
    console.log(docRef)
    const drawElement=async (element)=>{
        // const boardRef=db.collection("user").doc("one").collection("board").doc();
        const ref=collection(db,"user", "one","notelist",id,"board")//board的儲存位置
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
export const getBoardData= async()=>{
    const ref=query(collection(db,"user", "one","notelist","b2cada00-63b9-46b8-8ded-e111414fa65b","board"),orderBy("id"))//board的儲存位置
    console.log(ref)
    const docSnap=await getDocs(ref);
    const getBoardArr=[]
    docSnap.forEach((doc)=>{
    const item=doc.data();
    console.log(item)
    if(item.type !== "pencil"){
        console.log({...item})
        getBoardArr.push({...item})
    }else{
        const pointsCopy=item.points
        console.log(pointsCopy)
        const points=Object.keys(pointsCopy).map((key)=>[pointsCopy[key][0],pointsCopy[key][1]])//將points物件轉為array
        item.points=points//把轉換後的array覆蓋回item
        console.log("item",{...item})
        getBoardArr.push({...item})
    }
    })
    console.log(getBoardArr);
    return getBoardArr
}

