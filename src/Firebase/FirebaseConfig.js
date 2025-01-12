import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {

  // Add Firebase Config Here
  apiKey: "AIzaSyDRXh7mNzjh-ukUIuTvclI-yxkrHV893Sg",
  authDomain: "grillandthrill-b3c18.firebaseapp.com",
  projectId: "grillandthrill-b3c18",
  storageBucket: "grillandthrill-b3c18.firebasestorage.app",
  messagingSenderId: "6920651548",
  appId: "1:6920651548:web:1c041491df1eb7230f30d9"

}
//Intialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}


export { firebase }