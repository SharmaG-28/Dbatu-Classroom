import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFL2eXV6_K0gFXtF7eq_5HmEV9xZh7MrQ",
  authDomain: "dbatu-classroom.firebaseapp.com",
  projectId: "dbatu-classroom",
  storageBucket: "dbatu-classroom.appspot.com",
  messagingSenderId: "675555086095",
  appId: "1:675555086095:web:bce43eb4a31a396651387a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, signOut, db };
