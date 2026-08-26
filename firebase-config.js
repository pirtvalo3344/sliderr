// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyBA4p7d9V29RxyRuDBHxvRPNkaI0I2S8Gc",
  authDomain: "sliderr-cf880.firebasestorage.app",
  projectId: "sliderr-cf880",
  storageBucket: "sliderr-cf880.firebasestorage.app",
  messagingSenderId: "224372391962",
  appId: "1:224372391962:web:10a69dd1fbcaae61bd51a3"
};

// Firebase'i Başlat
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Global olarak window nesnesine ekliyoruz (Her yerden erişileabilsin diye)
window.db = firebase.firestore();
window.auth = firebase.auth();