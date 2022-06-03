import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";


export const mailPermissionSend= async(usermail,targetMails)=>{
    const filterRepeatMails=targetMails.filter((item)=> {return item!==usermail});
    const docRef = await addDoc(collection(db, "mail"), {
    to: filterRepeatMails,
    template: {
          name: "style",
          data: {username:usermail}
        },
      });
    console.log(docRef,"success");
}