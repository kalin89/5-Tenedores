import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyB81z--KdwgtVnBNpnLb0IcDx72aSj5qyA",
    authDomain: "tenedores-24dd7.firebaseapp.com",
    databaseURL: "https://tenedores-24dd7.firebaseio.com",
    projectId: "tenedores-24dd7",
    storageBucket: "tenedores-24dd7.appspot.com",
    messagingSenderId: "743834822618",
    appId: "1:743834822618:web:2e3a890e9edf2a25c242e3"
  };

  export const firebaseapp = firebase.initializeApp(firebaseConfig);