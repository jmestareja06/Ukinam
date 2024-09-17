import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { collection, addDoc, setDoc, getDocs, getDoc, doc, getFirestore} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8i_pbuGQC4sGEp6leZklZWU0xNpR9Zj8",
    authDomain: "sample-storage-reg.firebaseapp.com",
    projectId: "sample-storage-reg",
    storageBucket: "sample-storage-reg.appspot.com",
    messagingSenderId: "616571528576",
    appId: "1:616571528576:web:b265b7f1ccfdb1e8140d65",
    measurementId: "G-5DN1C75C0P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login Page
const loginForm = document.getElementById('loginform');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                const errorMessage = error.message;
                document.getElementById('error-message').innerText = errorMessage;
            });
    });
}

// Check Authentication and Redirect if not signed in
onAuthStateChanged(auth, (user) => {
    const protectedPage = window.location.pathname === '/dashboard.html';

    if (protectedPage && !user) {
        // If user is not signed in and tries to access a protected page, redirect to index.html
        window.location.href = 'index.html';
    } else if (user) {
        // User is signed in, you can access user information if needed
        console.log('User is signed in:', user.email);
    }
});

// Logout functionality (on dashboard page)
const logoutBtn = document.getElementById('logoutbtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            // On successful sign-out, redirect to index.html (login page)
            window.location.href = 'index.html';
        }).catch((error) => {
            // Handle sign-out error
            console.error('Sign-out error:', error);
        });
    });
}

// AddDoc

const regform = document.getElementById('regform');
if (regform) {
    regform.addEventListener('submit', function (e) {
     e.preventDefault();  // Prevent form from submitting the traditional way

    const Name = document.getElementById('name').value;
    const Email = document.getElementById('email').value;

    try {
        const docRef = addDoc(collection(db, 'users'), {
            Name: Name,
            Email: Email
        });

        document.getElementById('success-message').innerText = 'Details successfully added! Document ID: ' + docRef.id;
        document.getElementById('regform').reset();
    } catch (error) {
       console.log('Error adding team:', error);
    }
});}



// Get Data
const getData = document.getElementById('getdata');
const dataInfo = document.getElementById('dataInfo');

if (getData) {
    getData.addEventListener('click', async function () {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));

            if (!querySnapshot.empty) {
                dataInfo.innerHTML = ''; // Clear previous data

                querySnapshot.forEach((doc) => {
                    const acc = doc.data();
                    const li = document.createElement('li');
                    li.innerHTML = `${acc.name} - ${acc.email}`;
                    dataInfo.appendChild(li);
                });
            } else {
                alert('No data found');
            }
        } catch (error) {
            console.log('Error getting data:', error);
        }
    });
}


//SignUp Function
// SignUp Function
const signupForm = document.getElementById('signupform');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email-signup').value;
        const password = document.getElementById('password-signup').value;

        try {
            // Check if username already exists
            const usernameDoc = await getDoc(doc(db, 'usernames', username));

            if (usernameDoc.exists()) {
                alert('Username is already taken');
                return;
            }

            // Create user with email and password in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Store username and email in Firestore
            await setDoc(doc(db, 'usernames', username), {
                userId: userId,
                email: email
            });

            alert('User registered successfully');
            signupForm.reset(); // Reset the form after successful signup
        } catch (error) {
            console.error('Error signing up:', error.message);
            alert('Error signing up: ' + error.message); // Provide user-friendly error messages
        }
    });
}
