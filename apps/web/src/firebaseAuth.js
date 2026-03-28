// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';


const app = initializeApp(firebaseConfig);
console.log("🌐 Firebase App:", app.name); 
console.log("🌐 Firestore DB Project:", app.options.projectId); 
const db = getFirestore(app);

export { app, db };
