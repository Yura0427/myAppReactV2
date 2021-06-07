import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvnTCR8I-YFfusi2d-stt9WLZYVyfTj-M",
  authDomain: "appv2-b616d.firebaseapp.com",
  projectId: "appv2-b616d",
  storageBucket: "appv2-b616d.appspot.com",
  messagingSenderId: "167711159161",
  appId: "1:167711159161:web:892120768cc054e187b5a8",
};
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
