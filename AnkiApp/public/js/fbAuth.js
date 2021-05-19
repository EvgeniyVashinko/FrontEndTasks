// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJG1iNKvQyW2if1C_esrYc4tuunsEmmR4",
    authDomain: "anki-app-b7245.firebaseapp.com",
    databaseURL: "https://anki-app-b7245-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "anki-app-b7245",
    storageBucket: "anki-app-b7245.appspot.com",
    messagingSenderId: "730866000302",
    appId: "1:730866000302:web:e82e71cb6c14f3d45d683f"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        localStorage.setItem('uid', user.uid);
    } else {
        localStorage.removeItem('uid');
        window.location.replace('#/');
    }
});

function logout() {
    firebase.auth().signOut();
    localStorage.removeItem('uid');
    window.location.replace('#/')    
}