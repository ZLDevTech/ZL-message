import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCRo0mL3A3u78UR2Y0zkJb1IUOZeQy9AIc",
    authDomain: "chat-web-ec151.firebaseapp.com",
    projectId: "chat-web-ec151",
    storageBucket: "chat-web-ec151.appspot.com",
    messagingSenderId: "819142754620",
    appId: "1:819142754620:web:e59cc5bac56a54d8411e39"
  };

  const app= firebase.initializeApp(firebaseConfig);

  const db= app.firestore();
  const auth= app.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { db, auth, provider }