import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyA-CXYCf2iR8xrBLdz6zIR13Ss84I6Ry6Q",
    authDomain: "invoice-app-yt-d6752.firebaseapp.com",
    projectId: "invoice-app-yt-d6752",
    storageBucket: "invoice-app-yt-d6752.appspot.com",
    messagingSenderId: "423311106303",
    appId: "1:423311106303:web:e836b16bdb6f22195f6cca"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();