import { db } from "../firebase";
import { collection,updateDoc,doc, query, getDoc,where, getDocs,deleteDoc} from "firebase/firestore";


//**封存 */
//**Archive Section*/
//getALl ArchiveLists where noteStatus ===1
export const getAllArchiveLists=async(setArchiveLists,uid)=>{
    //取得noteLists
    let refNotelists=doc(db,"notelists",uid);
    let notelistSnap=await getDoc(refNotelists);
    let result=notelistSnap.data();
    if(result ===undefined ) {//若無資料
        setArchiveLists([]);
        return}
    let num=result["orderlists"].length-1
    let noteLists=[];
    for(let i=num;i>=0;i--){//從後面取得最新
        const listRef=result["orderlists"][i];
        const getListData=await getDoc(listRef);
        const getListId=getListData.data().id;//取得id，為了檢查是否permissionList有資料
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
        //更新status為1
        const updateDbNote = doc(db,"user",uid,"notelist",id);
        const noteStatus=1;
        await updateDoc(updateDbNote,{noteStatus:noteStatus});
        const q=query(collection(db,"user",uid,"notifications"),where("id","==",id)) ;//將提醒notification移除
        const docShop =await getDocs(q);
        docShop.forEach(item=>{
            deleteDoc(item.ref);
        });
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
        //更新status為0
        const updateDbNote = doc(db,"user",uid,"notelist",id);
        const noteStatus=0;
        await updateDoc(updateDbNote,{noteStatus:noteStatus});
    }
}

