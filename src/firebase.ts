import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDQKlJpOMpN1imm6h76ay2HJFjckBr3m1Q",
  authDomain: "mainsource-a25bd.firebaseapp.com",
  projectId: "mainsource-a25bd",
  storageBucket: "mainsource-a25bd.firebasestorage.app",
  messagingSenderId: "612608439244",
  appId: "1:612608439244:web:19828b6a6c882b31512369"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);