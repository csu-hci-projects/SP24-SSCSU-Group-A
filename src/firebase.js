import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBwXsFjV6YUH9DaL28broEFbSzEN73bEMY",
    authDomain: "instagram-clone-29762.firebaseapp.com",
    projectId: "instagram-clone-29762",
    storageBucket: "instagram-clone-29762.appspot.com",
    messagingSenderId: "242922118236",
    appId: "1:242922118236:web:bee2e4dad1d15885b01a99",
    measurementId: "G-62NFGC0T8C"
};

const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// const auth = firebase.auth();
const storage = getStorage();


export { db, storage };