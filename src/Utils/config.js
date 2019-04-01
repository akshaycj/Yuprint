import firebase from "firebase";

var config = {
  apiKey: "AIzaSyDS-Q8B3JjLm4Ci5BeFud4oC3Q21CDdBLc",
  authDomain: "yuprint-f171d.firebaseapp.com",
  databaseURL: "https://yuprint-f171d.firebaseio.com",
  projectId: "yuprint-f171d",
  storageBucket: "yuprint-f171d.appspot.com",
  messagingSenderId: "897544545459"
};

firebase.initializeApp(config);

export const db = firebase.database();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
