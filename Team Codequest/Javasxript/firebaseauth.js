// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjsaWoMjU3YquZUxsoH_HK6F6YMIIPJ7s",
  authDomain: "login-ec6b5.firebaseapp.com",
  projectId: "login-ec6b5",
  storageBucket: "login-ec6b5.appspot.com",
  messagingSenderId: "779274933126",
  appId: "1:779274933126:web:787373132a74f73cbb1207"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId){
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function(){
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign-up logic with auto-login after sign-up
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  const auth = getAuth();
  const db = getFirestore();

  // Create user with email and password
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName
    };

    showMessage('Account Created Successfully', 'signUpMessage');

    // Save user data to Firestore
    const docRef = doc(db, "users", user.uid);
    setDoc(docRef, userData)
    .then(() => {
      // User is already signed in after sign-up, redirect to profile
      window.location.href = 'signin.html';  // Redirect to profile page
    })
    .catch((error) => {
      console.error("Error writing document", error);
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    if (errorCode === 'auth/email-already-in-use') {
      showMessage('Email Address Already Exists !!!', 'signUpMessage');
    } else {
      showMessage('Unable to create user', 'signUpMessage');
    }
  });
});

// Sign-in logic
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  // Sign in user
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    showMessage('Login is successful', 'signInMessage');
    const user = userCredential.user;

    // Store user id in localStorage (optional)
    localStorage.setItem('loggedInUserId', user.uid);

    // Redirect to profile page after login
    window.location.href = 'profilepage.html';
  })
  .catch((error) => {
    const errorCode = error.code;
    if (errorCode === 'auth/wrong-password') {
      showMessage('Incorrect Email or Password', 'signInMessage');
    } else if (errorCode === 'auth/user-not-found') {
      showMessage('Account does not exist', 'signInMessage');
    } else {
      showMessage('Login failed', 'signInMessage');
    }
  });
});
