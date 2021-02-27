import * as firebase from "firebase"

var firebaseConfig = {
    apiKey: "AIzaSyAL9OLSD42zDNd50MH2HwpO3BoCmK19qmA",
    authDomain: "ucschelpline.firebaseapp.com",
    projectId: "ucschelpline",
    storageBucket: "ucschelpline.appspot.com",
    messagingSenderId: "19714673101",
    appId: "1:19714673101:web:e41e8c3acec6ba53071c84",
    measurementId: "G-P7HMPQRYGD"
  };
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);

export default firebase;