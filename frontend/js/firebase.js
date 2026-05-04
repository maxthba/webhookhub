import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./firebase.local.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };