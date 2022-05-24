const functions = require("firebase-functions") ;
const admin = require("firebase-admin") ;

admin.initializeApp();
const database=admin.firestore();

// const db=admin.firestore();

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
        console.log(snapshop.data());
        await snapshop.ref.update({"notificationSent":true});
    })
    function sendNotification(title,text,token,id,timer){
        console.log("title,text,token,timer,id",title,text,token,timer,id);
        const message={
            data:{title:title, body:text,time:String(timer),id:id,click_action:"https://keepproject-e7d2b.web.app"},
            token:token,
        }
        console.log(message)
        admin.messaging().send(message).then(res=>console.log("Suceess",res)).catch(e=>console.log(e))
    }
    return console.log("end of function")
})

//寫一個function傳入projectCreated使用並建立新的doc
// const createNote =(notification=>{
//     return admin.firestore().collection("notification")
//     .add(notification).then(doc=>console.log("notification add",doc))
// })

// exports.projectCreated=functions.firestore
// .document("/task/{teaskId}")
// .onCreate(doc=>{
//     const project=doc.data();
//     const notification={
//         content:"Add new text",
//         user:project.uid,
//         time:admin.firestore.FieldValue.serverTimestamp()
//     }

//     return createNote(notification)
// })

// export const taskRunner=functions.runWith({memory:"2GB"}).pubsub.schedule("* * * * *")
// .onRun(async context=>{
//     const now =admin.firestore.Timestamp.now();

//     //query all document ready to perform
//     const query=db.collection("tasks").where("performAt","<=",now).where("status","==","scheduled")
    
//     const tasks=await query.get();

//     //Jobs to execute
//     const jobs=[];

//     //loop over documents and push job
//     tasks.forEach(snap=>{
//         console.log(snap);
//     })

// }) https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
