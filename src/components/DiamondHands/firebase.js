// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCsp6j8_RsdVa9L7Lk21cDcj9ri3jp_Ufw",
    authDomain: "budler-d69eb.firebaseapp.com",
    databaseURL: "https://budler-d69eb.firebaseio.com",
    projectId: "budler-d69eb",
    storageBucket: "budler-d69eb.appspot.com",
    messagingSenderId: "1075938410647",
    appId: "1:1075938410647:web:1600f2f6140936b48fa9d2",
    measurementId: "G-08XSEWSQKF"
};
export default firebase.initializeApp(firebaseConfig);