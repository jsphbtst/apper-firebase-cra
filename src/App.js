import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import GlobalProvider from "./contexts/global";
import "./App.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [error, setError] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const loginUser = (event) => {
    // https://www.w3schools.com/jsref/event_preventdefault.asp#:~:text=The%20preventDefault()%20method%20cancels,link%20from%20following%20the%20URL
    event.preventDefault();
    setError("");
    setIsLoggedIn(null);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // TODO: add validation here, e.g., check if
    // email and password are not empty strings

    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(() => {
        setIsLoggedIn(true);
        emailRef.current.value = "";
        passwordRef.current.value = "";
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        setIsLoggedIn(false);
      });
  };

  const logoutUser = () => {
    signOut(firebaseAuth)
      .then(() => setIsLoggedIn(false))
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        setIsLoggedIn(false);
      });
  };

  // on mount, check if we already logged in
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        console.log("user", JSON.stringify(user));
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  // null is that small window where firebase is still trying to auth you
  if (isLoggedIn === null) {
    return (
      <div>
        <h1>Authenticating...</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <GlobalProvider value={{ firebaseAuth, isLoggedIn, setIsLoggedIn }}>
        {isLoggedIn ? (
          <div>
            <h1>Already logged in</h1>
            <button onClick={logoutUser}>Log out</button>
          </div>
        ) : (
          <div>
            {error.length > 0 && (
              <h2 style={{ color: "red", fontWeight: "bold" }}>{error}</h2>
            )}

            <form>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ marginRight: "10px" }}>Email</label>
                <input type="text" ref={emailRef} />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ marginRight: "10px" }}>Password</label>
                <input type="password" ref={passwordRef} />
              </div>

              <div>
                <button
                  onClick={loginUser}
                  style={{
                    fontSize: "21px",
                    padding: "10px",
                  }}
                >
                  LOGIN NA SIGE NA
                </button>
              </div>
            </form>
          </div>
        )}
      </GlobalProvider>
    </div>
  );
}

export default App;
