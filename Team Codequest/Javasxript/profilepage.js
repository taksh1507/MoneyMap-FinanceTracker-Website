import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore();

// Function to toggle profile visibility
function toggleProfile() {
    const profileInfo = document.getElementById('profileInfo');
    // Toggle display property
    profileInfo.style.display = (profileInfo.style.display === 'block') ? 'none' : 'block';
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                } else {
                    console.log("No document found matching ID");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("User ID not found in local storage");
    }
});

// Attach toggleProfile to the button
document.getElementById('toggleButton').addEventListener('click', toggleProfile);

// Logout functionality
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUserId');
        signOut(auth)
            .then(() => {
                window.location.href = 'Main.html';
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    });
}
