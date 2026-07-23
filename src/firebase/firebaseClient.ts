import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {  initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAAM-NdI-WEtlgGvsM0DVjdlslXVd7g_E8",
  authDomain: "usman-portfolio-467ba.firebaseapp.com",
  projectId: "usman-portfolio-467ba",
  storageBucket: "usman-portfolio-467ba.firebasestorage.app",
  messagingSenderId: "150652140033",
  appId: "1:150652140033:web:3f2b5d8b2a2d5c44a71e00"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
export default app;
