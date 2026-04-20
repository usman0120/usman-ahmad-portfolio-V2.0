import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAAM-NdI-WEtlgGvsM0DVjdlslXVd7g_E8",
  authDomain: "usman-portfolio-467ba.firebaseapp.com",
  projectId: "usman-portfolio-467ba",
  storageBucket: "usman-portfolio-467ba.firebasestorage.app",
  messagingSenderId: "150652140033",
  appId: "1:150652140033:web:3f2b5d8b2a2d5c44a71e00"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const createAndGetAdmin = async () => {
  try {
    // Try to create admin user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'usmanahmad.workmail@gmail.com', 
      '1234567890'
    );
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', userCredential.user.email);
    console.log('🔑 UID:', userCredential.user.uid);
    console.log('📋 Copy this UID to your Firestore rules:');
    console.log('   "' + userCredential.user.uid + '"');
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Admin user already exists, trying to login...');
      
      // If user exists, try to login to get UID
      const loginCredential = await signInWithEmailAndPassword(
        auth,
        'usmanahmad.workmail@gmail.com',
        '1234567890'
      );
      console.log('✅ Login successful!');
      console.log('📧 Email:', loginCredential.user.email);
      console.log('🔑 UID:', loginCredential.user.uid);
      console.log('📋 Copy this UID to your Firestore rules:');
      console.log('   "' + loginCredential.user.uid + '"');
      
      // Sign out after getting UID
      await auth.signOut();
    } else {
      console.error('❌ Error:', error.message);
    }
  }
};

createAndGetAdmin();