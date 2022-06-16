import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";


export const mailPermissionSend= async(usermail,targetMails)=>{
    const filterRepeatMails=targetMails.filter((item)=> {return item.email!==usermail});
    const mailArray=[];
    filterRepeatMails.forEach(item=>{
        mailArray.push(item["email"]);
    });
    await addDoc(collection(db, "mail"), {
        to: mailArray,
        template: {
              name: "style",
              data: {username:usermail}
            },
        });

}