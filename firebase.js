import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAc3hrHrGUne7aPruWDpexUOXexHxWFukg",
    authDomain: "whatsapp-2-dc5f4.firebaseapp.com",
    projectId: "whatsapp-2-dc5f4",
    storageBucket: "whatsapp-2-dc5f4.appspot.com",
    messagingSenderId: "835930635676",
    appId: "1:835930635676:web:49db9595e79c7fcc4d9c59"
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
