// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu1KIfG4GuHlCcjpjhtSBMY4WKyJ237xs",
  authDomain: "moehe-app.firebaseapp.com",
  projectId: "moehe-app",
  storageBucket: "moehe-app.firebasestorage.app",
  messagingSenderId: "274100941191",
  appId: "1:274100941191:web:df060afc18815a69526322",
  measurementId: "G-PV4826D56L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
