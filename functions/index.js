const functions = require("firebase-functions") ;
const admin = require("firebase-admin") ;

admin.initializeApp();
const database=admin.firestore();


//抓取trigger觀察notification doc被新增上去，以及狀態是否為false

exports.sendNotificationAsia=functions.pubsub.schedule("* * * * *").onRun(async(context)=>{
    const currentTime=admin.firestore.Timestamp.now();
    const query=await database.collectionGroup("notifications")
    .where("whenToNotify","<=",currentTime)
    .where("notificationSent","==",false).get();
    query.forEach(async snapshop=>{
        const{title,text,token,id,whenToNotify}=snapshop.data();
        const timer  = whenToNotify.seconds * 1000;
        sendNotification(title,text,token,id,timer);
        await snapshop.ref.update({"notificationSent":true});
    })
    function sendNotification(title,text,token,id,timer){
        const message={
            data:{title:title, body:text,time:String(timer),id:id,click_action:"https://keepproject-e7d2b.web.app"},
            token:token,
        }
        admin.messaging().send(message).then(res=>console.log("Suceess",res)).catch(e=>console.log(e))
    }
    return console.log("end of function")
})

exports.deleteNotificationAsia=functions.pubsub.schedule("0 8 * * sun").onRun(async(context)=>{
    const currentTime=admin.firestore.Timestamp.now();
    const query=await database.collectionGroup("notifications")
    .where("whenToNotify","<=",currentTime)
    .where("notificationSent","==",true).get();
    query.forEach(async snapshop=>{
        await snapshop.ref.delete();
    })
    return console.log("end of function")
})

exports.deleteMail=functions.pubsub.schedule("0 8 * * sun").onRun(async(context)=>{
    const query=await database.collection("mail").where("delivery","!=",null).get();
    query.forEach(async snapshop=>{
        await snapshop.ref.delete();
    })
    return console.log("end of function")
})
